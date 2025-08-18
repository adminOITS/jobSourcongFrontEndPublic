import { Component, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CandidatesDetailsProfilesTabComponent } from '../candidates-details-profiles-tab/candidates-details-profiles-tab.component';
import { CandidatesDetailsOverViewTabComponent } from '../candidates-details-over-view-tab/candidates-details-over-view-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { CandidatesDetailsApplicationsTabComponent } from '../candidates-details-applications-tab/candidates-details-applications-tab.component';
import { CandidatesDetailsInterviewsTabComponent } from '../candidates-details-interviews-tab/candidates-details-interviews-tab.component';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';
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
  constructor() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });
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
      case '2':
        this.activeTab.set('2');
        this.updateQueryParamWithoutNavigation('active', '2');
        break;
      case '3':
        this.activeTab.set('3');
        this.updateQueryParamWithoutNavigation('active', '3');
        break;
      case '4':
        this.activeTab.set('4');
        this.updateQueryParamWithoutNavigation('active', '4');
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
