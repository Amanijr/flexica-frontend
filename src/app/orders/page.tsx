"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyOrders, Order, OrderStatus } from "@/app/lib/orderApi";
import { AuthGuard } from "@/app/auth/authGuard";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "PAID":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "DELIVERED":
        return <Package className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <button
              onClick={loadOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">Failed to load orders</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-6 h-6 text-gray-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                        {order.createdAt && (
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium text-gray-800">
                        {order.orderItems?.length || 0} item(s)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-xl font-bold text-blue-600">
                        TZS {order.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                      <div className="space-y-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg"
                          >
                            <span className="text-gray-700">
                              {item.productName || `Product #${item.productId}`}
                            </span>
                            <span className="text-gray-600">
                              Qty: {item.quantity} × TZS {item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
