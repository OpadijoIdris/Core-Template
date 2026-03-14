import prisma from "../config/postgres.js";
import { randomUUID } from "crypto";
import { initiatePaystackRefund } from "./refund.service.js";

export const createOrderFromCart = async ({
  userId,
  paymentProvider,
  idempotencyKey
}) => {
  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.$queryRaw`
      SELECT id, subtotal, total, currency FROM "Order"
      WHERE idempotency_key = ${idempotencyKey}
      FOR UPDATE
    `;

    if (existingOrder.length > 0) {
      const order = existingOrder[0];
      return {
        orderId: order.id,
        amount: order.total,
        currency: order.currency
      };
    }

    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    let subtotal = 0;
    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product.name}`);
      }
      subtotal += Number(item.product.price) * item.quantity;
    }

    const total = subtotal; // Assuming no shipping/taxes for now

    const newOrder = await tx.order.create({
      data: {
        id: randomUUID(),
        user_id: userId,
        payment_provider: paymentProvider,
        idempotency_key: idempotencyKey,
        subtotal: subtotal,
        total: total,
        currency: "NGN", // Or derive from user/request
        items: {
          create: cart.items.map(item => ({
            id: randomUUID(),
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Automatically clear cart for POD orders since they are essentially "placed"
    if (paymentProvider === "PAY_ON_DELIVERY") {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return {
      orderId: newOrder.id,
      amount: newOrder.total,
      currency: newOrder.currency
    };
  });
};


export const getUserOrderService = async ({ 
  userId,
  page = 1, 
  limit = 10,
  status
}) => {
  const safePage = Math.max(Number(page), 1);
  const safeLimit = Math.min(Number(limit), 50);
  const skip = (safePage - 1) * safeLimit;

  const whereClause = {
    user_id: userId,
    ...(status && { status })
  };

  const [orders, totalOrders] = await prisma.$transaction([
    prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      include: {
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      }
    }),
    prisma.order.count({ where: whereClause })
  ]);

  const formattedOrders = orders.map(order => ({
    id: order.id,
    status: order.status,
    payment_status: order.payment_status,
    payment_provider: order.payment_provider,
    total: order.total,
    currency: order.currency,
    createdAt: order.createdAt,
    refundStatus: order.refundStatus,
    refundReference: order.refundReference,
    refundAmount: order.refundAmount,
    refundedAt: order.refundedAt,
    cancelledAt: order.cancelledAt,
    items: order.items.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      price: item.price,
      quantity: item.quantity
    }))
  }));

  return {
    page: safePage,
    limit: safeLimit,
    totalOrders,
    orders: formattedOrders
  };
};

export const getOrderByIdService = async ({ userId, orderId, isAdmin = false }) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      ...(isAdmin ? {} : { user_id: userId })
    },
    include: {
      items: {
        include: {
          product: true 
        }
      },
      user: true
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order; 
};

export const getAllOrderAdminService = async ({ 
  page = 1,
  limit = 20,
  status, 
  paymentStatus,
  paymentProvider
}) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(paymentStatus && { payment_status: paymentStatus }),
    ...(paymentProvider && { payment_provider: paymentProvider })
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        items: {
          select: {
            quantity: true, 
            price: true
          }
        }
      }

    }),
    prisma.order.count({ where })
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },

    orders: orders.map(order => ({
      id: order.id,
      user: order.user,
      status: order.status,
      payment_status: order.payment_status,
      payment_provider: order.payment_provider,
      total: order.total,
      currency: order.currency,
      itemsCount: order.items.length,
      createdAt: order.createdAt
    }))
  }
};

export const getSingleOrderAdminService = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select:{
          id: true,
          email: true       
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  if(!order) {
    throw new Error ("Order not found")
  }

  return order;
};

export const updateOrderStatusAdminService = async ({ orderId, newStatus }) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if(!order) {
      throw new Error ("Order not found")
    }

    if(order.status === "CANCELLED") {
      throw new Error ("Cancelled errors cannot be modified")
    };

    if(order.status === "FULFILLED") {
      throw new Error ("Order already fulfiled")
    };

    // LOGIC FOR PAY ON DELIVERY FULFILLMENT
    if(newStatus === "FULFILLED") {
        if (order.payment_provider === "PAY_ON_DELIVERY" && order.payment_status === "PENDING") {
            // Check stock before final fulfillment
            for (const item of order.items) {
                if (item.product.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.product.name}. Cannot fulfill.`);
                }
            }

            // Deduct Stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { decrement: item.quantity } }
                });
            }

            // Update payment status
            await tx.order.update({
                where: { id: orderId },
                data: { payment_status: "SUCCESS" }
            });
        } else if (order.payment_status !== "SUCCESS") {
            throw new Error ("Cannot fulfil unpaid order");
        }
    }

    if(!["FULFILLED", "CANCELLED"].includes(newStatus)) {
      throw new Error ("Invalid order status")
    };

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus
      }
    })
  })
};

export const cancelOrderAsAdmin = async ({ orderId }) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });

    if (!order) throw new Error("Order not found");
    if (order.status === "FULFILLED") throw new Error("Cannot cancel a fulfilled order");
    if (order.payment_status !== "SUCCESS") throw new Error("Only paid orders can be cancelled");
    if (order.status === "CANCELLED") throw new Error("Order already cancelled");

    const refund = await initiatePaystackRefund({
      paymentReference: order.payment_reference,
      amount: order.total
    });

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        refundStatus: "REQUESTED",
        refundReference: refund.refundReference,
        refundAmount: order.total,
        cancelledAt: new Date()
      }
    });

    return updatedOrder;
  });
};

export const getOrderAuditForUser = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user_id: userId,
    },
    select: { id: true },
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  const audits = await prisma.orderAudit.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });

  return audits;
};

export const getOrderAuditForAdmin = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const audits = await prisma.orderAudit.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });

  return audits;
};

