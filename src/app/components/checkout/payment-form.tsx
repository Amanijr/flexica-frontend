"use client";

import { useState } from "react";
import { completePayment, PaymentMethod } from "@/app/lib/paymentApi";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

interface PaymentFormProps {
  orderId: number;
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ orderId, totalAmount, onSuccess, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOBILE_MONEY");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        orderId,
        amount: totalAmount,
        paymentMethod,
        ...(paymentMethod === "MOBILE_MONEY" && { phoneNumber, transactionId }),
        ...(paymentMethod === "BANK_TRANSFER" && { bankName, accountNumber }),
      };

      console.log("Submitting payment with method:", paymentMethod, "for orderId:", orderId);
      await completePayment(paymentData);
      console.log("Payment completed successfully");
      // Small delay to ensure backend commits transaction
      await new Promise(resolve => setTimeout(resolve, 200));
      onSuccess();
    } catch (err: any) {
      console.error("Payment error:", err);
      
      // Provide specific error messages based on error type
      let errorMessage = "Payment failed. Please try again.";
      
      if (err.message?.includes("No  Orders Found") || err.message?.includes("no Orders found")) {
        errorMessage = "Order not found or already processed. Please check your orders page.";
      } else if (err.message?.includes("exact amount")) {
        errorMessage = "Payment amount doesn't match order total. Please try again.";
      } else if (err.message?.includes("401") || err.message?.includes("403")) {
        errorMessage = "Session expired. Please log in again.";
      } else if (err.message?.includes("network") || err.message?.includes("timeout")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
    { value: "BANK_TRANSFER", label: "Bank Transfer", icon: CreditCard },
    { value: "CASH_ON_DELIVERY", label: "Cash on Delivery", icon: Banknote },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">Total Amount</p>
        <p className="text-3xl font-bold text-blue-600">
          TZS {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                  className={`p-4 border-2 rounded-lg transition flex flex-col items-center gap-2 ${
                    paymentMethod === method.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      paymentMethod === method.value ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      paymentMethod === method.value ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {paymentMethod === "MOBILE_MONEY" && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="+255 XXX XXX XXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID if already paid"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {paymentMethod === "BANK_TRANSFER" && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                placeholder="Enter bank name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                placeholder="Enter account number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {paymentMethod === "CASH_ON_DELIVERY" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              You will pay in cash when your order is delivered. Please have the exact amount ready.
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
