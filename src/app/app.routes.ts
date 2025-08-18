import { Routes } from '@angular/router';
import { GuestRoutes } from './routes/guest.routes';
import { HrRoutes } from './routes/hr.routes';
import { RecruiterRoutes } from './routes/recruiter.routes';
import { ValidatorRoutes } from './routes/validator.routes';
import { HrAdminRoutes } from './routes/hr-admin.routes';
import { NotFoundComponent } from './pages/features/auth/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/features/auth/unauthorized';
import {
  redirectByRoleGuard,
  redirectToDashboardIfAuthenticatedGuard,
} from './core/guards';
import { LoginComponent } from './pages/features/auth/login/login.component';
import { ForgotPasswordEmailComponent } from './pages/features/auth/forgot-password-email/forgot-password-email.component';
import { LandingPageComponent } from './pages/features/home/landing-page/landing-page.component';
import { ForgotPasswordComponent } from './pages/features/auth/forgot-password/forgot-password.component';
export const routes: Routes = [
  {
    path: 'home',
    // canActivate: [redirectByRoleGuard],
    pathMatch: 'full',
    component: LandingPageComponent,
  },
  {
    path: '',
    canActivate: [redirectByRoleGuard],
    pathMatch: 'full',
    children: [],
  },

  ...HrRoutes,
  ...RecruiterRoutes,
  ...ValidatorRoutes,
  ...GuestRoutes,
  ...HrAdminRoutes,
  {
    path: 'login',
    canActivate: [redirectToDashboardIfAuthenticatedGuard],
    component: LoginComponent,
  },

  {
    path: 'forgot-password-email',
    canActivate: [redirectToDashboardIfAuthenticatedGuard],
    component: ForgotPasswordEmailComponent,
  },
  {
    path: 'forgot-password/:token',
    canActivate: [redirectToDashboardIfAuthenticatedGuard],
    component: ForgotPasswordComponent,
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent },
];
