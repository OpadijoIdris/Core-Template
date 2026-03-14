"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAdminSupport } from "@/hooks/useAdminSupport";
import Link from "next/link";
import { 
  FiSend, 
  FiMessageSquare, 
  FiUser, 
  FiSearch, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiMoreVertical,
  FiLoader,
  FiAlertCircle,
  FiShoppingBag,
  FiExternalLink
} from "react-icons/fi";
import { MessageSenderRole } from "@/types/chat";

const AdminSupportPage = () => {
  const { 
    conversations, 
    selectedConversation, 
    loading, 
    sending, 
    error, 
    selectConversation, 
    sendMessage, 
    closeConversation 
  } = useAdminSupport();
  
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    sendMessage(messageContent);
    setMessageContent("");
  };

  const isUserMessage = (role: MessageSenderRole) => role === "USER";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-7xl mx-auto overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Respond to customer inquiries in real-time.</p>
      </div>

      <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden">
        {/* Inbox Sidebar */}
        <aside className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/20">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FiMessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-xs font-medium uppercase tracking-wider">No open conversations</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-white transition-all border-b border-gray-50 text-left ${
                    selectedConversation?.id === convo.id ? 'bg-white shadow-inner border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {convo.user?.email?.[0].toUpperCase() || "U"}
                    </div>
                    {convo.orderId && (
                      <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                        <FiShoppingBag className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-gray-900 truncate">{convo.user?.email}</p>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 truncate mt-0.5 flex-1">
                        {convo.messages && convo.messages.length > 0 
                          ? convo.messages[convo.messages.length - 1].content 
                          : "New inquiry..."}
                      </p>
                      {convo.orderId && (
                        <span className="text-[8px] bg-orange-50 text-orange-600 font-black px-1 rounded border border-orange-100">
                          ORDER
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                    {selectedConversation.user?.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedConversation.user?.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Active Chat</span>
                      </div>
                      
                      {selectedConversation.order && (
                        <>
                          <span className="text-gray-300">|</span>
                          <Link 
                            href={`/admin/orders?search=${selectedConversation.orderId}`}
                            className="flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded border border-orange-100 hover:bg-orange-100 transition-colors"
                          >
                            <FiShoppingBag className="w-2.5 h-2.5" /> 
                            ORDER #{selectedConversation.orderId?.slice(0,8)} 
                            <FiExternalLink className="ml-1" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {selectedConversation.order && (
                    <div className="hidden md:flex flex-col items-end mr-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Order Total</p>
                      <p className="text-sm font-black text-gray-900">
                        {selectedConversation.order.currency} {Number(selectedConversation.order.total).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => closeConversation("Issue resolved")}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-100"
                  >
                    <FiCheckCircle /> Mark as Resolved
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {selectedConversation.messages?.map((msg, idx) => {
                  const isCustomer = isUserMessage(msg.senderRole);
                  return (
                    <div key={msg.id || idx} className={`flex ${!isCustomer ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[75%] ${!isCustomer ? 'flex-row-reverse' : 'flex-row'}`}>
                         <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${!isCustomer ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-200 text-gray-700'}`}>
                          {!isCustomer ? 'A' : (selectedConversation.user?.email?.[0].toUpperCase() || 'U')}
                        </div>
                        <div>
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            !isCustomer 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                          <p className={`text-[10px] text-gray-400 mt-1.5 font-medium ${!isCustomer ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder={`Reply to ${selectedConversation.user?.email}...`}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageContent.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center shadow-lg shadow-blue-100"
                  >
                    {sending ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiSend className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FiMessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h2>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                Choose a customer from the left sidebar to start responding to their inquiries.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSupportPage;
