// lib/smartRoleManager.ts - Frontend-only solution for role management

import { getUserRoleFromToken, isVendorRole, isAdminRole } from './jwtUtils';

interface RoleOverride {
  role: string;
  businessName?: string;
  timestamp: number;
  reason: string;
}

const ROLE_OVERRIDE_KEY = 'role_override';
const OVERRIDE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class SmartRoleManager {
  
  /**
   * Set a role override after successful vendor registration
   * This allows the frontend to work with VENDOR permissions even if JWT has old role
   */
  static setRoleOverride(role: string, businessName?: string, reason: string = 'vendor_registration') {
    const override: RoleOverride = {
      role,
      businessName,
      timestamp: Date.now(),
      reason
    };
    
    localStorage.setItem(ROLE_OVERRIDE_KEY, JSON.stringify(override));
  }

  /**
   * Get the effective role (JWT role or override if valid)
   */
  static getEffectiveRole(): string | null {
    const token = localStorage.getItem('auth_token');
    const jwtRole = token ? getUserRoleFromToken(token) : null;
    
    // Check for valid role override
    const override = this.getValidRoleOverride();
    
    if (override) {
      return override.role;
    }
    
    return jwtRole;
  }

  /**
   * Check if user has vendor permissions (considering overrides)
   */
  static hasVendorPermissions(): boolean {
    const effectiveRole = this.getEffectiveRole();
    return isVendorRole(effectiveRole) || isAdminRole(effectiveRole);
  }

  /**
   * Check if user has admin permissions (considering overrides)
   */
  static hasAdminPermissions(): boolean {
    const effectiveRole = this.getEffectiveRole();
    return isAdminRole(effectiveRole);
  }

  /**
   * Get valid role override if it exists and hasn't expired
   */
  private static getValidRoleOverride(): RoleOverride | null {
    try {
      const stored = localStorage.getItem(ROLE_OVERRIDE_KEY);
      if (!stored) return null;

      const override: RoleOverride = JSON.parse(stored);
      const now = Date.now();
      
      // Check if override is still valid (not expired)
      if (now - override.timestamp > OVERRIDE_DURATION) {
        localStorage.removeItem(ROLE_OVERRIDE_KEY);
        return null;
      }

      return override;
    } catch (error) {
      console.error('Error parsing role override:', error);
      localStorage.removeItem(ROLE_OVERRIDE_KEY);
      return null;
    }
  }

  /**
   * Clear role override (e.g., after successful re-login)
   */
  static clearRoleOverride() {
    localStorage.removeItem(ROLE_OVERRIDE_KEY);
  }

  /**
   * Get role status information for debugging
   */
  static getRoleStatus() {
    const token = localStorage.getItem('auth_token');
    const jwtRole = token ? getUserRoleFromToken(token) : null;
    const override = this.getValidRoleOverride();
    const effectiveRole = this.getEffectiveRole();
    
    return {
      jwtRole,
      override,
      effectiveRole,
      hasVendorPermissions: this.hasVendorPermissions(),
      hasAdminPermissions: this.hasAdminPermissions(),
      overrideExpiresIn: override ? Math.max(0, OVERRIDE_DURATION - (Date.now() - override.timestamp)) : 0
    };
  }

  /**
   * Handle vendor registration success
   */
  static handleVendorRegistrationSuccess(businessName: string) {
    this.setRoleOverride('ROLE_VENDOR', businessName, 'vendor_registration');
    
    // Also update the stored user role for consistency
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        userData.role = 'ROLE_VENDOR';
        userData.businessName = businessName;
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Handle error silently
      }
    }
  }

  /**
   * Check if we should show a "refresh token" notice
   */
  static shouldShowTokenRefreshNotice(): boolean {
    const status = this.getRoleStatus();
    
    // Show notice if we have an override but JWT role is different
    return !!(status.override && status.jwtRole && status.override.role !== status.jwtRole);
  }

  /**
   * Get user-friendly role display
   */
  static getRoleDisplay(): string {
    const effectiveRole = this.getEffectiveRole();
    const status = this.getRoleStatus();
    
    if (isVendorRole(effectiveRole)) {
      return status.override?.businessName ? `Vendor (${status.override.businessName})` : 'Vendor';
    } else if (isAdminRole(effectiveRole)) {
      return 'Admin';
    } else {
      return 'User';
    }
  }
}