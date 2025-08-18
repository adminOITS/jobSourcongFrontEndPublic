import { Injectable, signal, computed, inject } from '@angular/core';
import {
  APP_ROLES,
  AUTH_SERVICE_DOMAIN,
  USER_SERVICE_DOMAIN,
} from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  User,
  UserRole,
} from '../../models/user.models';
import { TokenService } from './token.service';
import { Observable, of, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private readonly authBaseUrl = environment.domain + AUTH_SERVICE_DOMAIN;
  private readonly usersBaseUrl = environment.domain + USER_SERVICE_DOMAIN;
  private currentUserSignal = signal<User | null>(null);
  private loginErrorSignal = signal<string | null>(null);
  private forgotPasswordErrorSignal = signal<string | null>(null);
  private forgotPasswordSuccessSignal = signal<string | null>(null);

  // ({
  //   id: 1,
  //   username: 'john.doe',
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'john.doe@example.com',
  //   companyId: 'a2f6231d-5ae4-4066-a795-fe0d4d26836e',
  //   // roles: [APP_ROLES.RECRUITER],
  //   // roles: [APP_ROLES.HR],
  //   roles: [APP_ROLES.HR_ADMIN],
  //   // roles: [APP_ROLES.VALIDATOR],
  //   isActive: true,
  //   isEmailVerified: true,
  // });

  private _isLoading = signal(false);
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoading = computed(() => this._isLoading());
  readonly loginError = computed(() => this.loginErrorSignal());
  readonly forgotPasswordError = computed(() =>
    this.forgotPasswordErrorSignal()
  );
  readonly forgotPasswordSuccess = computed(() =>
    this.forgotPasswordSuccessSignal()
  );
  getRole(): UserRole | '' {
    const roles = this.currentUserSignal()?.roles || [];

    const matchedRole = roles.find((role: string) =>
      Object.values(UserRole).includes(role as UserRole)
    );

    return (matchedRole as UserRole) || '';
  }

  getUser() {
    return this.currentUserSignal();
  }
  isAuthenticated() {
    const accessToken = this.tokenService.getAccessToken();
    if (!accessToken) {
      return false;
    }
    const user = this.tokenService.getUserFromToken(accessToken);
    if (!user) {
      return false;
    }
    this.setUser(user);
    return true;
  }

  setUser(user: User | null) {
    this.currentUserSignal.set(user);
  }
  constructor() {}

  login(loginRequest: LoginRequest) {
    const errorMsg1 = 'Invalid username or password:';
    this._isLoading.set(true);
    return this.http
      .post<LoginResponse>(`${this.authBaseUrl}/login`, loginRequest)
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.tokenService.setTokens(
            response.accessToken,
            response.refreshToken
          );
          const user = this.tokenService.getUserFromToken(response.accessToken);
          if (user) {
            this.tokenService.setUser(user);
            this.setUser(user);
          }
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.error?.message?.includes(errorMsg1)) {
            this.loginErrorSignal.set('INVALID_USERNAME_OR_PASSWORD');
          } else {
            this.loginErrorSignal.set('FAILED_TO_AUTHENTICATE');
          }
        },
      });
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }
    return this.http.post<LoginResponse>(`${this.authBaseUrl}/refresh-token`, {
      refreshToken,
    });
  }

  logout() {
    this.tokenService.clearTokens();
    this.setUser(null);
    this.router.navigate(['/']);
  }

  forgotPasswordEmail(email: string) {
    this.forgotPasswordSuccessSignal.set(null);
    this.forgotPasswordErrorSignal.set(null);
    this._isLoading.set(true);
    return this.http
      .post(`${this.usersBaseUrl}/forgot-password-email`, { email })
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.forgotPasswordSuccessSignal.set('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.forgotPasswordErrorSignal.set('FAILED_TO_SEND_EMAIL');
        },
      });
  }

  forgotPassword(forgotPasswordRequest: ForgotPasswordRequest) {
    this.forgotPasswordSuccessSignal.set(null);
    this.forgotPasswordErrorSignal.set(null);
    this._isLoading.set(true);
    return this.http
      .put(`${this.usersBaseUrl}/forgot-password`, forgotPasswordRequest)
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.forgotPasswordSuccessSignal.set('PASSWORD_RESET_SUCCESSFULLY');
        },
        error: (error) => {
          if (error.error?.message?.includes('Invalid or expired token')) {
            this.forgotPasswordErrorSignal.set('INVALID_OR_EXPIRED_TOKEN');
          } else {
            this.forgotPasswordErrorSignal.set('FAILED_TO_RESET_PASSWORD');
          }
        },
      });
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest) {
    this._isLoading.set(true);
    return this.http
      .put(`${this.usersBaseUrl}/reset-password`, resetPasswordRequest)
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          // this..set('PASSWORD_RESET_SUCCESSFULLY');
          this.logout();
        },
        error: () => {},
      });
  }

  emptyForgotPasswordSignals() {
    this.forgotPasswordSuccessSignal.set(null);
    this.forgotPasswordErrorSignal.set(null);
  }
}
