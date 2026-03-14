import axiosInstance from "@/lib/axios";

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  payment: {
    provider: "PAYSTACK" | "STRIPE";
    authorizationUrl?: string; // For Paystack
    clientSecret?: string;     // For Stripe (if enabled)
    reference: string;
  };
}

export const initializeCheckout = async (paymentProvider: string): Promise<CheckoutResponse> => {
  const res = await axiosInstance.post("/checkout", { paymentProvider });
  return res.data;
};
