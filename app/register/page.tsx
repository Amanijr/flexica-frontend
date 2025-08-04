"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  fullName: string;
  email: string;
  address: string;
  password: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  address?: string;
  password?: string;
}

export default function register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    fullName: undefined,
    email: undefined,
    address: undefined,
    password: undefined,
  });

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.address && formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters if provided";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="fullName" style={{ color: 'black', fontWeight: 'normal' }}>Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter Full Name"
            className="p-2 rounded-lg border border-gray-300 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          <label htmlFor="email" style={{ color: 'black', fontWeight: 'normal' }}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            className="p-2 rounded-lg border border-gray-400 text-black placeholder-gray-600 bg-[#B4F8FB]"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}

            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label htmlFor="address" style={{ color: 'black', fontWeight: 'normal' }}>Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your Address"
            className="p-2 rounded-lg border border-gray-400 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}

          />
          {errors.address && <p className="error">{errors.address}</p>}

          <label htmlFor="password" style={{ color: 'black', fontWeight: 'normal' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            className="p-2 rounded-lg border border-gray-400 text-black placeholder-gray-350 bg-[#B4F8FB]"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}

            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" style={styles.button}>
            +Register
          </button>
          <p className="text-center text-blue-700 mt-4">
            Already have an account?{' '}
            <a href="/login" className="underline text-blue-700">Login here</a>
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
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "20px",
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
    gap: "10px",
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
    borderRadius: "40px",
    cursor: "pointer",
    width: "250px",
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