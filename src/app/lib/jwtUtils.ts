// lib/jwtUtils.ts

export interface JWTClaims {
  sub: string; // email
  userId: number;
  authorities: string[];
  iat: number;
  exp: number;
}

export function parseJWT(token: string): JWTClaims | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const claims = JSON.parse(decodedPayload);
    
    return claims as JWTClaims;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

export function getUserRoleFromToken(token: string): string | null {
  const claims = parseJWT(token);
  if (!claims || !claims.authorities || claims.authorities.length === 0) {
    return null;
  }

  // Return the first authority (role)
  // Backend typically stores roles as "ROLE_VENDOR", "ROLE_USER", etc.
  return claims.authorities[0];
}

export function isVendorRole(role: string): boolean {
  return role === 'ROLE_VENDOR' || role === 'VENDOR';
}

export function isAdminRole(role: string): boolean {
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
}