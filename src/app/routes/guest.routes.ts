import { Routes } from '@angular/router';
import { ROUTES } from '.';
import { CandidateActionComponent } from '../pages/features/applications/candidate-action/candidate-action.component';
import { GuestLayoutComponent } from '../pages/layouts/guest-layout/guest-layout.component';

export const GuestRoutes: Routes = [
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: ROUTES.APPLICATION.CANDIDATE_ACTION,
        component: CandidateActionComponent,
      },
    ],
  },
];
