"use client";

import { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { customAuth } from "@/app/auth/auth";
import { useSession } from "@/app/auth/SessionContext";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string; // optional for login
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  api?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { refreshSession } = useSession();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return "Weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[\W]/.test(password))
      return "Strong";
    return "Medium";
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await customAuth.login(formData.email, formData.password);
      await refreshSession();
      router.push("/"); // Redirect after session is available
    } catch (err: any) {
      setErrors({ api: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="max-w-md w-full mx-auto mt-10 px-4 py-8 border rounded-2xl bg-white shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-black">Login</h2>

      <div className="flex flex-col gap-4">
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
            className="w-full p-3 rounded-2xl border border-gray-300 bg-white text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="block mb-1 text-black font-normal">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 pr-10 rounded-2xl border border-gray-300 bg-white text-black placeholder-gray-350 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {!errors.password && formData.password && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === "Weak"
                  ? "text-red-500"
                  : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              Strength: {passwordStrength}
            </p>
          )}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* API Error Display */}
        {errors.api && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {errors.api}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 mt-6 text-white rounded-2xl text-lg font-medium transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="text-center text-blue-700 mt-4 text-sm sm:text-base">
        Don't have an account?{" "}
        <a href="/registration" className="underline">
          Register here
        </a>
      </p>
    </div>
  );
}
