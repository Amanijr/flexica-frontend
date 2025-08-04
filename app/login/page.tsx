"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  });

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formData);
    // Add backend API logic here
  };

  return (
    <>
      <style>
        {`
          
          .error {
            color: red;
            fontSize: 14px;
            marginTop: 5px;
          }
        `}
      </style>
      <div style={styles.container}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="email" style={{ color: 'black', fontWeight: 'normal' }}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
             className="p-2 rounded-lg border border-gray-300 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label htmlFor="password" style={{ color: 'black', fontWeight: 'normal' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            className="p-2 rounded-lg border border-gray-300 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <label htmlFor="confirmPassword" style={{ color: 'black', fontWeight: 'normal' }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your Password"
             className="p-2 rounded-lg border border-gray-300 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <button type="submit" style={styles.button}>
            +Login
          </button>
          <p className="text-center text-blue-700 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="underline text-blue-700">Register here</a>
          </p>
        </form>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "350px",
    margin: "30px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
    color: "black"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    backgroundColor: "white",
  },
  input: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #aaa",
    fontSize: "16px",
    background: "#5DE2E7",
    fontWeight: "normal"
  },
  button: {
    padding: "10px",
    backgroundColor: "#5DE2E7",
    color: "black",
    border: "none",
    fontSize: "16px",
    borderRadius: "20px",
    cursor: "pointer",
    width: "230px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    margin: "30px"
  },
  label: {
    color: "#5DE2E7",
    fontSize: "16px",
    fontWeight: "200px",
    marginRight: "10px",
  },
  p: {
    color: "#5DE2E7"
  }
};