"use client";

import { useEffect, useState } from "react";
import {
  UserProfile,
  VendorProfile,
  fetchUserProfile,
  updateBuyerProfile,
  updateVendorProfile,
} from "@/app/components/account/ProfileApi";
import Link from "next/link";

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
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
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

          {/* Email (read-only) */}
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-gray-800 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {/* Make money */}
          <Link href="/make-money" className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">1. Make money</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          {/* Followers */}
          <Link href="/followers" className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">2. Followers</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          {/* My adverts */}
          <Link href="/my-adverts" className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">3. My adverts</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          {/* Feedback */}
          <Link href="/feedback" className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">4. Feedback</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          {/* Frequently Asked Questions */}
          <Link href="/faq" className="block bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">5. Frequently Asked Questions</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </div>

        {/* Vendor Section (if applicable) */}
        {user?.vendor && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Business Name</p>
                <p className="text-gray-800 font-medium">{user.vendor.businessName}</p>
              </div>
              {/* Add more vendor fields as needed */}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}