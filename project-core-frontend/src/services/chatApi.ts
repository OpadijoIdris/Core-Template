import axiosInstance from "@/lib/axios";
import { 
  ChatResponse, 
  AdminConversationsResponse, 
  SendMessageResponse,
} from "@/types/chat";

// User side
export const getMyConversation = async (orderId?: string): Promise<ChatResponse> => {
  const params = orderId ? `?orderId=${orderId}` : '';
  const res = await axiosInstance.get(`/chat/me/conversation${params}`);
  return res.data;
};

export const createMyConversation = async (orderId?: string): Promise<ChatResponse> => {
  const params = orderId ? `?orderId=${orderId}` : '';
  const res = await axiosInstance.get(`/chat/me${params}`);
  return res.data;
};

export const sendUserMessage = async (conversationId: string, content: string): Promise<SendMessageResponse> => {
  const res = await axiosInstance.post("/chat/me/message", { conversationId, content });
  return res.data;
};

// Admin side
export const getOpenConversationsAdmin = async (): Promise<AdminConversationsResponse> => {
  const res = await axiosInstance.get("/chat/admin/open");
  return res.data;
};

export const getConversationByIdAdmin = async (conversationId: string): Promise<ChatResponse> => {
  const res = await axiosInstance.get(`/chat/admin/${conversationId}`);
  return res.data;
};

export const sendAdminMessage = async (conversationId: string, content: string): Promise<SendMessageResponse> => {
  const res = await axiosInstance.post("/chat/admin/message", { conversationId, content });
  return res.data;
};

export const closeConversationAdmin = async (conversationId: string, reason?: string): Promise<ChatResponse> => {
  const res = await axiosInstance.patch(`/chat/admin/${conversationId}/close`, { reason });
  return res.data;
};
