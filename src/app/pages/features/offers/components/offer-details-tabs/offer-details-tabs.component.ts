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
      if (active) {
        this.activeTab.set(active);
      } else {
        this.activeTab.set('1');
      }
    });
  }
  onTabChange(event: any) {
    switch (event) {
      case '1':
        this.activeTab.set('1');
        this.updateQueryParamWithoutNavigation('active', '1');
        break;
      // case '2':
      //   this.activeTab.set('2');
      //   this.updateQueryParamWithoutNavigation('active', '2');
      //   break;
      case '3':
        this.activeTab.set('3');
        this.updateQueryParamWithoutNavigation('active', '3');
        break;
      case '4':
        this.activeTab.set('4');
        this.updateQueryParamWithoutNavigation('active', '4');
        break;
      case '5':
        this.activeTab.set('5');
        this.updateQueryParamWithoutNavigation('active', '5');
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
