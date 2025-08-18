import { Component, effect, inject, signal } from '@angular/core';
import { OfferInterviewsTableComponent } from '../../../interviews/components/offer-interviews-table/offer-interviews-table.component';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AddEditInterviewScheduleDialogComponent } from '../../../interviews/components/add-edit-interview-schedule-dialog/add-edit-interview-schedule-dialog.component';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { ActivatedRoute } from '@angular/router';
import { InterviewSearchRequest } from '../../../../../core/models/interview.models';
import {
  DEFAULT_INTERVIEW_PAGE,
  DEFAULT_INTERVIEW_SIZE,
} from '../../../../../core/utils/constants';
import { InterviewsFilterFormComponent } from '../../../interviews/components/interviews-filter-form/interviews-filter-form.component';

@Component({
  selector: 'app-offer-details-interviews-tab',
  imports: [
    OfferInterviewsTableComponent,
    CommonModule,
    FloatLabelModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    AddEditInterviewScheduleDialogComponent,
    InterviewsFilterFormComponent,
  ],
  templateUrl: './offer-details-interviews-tab.component.html',
  styles: ``,
})
export class OfferDetailsInterviewsTabComponent {
  request = signal<InterviewSearchRequest>({
    page: DEFAULT_INTERVIEW_PAGE,
    size: DEFAULT_INTERVIEW_SIZE,
  });
  interviewService = inject(InterviewService);
  private route = inject(ActivatedRoute);
  offerId!: string;
  constructor() {
    this.route.params.subscribe((params) => {
      this.offerId = params['offerId'];
    });

    effect(() => {
      const filters = this.request();
      this.interviewService.getInterviewsByOfferId(this.offerId, filters);
    });
  }

  ngOnInit() {
    this.interviewService.getInterviewsByOfferId(this.offerId);
  }
}
