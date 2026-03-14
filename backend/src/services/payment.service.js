import pool from "../config/pool.js";
// import Stripe from "stripe";
import axios from "axios";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initializePayment = async ({
    provider,
    orderId,
    amount,
    email,
    currency
}) => {
    switch (provider) {
        case "PAYSTACK":
            return createPaystackPayment({ orderId, amount, email, currency });
        case "PAY_ON_DELIVERY":
            return {
                provider: "PAY_ON_DELIVERY",
                reference: `POD-${orderId.split('-')[0]}-${Date.now()}`
            };
        // case "STRIPE":
        //     return createStripePayment({ orderId, amount, currency });    
        default: 
            throw new Error("Unsupported payment provider");
    }
};

const createPaystackPayment = async ({ orderId, amount, currency, email }) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        callback_url: `${frontendUrl}/payment/success`,
        metadata: { orderId }
    }, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const { reference, authorization_url } = response.data.data;

    await pool.query(
        `UPDATE "Order"
         SET payment_reference = $1,
             payment_provider = 'PAYSTACK',
             "updatedAt" = NOW()
         WHERE id = $2`, 
        [reference, orderId]
    );

    return {
        provider: "PAYSTACK",
        authorizationUrl: authorization_url,
        reference
    }
}

//  const createStripePayment = async ({ orderId, amount, currency }) => {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(amount * 100),
//         currency: currency.toLowerCase(),
//         metadata: { orderId }
//     });
//     await pool.query(
//         `UPDATE "Order"
//          SET payment_reference = $1,
//              payment_provider = 'STRIPE'
//          WHERE id = $2`,
//         [paymentIntent.id, orderId]
//     );

//     return {
//         provider: "STRIPE",
//         clientSecret: paymentIntent.client_secret
//     }
// }

