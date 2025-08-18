import { Component } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { ROUTES } from '../../../routes';
import { SidebarItem } from '../../../core/types';
@Component({
  selector: 'app-validator-layout',
  imports: [MainLayoutComponent],
  templateUrl: './validator-layout.component.html',
  styles: ``,
})
export class ValidatorLayoutComponent {
  sidebarItems: SidebarItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'pi pi-home',
      route: `/${ROUTES.VALIDATOR.BASE}/${ROUTES.DASHBOARD}`,
    },
    {
      label: 'OFFERS',
      icon: 'pi pi-briefcase',
      route: `/${ROUTES.VALIDATOR.BASE}/${ROUTES.OFFER.LIST}`,
    },
    {
      label: 'APPLICATIONS',
      icon: 'pi pi-file',
      route: `/${ROUTES.VALIDATOR.BASE}/${ROUTES.APPLICATION.BASE}`,
    },

    {
      label: 'SETTINGS',
      icon: 'pi pi-cog',
      route: `/${ROUTES.VALIDATOR.BASE}/${ROUTES.SETTINGS.BASE}`,
    },
  ];
}
