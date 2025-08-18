import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyDetailsOverviewTabComponent } from '../company-details-overview-tab/company-details-overview-tab.component';
import { TabsModule } from 'primeng/tabs';
import { CompanyDetailsOffersTabComponent } from '../company-details-offers-tab/company-details-offers-tab.component';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { CompanyDetailsMembersTabComponent } from '../company-details-members-tab/company-details-members-tab.component';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { APP_ROLES } from '../../../../../core/utils/constants';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { updateQueryParamWithoutNavigation } from '../../../../../core/utils';

@Component({
  selector: 'app-company-details-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CompanyDetailsOverviewTabComponent,
    TabsModule,
    CompanyDetailsOffersTabComponent,
    CompanyDetailsMembersTabComponent,
  ],
  templateUrl: './company-details-tabs.component.html',
})
export class CompanyDetailsTabsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private staffService: StaffService = inject(StaffService);
  private location: Location = inject(Location);
  activeTab = signal<string>('overview');

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const active = params['active'];
      if (active) {
        this.activeTab.set(active);
      } else {
        this.activeTab.set('overview');
      }
    });
  }
  onTabChange(event: any) {
    switch (event) {
      case 'overview':
        this.activeTab.set('overview');
        updateQueryParamWithoutNavigation(
          'active',
          'overview',
          this.route,
          this.location
        );
        break;
      case 'offers':
        this.activeTab.set('offers');
        updateQueryParamWithoutNavigation(
          'active',
          'offers',
          this.route,
          this.location
        );
        break;
      case 'members':
        this.staffService.resetSelectedStaff();
        this.activeTab.set('members');
        updateQueryParamWithoutNavigation(
          'active',
          'members',
          this.route,
          this.location
        );
        break;
    }
  }
}
