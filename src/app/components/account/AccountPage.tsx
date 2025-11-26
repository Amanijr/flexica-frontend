"use client";

import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  updateBuyerProfile,
  updateVendorProfile,
  UserProfile,
} from "./ProfileApi";
import Link from "next/link";
import { customAuth } from "@/app/auth/auth";

function VendorField({
  label,
  fieldKey,
  value,
  onChange,
  onSave,
}: {
  label: string;
  fieldKey: keyof NonNullable<UserProfile["vendor"]>;
  value: string;
  onChange: (newValue: string) => void;
  onSave: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          {editing ? (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 font-medium">{value || "-"}</p>
          )}
        </div>
        <div className="ml-4 flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  onSave();
                  setEditing(false);
                }}
                className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-gray-600 text-sm font-medium hover:text-gray-800"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-blue-600 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    username: "",
    phone: "",
    email: "",
    vendor: undefined,
  });
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchUserProfile();
      setUser(data);
      setFormData(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSave = async () => {
    try {
      const updated = await updateBuyerProfile({
        username: formData.username,
        phone: formData.phone,
      });
      setUser(updated);
      setFormData(updated);
      setIsEditingPhone(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVendorSave = async () => {
    if (!formData.vendor) return;
    try {
      const updatedVendor = await updateVendorProfile(formData.vendor);
      setUser((prev) => (prev ? { ...prev, vendor: updatedVendor } : prev));
      setFormData((prev) =>
        prev ? { ...prev, vendor: updatedVendor } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            My Account
          </h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.username || "User"}
              </h2>
              {user?.vendor && (
                <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                  Verified Vendor
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Phone Number
                </p>
                {isEditingPhone ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border border-blue-300 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add phone number"
                    />
                    <button
                      onClick={handlePhoneSave}
                      className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setFormData(user!);
                        setIsEditingPhone(false);
                      }}
                      className="px-3 py-2 text-gray-600 text-sm hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">
                      {user?.phone || "Not provided"}
                    </span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="px-3 py-1.5 text-blue-600 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {user?.phone ? "Edit" : "Add"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="py-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Email Address
              </p>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Vendor Section */}
        {user?.vendor && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">
                Vendor Information
              </h3>
            </div>
            <div className="bg-white rounded-xl p-4 space-y-1">
              {(
                [
                  { label: "Business Name", key: "businessName" },
                  { label: "Bank Account Name", key: "bankAccountName" },
                  { label: "Bank Account Number", key: "bankAccountNumber" },
                  { label: "Business TIN", key: "businessTin" },
                  { label: "Vendor Mobile", key: "mobileNumber" },
                  { label: "Mobile Vendor", key: "mobileVendor" },
                ] as const
              ).map(({ label, key }) => (
                <VendorField
                  key={key}
                  label={label}
                  fieldKey={key}
                  value={formData.vendor?.[key] || ""}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      vendor: { ...prev.vendor!, [key]: newValue },
                    }))
                  }
                  onSave={handleVendorSave}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {user?.vendor && (
            <Link
              href="/VendorDashboard"
              className="group relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md p-5 hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-lg">
                    Vendor Dashboard
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}

          <Link
            href="/vendor"
            className="group bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Become Vendor</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/followers"
            className="group bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-100 hover:border-purple-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Orders</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/cartItem"
            className="group bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">My Cart</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/feedback"
            className="group bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Feedback</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/faq"
            className="group bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-100 hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">FAQs</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => customAuth.logout()}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}