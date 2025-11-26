"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/hooks/cart";
import { placeOrder } from "@/app/lib/orderApi";
import { AuthGuard } from "@/app/auth/authGuard";
import PaymentForm from "@/app/components/checkout/payment-form";
import { ShoppingBag, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getFormattedSubtotal, getTotalItems, clearCart, syncToServer } = useCartStore();
  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ orderId: number; totalPrice: number } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(null), 4500);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Local cart items:", items.length);
      
      // First, ensure cart is synced to backend
      console.log("Syncing cart to backend...");
      // call syncToServer(true) to force immediate sync
      await syncToServer(true);
      
      console.log("Cart synced, placing order...");
      const response = await placeOrder();
      console.log("Order placed successfully:", response);
      
      // Store order details for payment
      setOrderDetails({
        orderId: response.orderId,
        totalPrice: response.totalPrice
      });
      
      // Order created successfully, proceed to payment
      setStep("payment");
    } catch (err: any) {
      console.error("Failed to place order:", err);
      // Detect insufficient stock messages from backend and show toast
      const msg = String(err?.message || err || "");
      if (/insufficient stock/i.test(msg) || /cannot demand more than available/i.test(msg) || /can not demand/i.test(msg) || /not enough stock/i.test(msg) || /available=\d+, demanded=\d+/i.test(msg)) {
        showToast("Order failed: some items exceed available stock. Please adjust your cart.");
      }
      // Provide helpful error messages
      if (err.message?.includes("cart is empty") || err.message?.includes("no items")) {
        setError("Your cart appears to be empty on the server. Please refresh and try again.");
      } else if (err.message?.includes("401") || err.message?.includes("403")) {
        setError("Please log in to place an order.");
      } else {
        setError(err.message || "Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    console.log("Payment successful, clearing cart and refreshing order status");
    try {
      // Clear cart locally and on server
      clearCart();
      // Small delay to ensure server has committed the order
      await new Promise(resolve => setTimeout(resolve, 500));
      setStep("success");
    } catch (err) {
      console.error("Error during post-payment cleanup:", err);
      setStep("success"); // Still proceed to success screen
    }
  };

  if (items.length === 0 && step === "review") {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products before checking out</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (step === "success") {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been successfully placed and payment is being processed.
            </p>
            <div className="space-y-3">
              <button
                onClick={async () => {
                  // Give server a moment to fully commit order before navigating
                  await new Promise(resolve => setTimeout(resolve, 300));
                  router.push("/orders");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (step === "payment") {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep("review")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Order Review
            </button>
            {orderDetails && (
              <PaymentForm
                orderId={orderDetails.orderId}
                totalAmount={orderDetails.totalPrice}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep("review")}
              />
            )}
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">Review Your Order</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Order Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Items ({getTotalItems()})</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Image
                    src={typeof item.image === "string" ? item.image : item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">TZS {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">
                      TZS {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{getFormattedSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at payment</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-blue-600">{getFormattedSubtotal()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg shadow-md">
            {toast.message}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

  // Note: unreachable code removed; render toast inside the main return above
