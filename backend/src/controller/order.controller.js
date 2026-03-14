import { 
    getUserOrderService, 
    getOrderByIdService, 
    getAllOrderAdminService, 
    getSingleOrderAdminService, 
    updateOrderStatusAdminService, 
    cancelOrderAsAdmin,
    getOrderAuditForUser,
    getOrderAuditForAdmin
 } from "../services/order.services.js";

export const getMyOrders = async (req, res) => {
    try {
        const result = await getUserOrderService({
            userId: req.user.id,
            page: req.query.page,
            limit: req.query.limit,
            status: req.query.status
        });

        if(!result) {
            return res.status(400).json({
                success: false,
                message: "could not get user orders"
            })
        }

        res.status(200).json({
            success: true,
            data: result
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService({
            orderId: req.params.orderId,
            userId: req.user.id,
            isAdmin: false
        });

        if(!order) {
            return res.status(400).json({
                success: false,
                message: "Could not get order details"
            })
        };

        return res.status(200).json({
            success: true,
            data: order
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getAllOrderAdmin = async (req, res) => {
    try {
        const {
            page, 
            limit,
            status,
            payment_status,
            payment_provider
        } = req.query;

        const result = await getAllOrderAdminService({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status,
            paymentStatus: payment_status,
            paymentProvider: payment_provider
        });

        if(!result) {
            return res.status(400).json({
                success: false,
                message: "Could not get all orders for admin"
            })
        };
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getSingleOrderAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await getSingleOrderAdminService(orderId);

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        };

        res.status(200).json({
            success: true,
            data: order
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if(!orderId) {
            return res.status(404).json({
                success: false,
                message: "Order ID is required"
            })
        }

        const updatedOrder = await updateOrderStatusAdminService({ orderId, newStatus: status });

        if(!updatedOrder) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            })
        }

        res.status(200).json({
            success: true,
            data: updatedOrder
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await cancelOrderAsAdmin({ orderId });

        return res.status(200).json({
            success: true,
            message: "Order cancelled and refund requested",
            order
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export const getMyOrderAudit = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const audits = await getOrderAuditForUser(userId, orderId);

    return res.status(200).json({
      success: true,
      count: audits.length,
      audits,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderAuditAdmin = async (req, res) => {
  const { orderId } = req.params;

  try {
    const audits = await getOrderAuditForAdmin(orderId);

    return res.status(200).json({
      success: true,
      count: audits.length,
      audits,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

