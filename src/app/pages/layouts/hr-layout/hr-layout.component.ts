import { Component, inject } from '@angular/core';
import { ROUTES } from '../../../routes';
import { SidebarItem } from '../../../core/types';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-hr-layout',
  imports: [MainLayoutComponent],
  templateUrl: './hr-layout.component.html',
  styles: ``,
})
export class HrLayoutComponent {
  private authService: AuthService = inject(AuthService);
  companyId = this.authService.currentUser()?.companyId;
  sidebarItems: SidebarItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'pi pi-home',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.DASHBOARD}`,
    },

    {
      label: 'MY_COMPANY',
      icon: 'pi pi-building',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.COMPANY.LIST}/${this.companyId}`,
    },
    {
      label: 'MEMBERS',
      icon: 'pi pi-users',
      route: `/${ROUTES.H_R.BASE}/${this.companyId}/${ROUTES.MEMBERS.LIST}`,
    },
    {
      label: 'OFFERS',
      icon: 'pi pi-briefcase',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.OFFER.LIST}`,
    },
    {
      label: 'CANDIDATES',
      icon: 'pi pi-id-card',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.CANDIDATE.LIST}`,
    },
    {
      label: 'AI_PROCESSING',
      icon: 'pi pi-history',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.CANDIDATE.AI_PROCESSING_HISTORY}`,
    },

    {
      label: 'INTERVIEWS',
      icon: 'pi pi-video',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.INTERVIEW.LIST}`,
    },
    // {
    //   label: 'MAILING',
    //   icon: 'pi pi-envelope',
    //   route: `/${ROUTES.H_R.BASE}/${ROUTES.MAILING.LIST}`,
    // },

    {
      label: 'SETTINGS',
      icon: 'pi pi-cog',
      route: `/${ROUTES.H_R.BASE}/${ROUTES.SETTINGS.BASE}`,
    },
  ];
}
