import { Order } from "./order";

export type MessageSenderRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM' | 'SUB_ADMIN';
export type ConversationStatus = 'OPEN' | 'CLOSED';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string | null;
  senderRole: MessageSenderRole;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  orderId?: string | null;
  order?: Order | null;
  user?: {
    id: string;
    email: string;
  };
  status: ConversationStatus;
  closedAt: string | null;
  closedBy: string | null;
  closedReason: string | null;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  success: boolean;
  conversation: Conversation;
}

export interface AdminConversationsResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}
