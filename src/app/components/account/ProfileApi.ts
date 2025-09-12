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
  username: string;
  phone: string;
  email: string;
  vendor?: VendorProfile;
}

// Fetch user profile
export async function fetchUserProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/profile/viewProfile");
}

// Edit buyer profile
export async function updateBuyerProfile(data: {
  username: string;
  phone: string;
}) {
  return apiRequest<UserProfile>("/profile/editBuyer", {
    method: "PATCH",
    data,
  });
}

// Edit vendor profile
export async function updateVendorProfile(data: Partial<VendorProfile>) {
  return apiRequest<VendorProfile>("/profile/editVendor", {
    method: "PATCH",
    data,
  });
}
