import { Component, effect, inject, signal } from '@angular/core';
import { CandidateInterviewsTableComponent } from '../../../interviews/components/candidate-interviews-table/candidate-interviews-table.component';
import { InterviewsFilterFormComponent } from '../../../interviews/components/interviews-filter-form/interviews-filter-form.component';
import { InterviewSearchRequest } from '../../../../../core/models/interview.models';
import {
  DEFAULT_INTERVIEW_PAGE,
  DEFAULT_INTERVIEW_SIZE,
} from '../../../../../core/utils/constants';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-candidates-details-interviews-tab',
  imports: [CandidateInterviewsTableComponent, InterviewsFilterFormComponent],
  templateUrl: './candidates-details-interviews-tab.component.html',
  styles: ``,
})
export class CandidatesDetailsInterviewsTabComponent {
  request = signal<InterviewSearchRequest>({
    page: DEFAULT_INTERVIEW_PAGE,
    size: DEFAULT_INTERVIEW_SIZE,
  });

  interviewService = inject(InterviewService);
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
      const request = this.request();
      this.interviewService.getInterviewByCandidateId(
        this.candidateId,
        request
      );
    });
  }

  ngOnInit() {
    this.interviewService.getInterviewByCandidateId(this.candidateId);
  }
}
