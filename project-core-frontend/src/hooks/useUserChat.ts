import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getMyConversation, 
  createMyConversation, 
  sendUserMessage as sendUserMessageApi 
} from "@/services/chatApi";
import { Conversation, Message } from "@/types/chat";
import { toast } from "react-toastify";

export function useUserChat(orderId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchConversation = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const response = await getMyConversation(orderId);
      
      if (response.success) {
        if (response.conversation) {
          setConversation(response.conversation);
          setError(null);
        } else if (!isPolling) {
          // No conversation found, but request was successful (200 OK)
          // Try to create one silently
          const createResponse = await createMyConversation(orderId);
          if (createResponse.success) {
            setConversation(createResponse.conversation);
            setError(null);
          }
        }
      } else {
        setError("Could not load your conversation.");
      }
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      // Actual server error (e.g. 500, 401)
      setError(err.response?.data?.message || "Error connecting to support.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchConversation();

    // Set up polling for new messages every 10 seconds
    pollInterval.current = setInterval(() => {
      fetchConversation(true);
    }, 10000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fetchConversation]);

  const sendMessage = async (content: string) => {
    if (!conversation || !content.trim()) return;

    try {
      setSending(true);
      const response = await sendUserMessageApi(conversation.id, content);
      if (response.success) {
        // Optimistically add the message to the list
        setConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...(prev.messages || []), response.message]
          };
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return { conversation, loading, sending, error, sendMessage, refresh: fetchConversation };
}
