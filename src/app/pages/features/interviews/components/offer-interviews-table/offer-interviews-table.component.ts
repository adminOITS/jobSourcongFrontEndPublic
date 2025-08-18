import {
  Component,
  Input,
  OnInit,
  ViewChild,
  signal,
  inject,
  computed,
  WritableSignal,
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Column } from '../../../../../core/types';
import { Router } from '@angular/router';
import {
  InterviewResponse,
  InterviewSearchRequest,
  InterviewStatusEnum,
} from '../../../../../core/models/interview.models';
import {
  getInterviewStatusClasses,
  getInterviewStatusStyle,
} from '../../../../../core/utils';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { DEFAULT_INTERVIEW_SIZE } from '../../../../../core/utils/constants';
import { DEFAULT_INTERVIEW_PAGE } from '../../../../../core/utils/constants';
import { InterviewsActionsMenuComponent } from '../interviews-actions-menu/interviews-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddEditInterviewScheduleDialogComponent } from '../add-edit-interview-schedule-dialog/add-edit-interview-schedule-dialog.component';
@Component({
  selector: 'app-offer-interviews-table',
  imports: [
    CommonModule,
    TableModule,
    MenuModule,
    ButtonModule,
    TranslateModule,
    InterviewsActionsMenuComponent,
    ConfirmDialogModule,
    AddEditInterviewScheduleDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './offer-interviews-table.component.html',
  styles: ``,
})
export class OfferInterviewsTableComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;
  @Input({ required: true }) request!: WritableSignal<InterviewSearchRequest>;
  private router = inject(Router);
  getInterviewStatusClasses = getInterviewStatusClasses;
  getInterviewStatusStyle = getInterviewStatusStyle;
  private translateService = inject(TranslateService);
  interviewService = inject(InterviewService);
  interviews = this.interviewService.interviews;
  isLoading = this.interviewService.isInterviewsLoading;
  private confirmationService = inject(ConfirmationService);
  selectedInterview: WritableSignal<InterviewResponse | null> = signal(null);

  columns: Column[] = [];

  constructor() {}

  ngOnInit() {
    this.initColumns();
  }

  loadInterviews(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_INTERVIEW_PAGE;
    const size = event.rows ? event.rows : DEFAULT_INTERVIEW_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }

  onRowSelect(event: any, interview: InterviewResponse) {
    this.selectedInterview.set(interview);
    this.menu.toggle(event);
  }

  confirmationHeader = '';
  confirmationMsg = '';
  acceptLabel = '';

  cancelInterview() {
    this.confirmationHeader = 'CANCEL_INTERVIEW';
    this.confirmationMsg = 'CANCEL_INTERVIEW_CONFIRMATION';
    this.acceptLabel = 'CANCEL_INTERVIEW';
    this.confirmationService.confirm({
      accept: () => {
        this.interviewService.updateInterviewStatus(
          this.selectedInterview()!.id,
          {
            status: InterviewStatusEnum.CANCELLED,
          }
        );
      },
    });
  }
  markAsNoShow() {
    this.confirmationHeader = 'MARK_AS_NO_SHOW';
    this.confirmationMsg = 'MARK_AS_NO_SHOW_CONFIRMATION';
    this.acceptLabel = 'MARK_AS_NO_SHOW';
    this.confirmationService.confirm({
      accept: () => {
        this.interviewService.updateInterviewStatus(
          this.selectedInterview()!.id,
          {
            status: InterviewStatusEnum.NO_SHOW,
          }
        );
      },
    });
  }
  addFeedback() {}
  sendReminder() {}
  viewFeedback() {}
  generateReport() {}

  rescheduleInterview() {
    this.interviewService.openEditDialog(this.selectedInterview()!);
  }

  deleteInterview() {
    if (this.selectedInterview) {
      this.confirmationHeader = 'DELETE_INTERVIEW';
      this.confirmationMsg = 'DELETE_INTERVIEW_CONFIRMATION';
      this.acceptLabel = 'DELETE_INTERVIEW';
      this.confirmationService.confirm({
        accept: () => {
          this.interviewService.deleteInterview(this.selectedInterview()!.id);
        },
      });
    }
  }
  initColumns() {
    this.columns = [
      {
        field: 'number',
        header: 'NUMBER',
        visible: true,
      },
      {
        field: 'application.profile.profileTitle',
        header: 'PROFILE_TITLE',
        visible: true,
      },
      {
        field: 'application.profile.candidate.firstName',
        header: 'CANDIDATE_FULL_NAME',
        visible: true,
      },

      {
        field: 'interviewerName',
        header: 'INTERVIEWER',
        visible: true,
      },
      { field: 'type', header: 'TYPE', visible: true },
      { field: 'status', header: 'STATUS', visible: true },
      {
        field: 'scheduledDateTime',
        header: 'START_TIME',
        visible: true,
      },
      {
        field: 'interviewDuration',
        header: 'DURATION',
        visible: true,
      },

      {
        field: 'meetingLink',
        header: 'MEETING_LINK',
        visible: true,
      },
      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }
}
