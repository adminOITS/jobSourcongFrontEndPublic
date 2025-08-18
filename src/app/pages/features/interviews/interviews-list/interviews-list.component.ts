import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { GlobalInterviewsTableComponent } from '../components/global-interviews-table/global-interviews-table.component';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { InterviewsFilterFormComponent } from '../components/interviews-filter-form/interviews-filter-form.component';
import { InterviewService } from '../../../../core/services/interview/interview.service';
import {
  DEFAULT_INTERVIEW_PAGE,
  DEFAULT_INTERVIEW_SIZE,
} from '../../../../core/utils/constants';
import { InterviewSearchRequest } from '../../../../core/models/interview.models';

@Component({
  selector: 'app-interviews-list',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    GlobalInterviewsTableComponent,
    InterviewsFilterFormComponent,
  ],
  templateUrl: './interviews-list.component.html',
  styles: ``,
})
export class InterviewsListComponent {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  interviewService = inject(InterviewService);
  request = signal<InterviewSearchRequest>({
    page: DEFAULT_INTERVIEW_PAGE,
    size: DEFAULT_INTERVIEW_SIZE,
  });

  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('INTERVIEWS_LIST').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
    effect(() => {
      const request = this.request();
      this.interviewService.getInterviews(request);
    });
  }
}
