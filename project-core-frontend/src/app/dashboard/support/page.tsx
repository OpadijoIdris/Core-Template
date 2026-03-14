"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserChat } from "@/hooks/useUserChat";
import { useSearchParams } from "next/navigation";
import { 
  FiSend, 
  FiMessageSquare, 
  FiClock, 
  FiCheck, 
  FiAlertCircle, 
  FiUser, 
  FiHelpCircle,
  FiShoppingBag
} from "react-icons/fi";
import { MessageSenderRole } from "@/types/chat";

const SupportPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || undefined;
  const { conversation, loading, sending, error, sendMessage } = useUserChat(orderId);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    sendMessage(messageContent);
    setMessageContent("");
  };

  const isUserMessage = (role: MessageSenderRole) => role === "USER";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {orderId ? "Order Support" : "Customer Support"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {orderId ? `Inquiry regarding order #${orderId.slice(0,8)}` : "Chat directly with our team for assistance."}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          Support Online
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-grow min-h-[500px] h-[70vh]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className={`w-10 h-10 ${orderId ? 'bg-orange-500' : 'bg-blue-600'} text-white rounded-xl flex items-center justify-center`}>
            {orderId ? <FiShoppingBag className="w-6 h-6" /> : <FiMessageSquare className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Support Representative</p>
            <p className="text-xs text-gray-400">
              {orderId ? "Specialized Order Assistance" : "General Support"}
            </p>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {loading ? (
             <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-900 font-bold mb-1">Failed to connect to chat</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : !conversation?.messages || conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <FiHelpCircle className="w-16 h-16 text-blue-100 mb-4" />
              <p className="text-gray-900 font-bold mb-2">How can we help you today?</p>
              <p className="text-gray-500 text-sm max-w-xs">
                Feel free to send us a message and our support team will get back to you shortly.
              </p>
            </div>
          ) : (
            conversation.messages.map((msg, idx) => {
              const fromUser = isUserMessage(msg.senderRole);
              return (
                <div key={msg.id || idx} className={`flex ${fromUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${fromUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${fromUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {fromUser ? <FiUser /> : 'S'}
                    </div>
                    <div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        fromUser 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-2 mt-1.5 ${fromUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {fromUser && (
                           <span className="text-blue-500"><FiCheck className="w-3 h-3" /></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          {conversation?.status === 'CLOSED' ? (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center gap-2 text-sm text-red-700 font-medium">
              <FiAlertCircle /> This conversation has been closed by support.
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={sending || !messageContent.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center min-w-[50px] shadow-lg shadow-blue-100"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend className="w-5 h-5" />
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
