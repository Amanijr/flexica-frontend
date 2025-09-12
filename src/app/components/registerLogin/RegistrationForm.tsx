"use client";

import { customAuth } from "@/app/auth/auth";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  api?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await customAuth.register(formData);
      // Success → redirect to login
      router.push("/login");
    } catch (err: any) {
      setErrors({ api: err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 px-4 sm:px-6 md:px-8 py-8 border rounded-2xl bg-white shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-black">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-1 text-black font-normal">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-[#FFFFFF] text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-black font-normal">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-[#FFFFFF] text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block mb-1 text-black font-normal">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-[#FFFFFF] text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-1 text-black font-normal">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-[#FFFFFF] text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-black font-normal">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-[#FFFFFF] text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* API Error Display */}
        {errors.api && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {errors.api}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-500 text-white rounded-2xl text-lg font-medium hover:bg-blue-400 transition"
        >
          Register
        </button>
      </form>

      <p className="text-center text-blue-700 mt-4 text-sm sm:text-base">
        Already have an account?{" "}
        <a href="/login" className="underline text-blue-700">
          Login here
        </a>
      </p>
    </div>
  );
}
