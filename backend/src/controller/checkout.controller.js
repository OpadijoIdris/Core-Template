import { createOrderFromCart } from "../services/order.services.js";
import { initializePayment } from "../services/payment.service.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const email = req.user.email;
        const { paymentProvider } = req.body;

        if(!paymentProvider) {
            return res.status(400).json({
                success: false,
                message: "Payment provider is required"
            });
        }

        const idempotencyKey = req.headers["idempotency-key"] || crypto.randomUUID();

        const order = await createOrderFromCart({
            userId, paymentProvider, idempotencyKey
        });

        const payment = await initializePayment({
            provider: paymentProvider,
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency,
            email
        });

        res.status(200).json({
            success: true,
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency,
            payment
        });
        
    } catch (error) {
        console.error("Checkout error:", error.message);
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}
