
import { apiRequest } from "../../lib/apiGateway";

export interface VendorRegistration {
  businessName: string;
  businessTin: string;
  bankAccountName: string;
  bankAccountNumber: string;
  mobileVendor: string;
  mobileNumber: string;
}

export async function registerVendor(data: VendorRegistration) {
    try {
        const response = await apiRequest<any>("/role/becomeVendor", {
          method: "POST",
          data,
          requiresAuth: true,
        });
    
        // Log the backend response for debugging
        console.log("Vendor registration response:", response);
    
        return response;
      } catch (error) {
        console.error("Vendor registration error:", error);
        throw error;
      }
    }
