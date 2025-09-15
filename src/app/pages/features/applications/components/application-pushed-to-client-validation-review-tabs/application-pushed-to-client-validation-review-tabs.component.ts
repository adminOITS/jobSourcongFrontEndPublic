import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';
import { updateQueryParamWithoutNavigation } from '../../../../../core/utils';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OfferDetailsOverviewTabComponent } from '../../../offers/components/offer-details-overview-tab/offer-details-overview-tab.component';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { CandidatesDetailsOverViewTabComponent } from '../../../candidates/components/candidates-details-over-view-tab/candidates-details-over-view-tab.component';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { InterviewCardsListComponent } from '../interview-cards-list';

@Component({
  selector: 'app-application-pushed-to-client-validation-review-tabs',
  imports: [
    CommonModule,
    TranslateModule,
    TabsModule,
    OfferDetailsOverviewTabComponent,
    CandidatesDetailsOverViewTabComponent,
    InterviewCardsListComponent,
  ],
  templateUrl:
    './application-pushed-to-client-validation-review-tabs.component.html',
  styles: ``,
})
export class ApplicationPushedToClientValidationReviewTabsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);
  activeTab = signal<string>('profile');
  appSettingsService = inject(AppSettingsService);
  offerService = inject(OfferService);
  applicationService = inject(ApplicationService);
  candidateService = inject(CandidateService);
  interviewService = inject(InterviewService);
  application = this.applicationService.applicationDetails;
  showPersonalInfo = this.candidateService.showPersonalInfoComputed;

  isOfferLoading = this.offerService.isOfferLoading;
  offer = this.offerService.offerDetails;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const active = params['active'];
      if (active) {
        this.activeTab.set(active);
      } else {
        this.activeTab.set('profile');
      }
    });
    effect(() => {
      if (this.application()) {
        if (this.activeTab() === 'profile') {
          this.candidateService.getCandidateByProfileAndApplication(
            this.application()?.profile?.id!,
            this.application()?.id!
          );
        }
        if (this.activeTab() === 'offer') {
          this.offerService.getOfferById(this.application()?.jobOffer?.id!);
        }
        if (this.activeTab() === 'interviews') {
          this.interviewService.getInterviewsByApplicationId(
            this.application()?.id!
          );
        }
      }
    });
  }
  ngOnInit() {}
  onTabChange(event: any) {
    switch (event) {
      case 'profile':
        this.candidateService.getCandidateByProfileAndApplication(
          this.application()?.profile?.id!,
          this.application()?.id!
        );
        this.activeTab.set('profile');
        updateQueryParamWithoutNavigation(
          'active',
          'profile',
          this.route,
          this.location
        );
        break;
      case 'offer':
        this.offerService.getOfferById(this.application()?.jobOffer?.id!);
        this.activeTab.set('offer');
        updateQueryParamWithoutNavigation(
          'active',
          'offer',
          this.route,
          this.location
        );
        break;
      case 'interviews':
        this.interviewService.getInterviewsByApplicationId(
          this.application()?.id!
        );
        this.activeTab.set('interviews');

        updateQueryParamWithoutNavigation(
          'active',
          'interviews',
          this.route,
          this.location
        );
        break;
    }
  }
}
