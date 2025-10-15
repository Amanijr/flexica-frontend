// import { apiRequest } from "./apiGateway";

// export interface UserProfile {
//   userId: string;
//   username: string;
//   email: string;
//   phone: string;
//   role: string;
//   joinDate: string;
//   preferences?: {
//     notifications: boolean;
//     newsletter: boolean;
//     twoFactor: boolean;
//   };
//   stats?: {
//     totalOrders: number;
//     totalSpent: number;
//     memberSince: string;
//   };
// }

// export interface EditProfileData {
//   username: string;
//   phone: string;
// }

// export const profileApi = {
//   // Get user profile data
//   async getProfile(): Promise<UserProfile> {
//     return apiRequest("/profile/buyer", {
//       method: "GET",
//       requiresAuth: true,
//     });
//   },

//   // Update user profile
//   // async updateProfile(data: EditProfileData): Promise<{ message: string; data: any }> {
//   //   return apiRequest("/profile/editBuyer", {
//   //     method: "PATCH",
//   //     body: JSON.stringify(data),
//   //     requiresAuth: true,
//   //   });
//   // },
// };