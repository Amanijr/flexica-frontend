// src/app/lib/profileApi.ts
import { apiRequest } from "../../lib/apiGateway";

export interface VendorProfile {
  businessName: string;
  businessTin?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  mobileVendor?: string;
  mobileNumber?: string;
}

export interface UserProfile {
    userId?: number;
    username: string;
    phone: string;
    email: string;
    role?: "USER" | "ADMIN";
    vendor?: VendorProfile;
  }
  
// Fetch user profile
export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await apiRequest<{ data: UserProfile }>("/profile/viewProfile");
  return response.data; 
}

// Edit buyer profile
export async function updateBuyerProfile(data: {
  username: string;
  phone: string;
}) {
  const response = await apiRequest<{ data: UserProfile }>("/profile/editBuyer", {
    method: "PATCH",
    data,
  });
  return response.data;
}

// Edit vendor profile
export async function updateVendorProfile(data: Partial<VendorProfile>) {
  const response = await apiRequest<{ data: VendorProfile }>("/profile/editVendor", {
    method: "PATCH",
    data,
  });
  return response.data;
}
