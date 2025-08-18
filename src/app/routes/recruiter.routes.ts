import { Routes } from '@angular/router';
import { RecruiterLayoutComponent } from '../pages/layouts/recruiter-layout/recruiter-layout.component';
import { ROUTES } from '.';
import { roleGuard } from '../core/guards/role.guard';
import { APP_ROLES } from '../core/utils/constants';

export const RecruiterRoutes: Routes = [
  {
    path: ROUTES.RECRUITER.BASE,
    component: RecruiterLayoutComponent,
    canActivate: [roleGuard([APP_ROLES.RECRUITER])],
    children: [
      { path: '', redirectTo: ROUTES.DASHBOARD, pathMatch: 'full' },
      {
        path: ROUTES.DASHBOARD,
        loadComponent: () =>
          import(
            '../pages/features/dashboard/recruiter-dashboard/recruiter-dashboard.component'
          ).then((m) => m.RecruiterDashboardComponent),
      },
      {
        path: ROUTES.OFFER.LIST,
        loadComponent: () =>
          import(
            '../pages/features/offers/offers-list/offers-list.component'
          ).then((m) => m.OffersListComponent),
      },
      {
        path: ROUTES.OFFER.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/offers/offer-details/offer-details.component'
          ).then((m) => m.OfferDetailsComponent),
      },

      {
        path: ROUTES.CANDIDATE.LIST,
        loadComponent: () =>
          import(
            '../pages/features/candidates/candidates-list/candidates-list.component'
          ).then((m) => m.CandidatesListComponent),
      },
      {
        path: ROUTES.CANDIDATE.AI_PROCESSING_HISTORY,
        loadComponent: () =>
          import(
            '../pages/features/candidates/candidates-ai-processing-history-list/candidates-ai-processing-history-list.component'
          ).then((m) => m.CandidatesAiProcessingHistoryListComponent),
      },
      {
        path: ROUTES.CANDIDATE.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/candidates/candidate-details/candidate-details.component'
          ).then((m) => m.CandidateDetailsComponent),
      },
      {
        path: ROUTES.MAILING.LIST,
        loadComponent: () =>
          import('../empty/empty.component').then((m) => m.EmptyComponent),
      },
      {
        path: ROUTES.SETTINGS.BASE,
        loadComponent: () =>
          import(
            '../pages/features/settings/settings-page/settings-page.component'
          ).then((m) => m.SettingsPageComponent),
      },
      {
        path: ROUTES.INTERVIEW.LIST,
        loadComponent: () =>
          import(
            '../pages/features/interviews/interviews-list/interviews-list.component'
          ).then((m) => m.InterviewsListComponent),
      },
    ],
  },
];
