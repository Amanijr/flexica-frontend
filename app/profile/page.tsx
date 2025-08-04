"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
  password?: string;
  avatar?: string; 
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem("userProfile");
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account?")) {
      localStorage.removeItem("userProfile");
      router.push("/login");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Profile</h2>

      {/* Profile Image */}
      <div style={styles.avatarContainer}>
        <img
          src={profileData.avatar || "/default-avatar.png"}
          alt="Profile Avatar"
          style={styles.avatar}
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
        )}
      </div>

      <div style={styles.profileItem}>
        <strong>Full Name:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            name="fullName"
            value={profileData.fullName || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <span>{profileData.fullName || ""}</span>
        )}
      </div>

      <div style={styles.profileItem}>
        <strong>Email:</strong>{" "}
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={profileData.email || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <span>{profileData.email || ""}</span>
        )}
      </div>

      <div style={styles.profileItem}>
        <strong>Address:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            name="address"
            value={profileData.address || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <span>{profileData.address || ""}</span>
        )}
      </div>

      <div style={styles.profileItem}>
        <strong>Phone:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={profileData.phone || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <span>{profileData.phone || ""}</span>
        )}
      </div>

      <div style={styles.profileItem}>
        <strong>Password:</strong>{" "}
        {isEditing ? (
          <input
            type="password"
            name="password"
            value={profileData.password || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <span>{profileData.password ? "••••••••" : ""}</span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        {isEditing ? (
          <button type="button" onClick={saveProfile} style={styles.saveButton}>
            Save
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)} style={styles.editButton}>
            Edit
          </button>
        )}

        <button type="button" onClick={deleteAccount} style={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    backgroundColor: "white",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "normal",
    color:"black"
  },
  avatarContainer: {
    marginBottom: "20px",
    position: "relative",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #63a4d8ff",
  },
  fileInput: {
    marginTop: "10px",
    cursor: "pointer",
    color:"black"
  },
  profileItem: {
    marginBottom: "15px",
    fontSize: "16px",
    textAlign: "left",
    color:"black"
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    fontSize: "15px",
    width: "90%",
    boxSizing: "border-box",
    color:"black"
  },
  editButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#2196f3",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  customFileLabel: {
  display: "inline-block",
  marginTop: "10px",
  padding: "8px 12px",
  backgroundColor: "#e0e0e0",
  color: "black",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
},

hiddenFileInput: {
  display: "none",
},

};
