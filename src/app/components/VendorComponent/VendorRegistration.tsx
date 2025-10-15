"use client";

import { useState } from "react";
import { registerVendor, VendorRegistration } from "./VendorApi";
import { handleRoleUpdateAfterVendorRegistration } from "../../lib/roleUpdateHandler";
import { SmartRoleManager } from "../../lib/smartRoleManager";
import { useRouter } from "next/navigation";


export default function VendorRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<VendorRegistration>({
    businessName: "",
    businessTin: "",
    bankAccountName: "",
    bankAccountNumber: "",
    mobileVendor: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await registerVendor(formData);
      
      // Extract business name from response
      const businessName = response.data || formData.businessName;
      
      // Use Smart Role Manager to handle the role update
      SmartRoleManager.handleVendorRegistrationSuccess(businessName);
      
      // Also update the stored role for consistency
      const roleUpdated = await handleRoleUpdateAfterVendorRegistration(businessName);
      
      if (roleUpdated) {
        setSuccessMsg(` Registered successfully! Your role has been updated to VENDOR for ${businessName}. You can now manage products immediately!`);
      } else {
        setSuccessMsg("Registered successfully! Please refresh the page to see your updated role.");
      }

      setTimeout(() => {
       
        router.push("/VendorDashboard");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register as vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Become a Vendor
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Register your business and start selling today 
        </p>

        {/* Messages */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-center text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center text-sm">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Info */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. FlexBuy Enterprises"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Business TIN
            </label>
            <input
              type="text"
              name="businessTin"
              value={formData.businessTin}
              onChange={handleChange}
              placeholder="e.g. 123-456-789"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Bank Info */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Bank Account Name
            </label>
            <input
              type="text"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              placeholder="e.g. 000123456789"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Mobile Info */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Vendor Mobile (Business)
            </label>
            <input
              type="text"
              name="mobileVendor"
              value={formData.mobileVendor}
              onChange={handleChange}
              placeholder="e.g. Vodacom M-Pesa"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Personal Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+255 716 123 456"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
          >
            {loading ? "Registering..." : "Register as Vendor"}
          </button>
        </form>

        {/* Extra */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Already a vendor?{" "}
          <a href="/account" className="text-blue-600 hover:underline font-medium">
            Manage your account
          </a>
        </p>
      </div>
    </div>
  );
}
