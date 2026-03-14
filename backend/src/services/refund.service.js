import axios from "axios";

export const initiatePaystackRefund = async ({ paymentReference, amount }) => {
  try {
    const payload = { transaction: paymentReference };
    if (amount) {
      payload.amount = Math.round(amount * 100); 
    }

    const response = await axios.post("https://api.paystack.co/refund", payload, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = response.data;

    return {
      refundReference: data.data.reference,
      status: data.status
    };
  } catch (error) {
    const errData = error.response?.data;
    console.error("Paystack refund error:", errData || error.message);

    if (errData?.code === "transaction_reversed" && errData?.data?.existing_refunds?.length) {
      const existing = errData.data.existing_refunds[0];
      return {
        refundReference: existing.reference,
        status: "already_exists"
      };
    }

    throw new Error("Refund initialization failed");
  }
};
