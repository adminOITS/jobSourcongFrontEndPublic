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
  constructor() {
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
