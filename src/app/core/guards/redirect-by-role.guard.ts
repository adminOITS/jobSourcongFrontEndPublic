import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { APP_ROLES } from '../utils/constants';

export const redirectByRoleGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Get the user's primary role (first role in the array)
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }
  const role = authService.getRole();

  if (!role) {
    return router.createUrlTree(['/home']);
  }

  switch (role) {
    case APP_ROLES.HR_ADMIN:
      return router.createUrlTree(['/hr-admin/dashboard']);
    case APP_ROLES.HR:
      return router.createUrlTree(['/hr/dashboard']);
    case APP_ROLES.VALIDATOR:
      return router.createUrlTree(['/validator/dashboard']);
    case APP_ROLES.RECRUITER:
      return router.createUrlTree(['/recruiter/dashboard']);
    default:
      return router.createUrlTree(['/home']);
  }

  return false; // Always return false since we're redirecting
};
