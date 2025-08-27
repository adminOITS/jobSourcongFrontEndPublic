import { Component, effect, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CandidatesDetailsProfilesTabComponent } from '../candidates-details-profiles-tab/candidates-details-profiles-tab.component';
import { CandidatesDetailsOverViewTabComponent } from '../candidates-details-over-view-tab/candidates-details-over-view-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { CandidatesDetailsApplicationsTabComponent } from '../candidates-details-applications-tab/candidates-details-applications-tab.component';
import { CandidatesDetailsInterviewsTabComponent } from '../candidates-details-interviews-tab/candidates-details-interviews-tab.component';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
@Component({
  selector: 'app-candidates-details-tabs',
  imports: [
    TabsModule,
    CandidatesDetailsProfilesTabComponent,
    CandidatesDetailsOverViewTabComponent,
    TranslateModule,
    CandidatesDetailsApplicationsTabComponent,
    CandidatesDetailsInterviewsTabComponent,
    NgIf,
  ],
  templateUrl: './candidates-details-tabs.component.html',
  styles: ``,
})
export class CandidatesDetailsTabsComponent {
  candidateId!: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);
  activeTab = signal<string>('1');
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  candidateService = inject(CandidateService);
  candidate = this.candidateService.candidateDetails;
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('CANDIDATE_DETAILS').subscribe((res) => {
        const title =
          this.candidate()?.firstName && this.candidate()?.lastName
            ? this.candidate()?.firstName + ' ' + this.candidate()?.lastName
            : '...';
        this.appSettingsService.setTitle(res + ' : ' + title);
      });
    });

    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });
    this.route.queryParams.subscribe((params) => {
      const active = params['active'];
      if (
        active &&
        ['overview', 'profiles', 'applications', 'interviews'].includes(active)
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
      case 'profiles':
        this.activeTab.set('profiles');
        this.updateQueryParamWithoutNavigation('active', 'profiles');
        break;
      case 'applications':
        this.activeTab.set('applications');
        this.updateQueryParamWithoutNavigation('active', 'applications');
        break;
      case 'interviews':
        this.activeTab.set('interviews');
        this.updateQueryParamWithoutNavigation('active', 'interviews');
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
