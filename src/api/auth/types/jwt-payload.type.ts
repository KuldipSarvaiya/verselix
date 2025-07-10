export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider?: string;
  iat?: number; // Issued at
  exp?: number; // Expires at
} 