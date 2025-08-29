import { Routes } from '@angular/router';
import { ROUTES } from '.';
import { HrLayoutComponent } from '../pages/layouts/hr-layout/hr-layout.component';
import { roleGuard } from '../core/guards/role.guard';
import { APP_ROLES } from '../core/utils/constants';

export const HrRoutes: Routes = [
  {
    path: ROUTES.H_R.BASE, // 'hr'
    component: HrLayoutComponent,
    canActivate: [roleGuard([APP_ROLES.HR])],
    children: [
      {
        path: '',
        redirectTo: ROUTES.DASHBOARD,
        pathMatch: 'full',
      },
      {
        path: ROUTES.DASHBOARD,
        loadComponent: () =>
          import(
            '../pages/features/dashboard/hr-dashboard/hr-dashboard.component'
          ).then((m) => m.HrDashboardComponent),
      },
      {
        path: ROUTES.OFFER.LIST,
        loadComponent: () =>
          import(
            '../pages/features/offers/offers-list/offers-list.component'
          ).then((m) => m.OffersListComponent),
      },
      {
        path: ':companyId/' + ROUTES.OFFER.HR_ADD,
        loadComponent: () =>
          import('../pages/features/offers/add-offer/add-offer.component').then(
            (m) => m.AddOfferComponent
          ),
      },
      {
        path: ':companyId/' + ROUTES.MEMBERS.LIST,
        loadComponent: () =>
          import(
            '../pages/features/companies/company-members/company-members.component'
          ).then((m) => m.CompanyMembersComponent),
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
        path: ROUTES.COMPANY.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/companies/my-company-details/my-company-details.component'
          ).then((m) => m.MyCompanyDetailsComponent),
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
      {
        path: ROUTES.INTERVIEW.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/interviews/interview-details/interview-details.component'
          ).then((m) => m.InterviewDetailsComponent),
      },
      {
        path: ROUTES.INTERVIEW.EDIT,
        loadComponent: () =>
          import(
            '../pages/features/interviews/add-edit-interview-data/add-edit-interview-data.component'
          ).then((m) => m.AddEditInterviewDataComponent),
      },
      // {
      //   path:  ROUTES.PROFILES.LIST,
      //   component: ProfilesListComponent,
      // },
      {
        path: ROUTES.SETTINGS.BASE,
        loadComponent: () =>
          import(
            '../pages/features/settings/settings-page/settings-page.component'
          ).then((m) => m.SettingsPageComponent),
      },
      {
        path: ROUTES.ATS.DETAILS,
        loadComponent: () =>
          import(
            '../pages/features/ats/ats-profile-details-component/ats-profile-details.component'
          ).then((m) => m.AtsProfileDetailsComponent),
      },
    ],
  },
];
