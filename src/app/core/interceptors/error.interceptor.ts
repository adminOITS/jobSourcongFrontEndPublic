import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { LoginResponse } from '../models/user.models';
import { TokenService } from '../services/auth/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  if (
    req.url.includes('refresh-token') ||
    req.url.includes('forgot-password-email') ||
    req.url.includes('forgot-password') ||
    req.url.includes('login') ||
    req.url.includes('amazonaws.com')
  ) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((res: LoginResponse | null) => {
            if (res?.accessToken) {
              const cloned = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`,
                },
              });
              tokenService.setTokens(res.accessToken, res.refreshToken);
              return next(cloned);
            } else {
              authService.logout();
              return throwError(() => new Error('Failed to refresh token'));
            }
          }),
          catchError((err) => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
// if (error.status === 401) {
//   authService.logout();
//   return authService.refreshToken().pipe(
//     switchMap((res: LoginResponse | null) => {
//       if (res?.accessToken) {
//         const cloned = req.clone({
//           setHeaders: {
//             Authorization: `Bearer ${res.accessToken}`,
//           },
//         });
//         return next(cloned); // retry with new token
//       } else {
//         authService.logout();
//         return throwError(() => new Error('Failed to refresh token'));
//       }
//     }),
//     catchError((err) => {
//       authService.logout();
//       console.error('Error refreshing token', err);
//       return throwError(() => err);
//     })
//   );
// }
