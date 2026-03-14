import prisma from "../config/postgres.js";

export const getOrCreateConversation = async (userId, orderId = null) => {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      userId,
      orderId: orderId || null,
      status: "OPEN",
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  return prisma.conversation.create({
    data: {
      userId,
      orderId: orderId || null,
    },
  });
};

export const sendMessage = async ({
  conversationId,
  senderId,
  senderRole,
  content,
}) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.status === "CLOSED") {
    throw new Error("Conversation is closed");
  }

  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      senderRole,
      content,
    },
  });
};

export const getConversationWithMessages = async ({ conversationId, userId, orderId }) => {
  const includeClause = {
    messages: {
      orderBy: { createdAt: "asc" },
    },
    user: {
      select: {
        id: true,
        email: true,
      },
    },
    order: {
      select: {
        id: true,
        total: true,
        currency: true,
        status: true,
      }
    }
  };

  if (conversationId) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: includeClause,
    });
  }

  if (userId) {
    // Find the user's most recently updated conversation for this order (or general).
    return prisma.conversation.findFirst({
      where: { 
        userId,
        orderId: orderId || null
      },
      include: includeClause,
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return null;
};

export const getUserConversation = async (userId) => {
  return prisma.conversation.findFirst({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

export const getAllOpenConversations = async () => {
  return prisma.conversation.findMany({
    where: { status: "OPEN" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      order: {
        select: {
          id: true,
          total: true,
          currency: true,
        }
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const closeConversation = async ({
  conversationId,
  adminId,
  reason,
}) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.status === "CLOSED") {
    return conversation;
  }

  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      closedBy: adminId,
      closedReason: reason || null,
    },
  });
};
