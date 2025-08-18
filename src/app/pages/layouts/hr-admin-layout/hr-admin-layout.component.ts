import { Component } from '@angular/core';
import { SidebarItem } from '../../../core/types';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { ROUTES } from '../../../routes';

@Component({
  selector: 'app-hr-admin-layout',
  imports: [MainLayoutComponent],
  templateUrl: './hr-admin-layout.component.html',
  styles: ``,
})
export class HrAdminLayoutComponent {
  sidebarItems: SidebarItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'pi pi-home',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.DASHBOARD}`,
    },
    {
      label: 'COMPANIES',
      icon: 'pi pi-building',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.COMPANY.LIST}`,
    },
    {
      label: 'OFFERS',
      icon: 'pi pi-briefcase',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.OFFER.LIST}`,
    },

    {
      label: 'CANDIDATES',
      icon: 'pi pi-id-card',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.CANDIDATE.LIST}`,
    },
    {
      label: 'AI_PROCESSING',
      icon: 'pi pi-history',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.CANDIDATE.AI_PROCESSING_HISTORY}`,
    },

    {
      label: 'INTERVIEWS',
      icon: 'pi pi-video',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.INTERVIEW.LIST}`,
    },
    // {
    //   label: 'MAILING',
    //   icon: 'pi pi-envelope',
    //   route: `/${ROUTES.H_R.BASE}/${ROUTES.MAILING.LIST}`,
    // },

    {
      label: 'SETTINGS',
      icon: 'pi pi-cog',
      route: `/${ROUTES.H_R_ADMIN.BASE}/${ROUTES.SETTINGS.BASE}`,
    },
  ];
}
