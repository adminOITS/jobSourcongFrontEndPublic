import { Routes } from '@angular/router';
import { ROUTES } from '.';
import { ValidatorLayoutComponent } from '../pages/layouts/validator-layout/validator-layout.component';
import { roleGuard } from '../core/guards/role.guard';
import { APP_ROLES } from '../core/utils/constants';

export const ValidatorRoutes: Routes = [
  {
    path: ROUTES.VALIDATOR.BASE,
    component: ValidatorLayoutComponent,
    canActivate: [roleGuard([APP_ROLES.VALIDATOR])],
    children: [
      { path: '', redirectTo: ROUTES.DASHBOARD, pathMatch: 'full' },
      {
        path: ROUTES.DASHBOARD,
        loadComponent: () =>
          import(
            '../pages/features/dashboard/validator-dashboard/validator-dashboard.component'
          ).then((m) => m.ValidatorDashboardComponent),
      },
      {
        path: ROUTES.OFFER.LIST,
        loadComponent: () =>
          import(
            '../pages/features/offers/offers-list/offers-list.component'
          ).then((m) => m.OffersListComponent),
      },
      {
        path: ROUTES.APPLICATION.BASE,
        loadComponent: () =>
          import(
            '../pages/features/applications/validator-pushed-applications-list/validator-pushed-applications-list.component'
          ).then((m) => m.ValidatorPushedApplicationsListComponent),
      },

      {
        path: ROUTES.APPLICATION.VALIDATION_REVIEW,
        loadComponent: () =>
          import(
            '../pages/features/applications/application-validation-review/application-validation-review.component'
          ).then((m) => m.ApplicationValidationReviewComponent),
      },
      {
        path: ROUTES.OFFER.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/offers/offer-details/offer-details.component'
          ).then((m) => m.OfferDetailsComponent),
      },
      {
        path: ROUTES.INTERVIEW.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/interviews/interview-details/interview-details.component'
          ).then((m) => m.InterviewDetailsComponent),
      },

      {
        path: ROUTES.SETTINGS.BASE,
        loadComponent: () =>
          import(
            '../pages/features/settings/settings-page/settings-page.component'
          ).then((m) => m.SettingsPageComponent),
      },
    ],
  },
];
