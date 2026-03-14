import { Router } from "express";
import { protect, anyAdmin } from "../middlewares/auth.middleware.js";

import {
  getMyConversation,
  sendUserMessage,
  getMyMessages,
  getMyConversationWithMessages,
  getOpenConversationsAdmin,
  getConversationWithMessagesAdmin,
  sendAdminMessage,
  closeConversationAdmin
} from "../controller/chat.controller.js";

const router = Router();

// 1. Get or create my conversation
router.get("/me", protect, getMyConversation);

// 2. Send message as user
router.post("/me/message", protect, sendUserMessage);

// 3. Get only my messages
router.get("/me/messages", protect, getMyMessages);

// 4. Get my conversation + messages
// solution pending
router.get(
  "/me/conversation",
  protect,
  getMyConversationWithMessages
);

// 5. Get all open conversations
router.get(
  "/admin/open",
  protect,
  anyAdmin,
  getOpenConversationsAdmin
);

// 6. Get one conversation + messages
// also this 
router.get(
  "/admin/:conversationId",
  protect,
  anyAdmin,
  getConversationWithMessagesAdmin
);

// 7. Send message as admin
router.post(
  "/admin/message",
  protect,
  anyAdmin,
  sendAdminMessage
);

// 8. Close conversation
router.patch(
  "/admin/:conversationId/close",
  protect,
  anyAdmin,
  closeConversationAdmin
);

export default router;
