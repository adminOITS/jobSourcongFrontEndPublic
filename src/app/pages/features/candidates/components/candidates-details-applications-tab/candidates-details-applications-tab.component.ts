import { Component, effect, inject, signal } from '@angular/core';
import { ApplicationsFilterFormComponent } from '../../../applications/components/applications-filter-form/applications-filter-form.component';
import { CandidateDetailsApplicationsTabTableComponent } from '../../../applications/components/candidate-details-applications-tab-table/candidate-details-applications-tab-table.component';
import { ApplicationSearchRequest } from '../../../../../core/models/application.models';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../../core/utils/constants';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ActivatedRoute } from '@angular/router';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';

@Component({
  selector: 'app-candidates-details-applications-tab',
  imports: [
    ApplicationsFilterFormComponent,
    CandidateDetailsApplicationsTabTableComponent,
  ],
  templateUrl: './candidates-details-applications-tab.component.html',
  styles: ``,
})
export class CandidatesDetailsApplicationsTabComponent {
  request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  applicationService = inject(ApplicationService);
  route = inject(ActivatedRoute);
  candidateId: string = '';
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
    effect(() => {
      const filters = this.request();
      this.applicationService.getApplicationsByCandidateId(
        this.candidateId,
        filters
      );
    });
  }
  ngOnInit() {
    this.applicationService.getApplicationsByCandidateId(this.candidateId);
  }
}
