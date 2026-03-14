import { 
    getOrCreateConversation,
    sendMessage,
    getConversationWithMessages,
    getUserConversation,
    getAllOpenConversations,
    closeConversation,
 } from "../services/chat.services.js";

 
export const getMyConversation = async (req, res) => {
  const { orderId } = req.query;

  try {
    const conversation = await getOrCreateConversation(req.user.id, orderId);

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendUserMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  try {
    const message = await sendMessage({
      conversationId,
      senderId: req.user.id,
      senderRole: "USER",
      content,
    });

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const conversation = await getUserConversation(req.user.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOpenConversationsAdmin = async (req, res) => {
  try {
    const conversations = await getAllOpenConversations();

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendAdminMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  try {
    const message = await sendMessage({
      conversationId,
      senderId: req.user.id,
      senderRole: req.user.role, // ADMIN or SUPER_ADMIN
      content,
    });

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const closeConversationAdmin = async (req, res) => {
  const { conversationId } = req.params;
  const { reason } = req.body;

  try {
    const conversation = await closeConversation({
      conversationId,
      adminId: req.user.id,
      reason,
    });

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyConversationWithMessages = async (req, res) => {
  const { orderId } = req.query;
  try {
    const conversation = await getConversationWithMessages({ userId: req.user.id, orderId });
    // Professional approach: Return null conversation with 200 instead of 404
    return res.status(200).json({ 
      success: true, 
      conversation: conversation || null 
    });
  } catch (err) {
    console.error("getMyConversationWithMessages error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getConversationWithMessagesAdmin = async (req, res) => {
  try {
    const conversation = await getConversationWithMessages({ conversationId: req.params.conversationId });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    res.json({ success: true, conversation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

