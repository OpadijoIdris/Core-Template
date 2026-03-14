import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getOpenConversationsAdmin, 
  getConversationByIdAdmin, 
  sendAdminMessage as sendAdminMessageApi,
  closeConversationAdmin as closeConversationApi
} from "@/services/chatApi";
import { Conversation } from "@/types/chat";
import { toast } from "react-toastify";

export function useAdminSupport() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchConversations = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const response = await getOpenConversationsAdmin();
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (err) {
      if (!isPolling) setError("Failed to fetch open conversations.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, []);

  const fetchSelectedConversation = useCallback(async (conversationId: string, isPolling = false) => {
    try {
      const response = await getConversationByIdAdmin(conversationId);
      if (response.success) {
        setSelectedConversation(response.conversation);
      }
    } catch (err) {
      console.error("Error fetching detailed conversation", err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    
    // Poll the list of conversations every 15 seconds
    const listPoll = setInterval(() => fetchConversations(true), 15000);
    
    return () => clearInterval(listPoll);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      // Poll the currently open chat every 5 seconds for faster admin response feel
      pollInterval.current = setInterval(() => {
        fetchSelectedConversation(selectedConversation.id, true);
      }, 5000);
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [selectedConversation?.id, fetchSelectedConversation]);

  const selectConversation = (conversationId: string) => {
    const convo = conversations.find(c => c.id === conversationId);
    if (convo) {
      setSelectedConversation(convo);
      fetchSelectedConversation(conversationId);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      setSending(true);
      const response = await sendAdminMessageApi(selectedConversation.id, content);
      if (response.success) {
        // Refresh selected conversation immediately
        fetchSelectedConversation(selectedConversation.id, true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const closeConversation = async (reason?: string) => {
    if (!selectedConversation) return;

    try {
      const response = await closeConversationApi(selectedConversation.id, reason);
      if (response.success) {
        toast.success("Conversation closed successfully.");
        setSelectedConversation(null);
        fetchConversations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to close conversation.");
    }
  };

  return { 
    conversations, 
    selectedConversation, 
    loading, 
    sending, 
    error, 
    selectConversation, 
    sendMessage, 
    closeConversation,
    refresh: fetchConversations 
  };
}
