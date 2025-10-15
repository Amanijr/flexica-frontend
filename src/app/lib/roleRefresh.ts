// lib/roleRefresh.ts

import { getUserRoleFromToken } from './jwtUtils';

export function refreshUserRoleFromToken() {
  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      console.log('No token or user data found');
      return false;
    }

    const user = JSON.parse(userStr);
    const actualRole = getUserRoleFromToken(token);
    
    if (actualRole && actualRole !== user.role) {
      console.log('Role mismatch detected. Updating stored role...');
      console.log('Stored role:', user.role);
      console.log('JWT role:', actualRole);
      
      // Update the user object with the correct role
      const updatedUser = {
        ...user,
        role: actualRole
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Role updated successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing role from token:', error);
    return false;
  }
}

export function forceRoleRefresh() {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    const actualRole = getUserRoleFromToken(token);
    
    if (actualRole) {
      const updatedUser = {
        ...user,
        role: actualRole
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Role force refreshed to:', actualRole);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error force refreshing role:', error);
    return false;
  }
}