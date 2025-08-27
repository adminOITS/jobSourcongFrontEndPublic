import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { OfferDetailsOverviewTabComponent } from '../offer-details-overview-tab/offer-details-overview-tab.component';
import { TabsModule } from 'primeng/tabs';
import { OfferDetailsRecruitmentPipelineTabComponent } from '../offer-details-recruitment-pipeline-tab/offer-details-recruitment-pipeline-tab.component';
import { OfferDetailsInterviewsTabComponent } from '../offer-details-interviews-tab/offer-details-interviews-tab.component';
import { OfferDetailsApplicationsTabComponent } from '../offer-details-applications-tab/offer-details-applications-tab.component';
import { OfferDetailsProfilesTabComponent } from '../offer-details-profiles-tab/offer-details-profiles-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
@Component({
  selector: 'app-offer-details-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    OfferDetailsOverviewTabComponent,
    TabsModule,
    OfferDetailsInterviewsTabComponent,
    OfferDetailsApplicationsTabComponent,
    OfferDetailsProfilesTabComponent,
  ],
  templateUrl: './offer-details-tabs.component.html',
})
export class OfferDetailsTabsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);
  activeTab = signal<string>('1');

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const active = params['active'];
      if (
        active &&
        ['overview', 'applications', 'interviews', 'profiles'].includes(active)
      ) {
        this.activeTab.set(active);
      } else {
        this.activeTab.set('overview');
        this.updateQueryParamWithoutNavigation('active', 'overview');
      }
    });
  }
  onTabChange(event: any) {
    switch (event) {
      case 'overview':
        this.activeTab.set('overview');
        this.updateQueryParamWithoutNavigation('active', 'overview');
        break;
      // case '2':
      //   this.activeTab.set('2');
      //   this.updateQueryParamWithoutNavigation('active', '2');
      //   break;
      case 'applications':
        this.activeTab.set('applications');
        this.updateQueryParamWithoutNavigation('active', 'applications');
        break;
      case 'interviews':
        this.activeTab.set('interviews');
        this.updateQueryParamWithoutNavigation('active', 'interviews');
        break;
      case 'profiles':
        this.activeTab.set('profiles');
        this.updateQueryParamWithoutNavigation('active', 'profiles');
        break;
    }
  }

  updateQueryParamWithoutNavigation(paramKey: string, paramValue: string) {
    const currentParams = { ...this.route.snapshot.queryParams };
    currentParams[paramKey] = paramValue;

    const queryString = new URLSearchParams(currentParams).toString();
    const newUrl = this.location.path().split('?')[0] + '?' + queryString;

    this.location.replaceState(newUrl); // Updates URL without navigation
  }
}
