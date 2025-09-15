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

/* Child component to render each vendor field */
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
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-sm">{label}</p>
        {editing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full mt-1"
          />
        ) : (
          <p className="text-gray-800 font-medium">{value || "-"}</p>
        )}
      </div>
      <div className="ml-2">
        {editing ? (
          <button
            onClick={() => {
              onSave();
              setEditing(false);
            }}
            className="text-green-600 text-sm font-medium mr-2"
          >
            Save
          </button>
        ) : null}
        <button
          onClick={() => setEditing(!editing)}
          className="text-blue-600 text-sm"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            My Account
          </h1>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* User Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user?.username || "User"}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  {isEditingPhone ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                        placeholder="Add phone number"
                      />
                      <button
                        onClick={handlePhoneSave}
                        className="text-green-600 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setFormData(user!);
                          setIsEditingPhone(false);
                        }}
                        className="text-red-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-600 text-sm">
                        {user?.phone || "No phone number"}
                      </span>
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="text-blue-600 text-sm"
                      >
                        {user?.phone ? "Edit" : "Add"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-gray-800 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Vendor Section */}
        {user?.vendor && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Vendor Information
            </h3>
            <div className="space-y-3">
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

        {/* Menu & Logout */}
        <div className="space-y-2 mt-6">
          <Link
            href="/vendor"
            className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">1. Become Vendor</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          <Link
            href="/followers"
            className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">2. Orders</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          <Link
            href="/cartItem"
            className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">3. My Cart</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          <Link
            href="/feedback"
            className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">4. Feedback</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          <Link
            href="/faq"
            className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">
                5. Frequently Asked Questions
              </span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          <button
            onClick={() => customAuth.logout()}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
