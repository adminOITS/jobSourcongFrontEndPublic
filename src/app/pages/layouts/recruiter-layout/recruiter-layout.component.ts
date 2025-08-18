import { Component } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { ROUTES } from '../../../routes';
import { SidebarItem } from '../../../core/types';

@Component({
  selector: 'app-recruiter-layout',
  imports: [MainLayoutComponent],
  templateUrl: './recruiter-layout.component.html',
  styles: ``,
})
export class RecruiterLayoutComponent {
  sidebarItems: SidebarItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'pi pi-home',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.DASHBOARD}`,
    },
    {
      label: 'OFFERS',
      icon: 'pi pi-briefcase',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.OFFER.LIST}`,
    },

    {
      label: 'CANDIDATES',
      icon: 'pi pi-id-card',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.CANDIDATE.LIST}`,
    },
    {
      label: 'AI_PROCESSING',
      icon: 'pi pi-history',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.CANDIDATE.AI_PROCESSING_HISTORY}`,
    },
    {
      label: 'INTERVIEWS',
      icon: 'pi pi-video',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.INTERVIEW.LIST}`,
    },

    // {
    //   label: 'MAILING',
    //   icon: 'pi pi-envelope',
    //   route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.MAILING.LIST}`,
    // },
    {
      label: 'SETTINGS',
      icon: 'pi pi-cog',
      route: `/${ROUTES.RECRUITER.BASE}/${ROUTES.SETTINGS.BASE}`,
    },
  ];
}
