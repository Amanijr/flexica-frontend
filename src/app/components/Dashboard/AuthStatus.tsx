// components/dashboard/AuthStatus.tsx
"use client";

import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { getUserRoleFromToken, isVendorRole, isAdminRole } from '@/app/lib/jwtUtils';
import { SmartRoleManager } from '@/app/lib/smartRoleManager';

const AuthStatus = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [actualRole, setActualRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setToken(storedToken);
    
    // Extract role from JWT token
    if (storedToken) {
      const roleFromToken = getUserRoleFromToken(storedToken);
      setActualRole(roleFromToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };


  if (!user || !token) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Not Authenticated</h3>
            <p className="text-xs text-red-600">You need to log in to manage products</p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="ml-auto px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Use Smart Role Manager to get effective role (considers overrides)
  const effectiveRole = SmartRoleManager.getEffectiveRole();
  const isVendor = SmartRoleManager.hasVendorPermissions();
  const isAdmin = SmartRoleManager.hasAdminPermissions();

  return (
    <div className="space-y-4 mb-6">

      {/* Role Status */}
      {!isVendor && !isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800">Upgrade Required</h3>
              <p className="text-xs text-amber-600">
                You need VENDOR role to manage products. Upgrade your account to start selling.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/vendor'}
              className="px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors"
            >
              Upgrade to Vendor
            </button>
          </div>
        </div>
      )}

      <div className={`border rounded-xl p-4 ${isVendor || isAdmin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isVendor || isAdmin ? 'bg-green-100' : 'bg-red-100'}`}>
              <User size={16} className={isVendor || isAdmin ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div>
                     <h3 className={`text-sm font-semibold ${isVendor || isAdmin ? 'text-green-800' : 'text-red-800'}`}>
                       {SmartRoleManager.getRoleDisplay()}
                     </h3>
                     <p className={`text-xs ${isVendor || isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                       Logged in as: {user.email || user.username || user.name || 'User ID: ' + (user.userId || 'Unknown')}
                     </p>
                     {user.businessName && (
                       <p className="text-xs text-blue-600 mt-1">
                         🏢 Business: {user.businessName}
                       </p>
                     )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthStatus;