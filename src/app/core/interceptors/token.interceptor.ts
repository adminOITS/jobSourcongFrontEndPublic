import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
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
  const accessToken = tokenService.getAccessToken();
  if (!accessToken) {
    return next(req);
  }
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(cloned);
};
