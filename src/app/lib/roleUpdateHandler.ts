// lib/roleUpdateHandler.ts

import { customAuth } from '@/app/auth/auth';

export async function handleRoleUpdateAfterVendorRegistration(businessName: string) {
  try {
    // Get current user data
    const currentUser = localStorage.getItem('user');
    
    if (!currentUser) {
      return false;
    }

    const user = JSON.parse(currentUser);
    
    // Update the stored role
    const updatedUser = {
      ...user,
      role: 'ROLE_VENDOR', // Backend uses ROLE_VENDOR format
      businessName: businessName // Store business name for reference
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function forceReLoginAfterRoleUpdate() {
  try {
    console.log('Forcing re-login after role update...');
    
    // Get current user email
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      console.error('No user session found');
      return false;
    }

    const user = JSON.parse(currentUser);
    const email = user.email;
    
    if (!email) {
      console.error('No email found in user session');
      return false;
    }

    // Clear current session
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Redirect to login with a message
    const message = 'Your role has been updated to VENDOR. Please log in again to get the updated permissions.';
    window.location.href = `/login?message=${encodeURIComponent(message)}`;
    
    return true;
  } catch (error) {
    console.error('Error forcing re-login:', error);
    return false;
  }
}