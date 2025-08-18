import { Injectable } from '@angular/core';
import { User } from '../../models/user.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getUserFromToken(token: string): User | null {
    try {
      const decoded: any = jwtDecode(token);

      return {
        id: decoded.sub,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        companyId: decoded.companyId,
        staffId: decoded.staffId,
        roles: decoded.realm_access?.roles || [],
        username: decoded.preferred_username,
        isActive: decoded.isActive || true,
        isEmailVerified: decoded.isEmailVerified || true,
      };
    } catch (error) {
      console.error('Invalid token format:', error);
      return null;
    }
  }
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}
