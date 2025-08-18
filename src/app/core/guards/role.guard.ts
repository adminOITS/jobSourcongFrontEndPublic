import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const userData = authService.getUser();

    // Check if the user has any of the required roles
    const hasRequiredRole = allowedRoles.some((role) =>
      userData!.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  };
};
