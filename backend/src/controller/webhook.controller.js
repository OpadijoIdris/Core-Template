import crypto from "crypto";
import prisma from "../config/postgres.js";

export const handlePaystackWebhooks = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest("hex");

  if (hash !== signature) {
    console.error("Paystack webhook: Signature verification failed.");
    return res.sendStatus(401);
  }

  const event = JSON.parse(req.body.toString());
  console.log(`Paystack webhook: Received event '${event.event}'.`);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    try {
      await prisma.$transaction(async (tx) => {
        const orderResult = await tx.$queryRaw`
        SELECT id, status, user_id FROM "Order"
        WHERE payment_reference = ${reference}
        FOR UPDATE
      `;
        const order = orderResult[0];

        if (!order) {
          throw new Error("Order not found for reference: " + reference);
        }

        if (order.status === "PAID") {
          return;
        }

        const orderItems = await tx.orderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }

        const cart = await tx.cart.findUnique({
          where: { userId: order.user_id },
        });

        if (cart) {
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            payment_status: "SUCCESS",
          },
        });
      });

      return res.sendStatus(200);
    } catch (err) {
      console.error("Paystack charge.success webhook error:", err.message);
      return res.sendStatus(500);
    }
  } else if (event.event === "refund.processed") {
    const { status, transaction_reference } = event.data;
    console.log(
      `Paystack refund webhook: Received status '${status}' for transaction '${transaction_reference}'.`
    );

    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: {
            payment_reference: transaction_reference,
          },
          include: {
            items: true,
          },
        });

        if (!order) {
          console.error(
            `Paystack refund webhook: Order not found for transaction reference '${transaction_reference}'.`
          );
          return;
        }

        if (
          order.refundStatus === "SUCCESS" ||
          order.refundStatus === "FAILED"
        ) {
          console.log(
            `Paystack refund webhook: Order ${order.id} is already in a final refund state. Ignoring.`
          );
          return;
        }

        if (status === "processed") {
          console.log(
            `Paystack refund webhook: Processing SUCCESS for order ${order.id}.`
          );
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
          }

          await tx.order.update({
            where: { id: order.id },
            data: {
              refundStatus: "SUCCESS",
              status: "CANCELLED",
              isPaymentFinalized: true,
              refundedAt: new Date(),
              refundReference:
                event.data.refund_reference || transaction_reference,
            },
          });

          await tx.orderAudit.create({
            data: {
              orderId: order.id,
              action: "REFUND_SUCCESS",
              performedBy: "SYSTEM",
              role: "SYSTEM",
              metadata: {
                provider: "PAYSTACK",
                transactionReference: transaction_reference,
              },
            },
          });
        } else if (status === "failed") {
          console.log(
            `Paystack refund webhook: Processing FAILED for order ${order.id}.`
          );
          await tx.order.update({
            where: { id: order.id },
            data: {
              refundStatus: "FAILED",
            },
          });

          await tx.orderAudit.create({
            data: {
              orderId: order.id,
              action: "REFUND_FAILED",
              performedBy: "SYSTEM",
              role: "SYSTEM",
              metadata: {
                provider: "PAYSTACK",
                transactionReference: transaction_reference,
                failure_reason:
                  event.data.merchant_note || event.data.customer_note,
              },
            },
          });
        } else {
          console.log(
            `Paystack refund webhook: Unhandled status '${status}' for order ${order.id}. No action taken.`
          );
        }
      });

      return res.sendStatus(200);
    } catch (error) {
      console.error("Paystack refund.processed webhook error:", error.message);
      return res.sendStatus(500);
    }
  } else {
    return res.sendStatus(200);
  }
};
