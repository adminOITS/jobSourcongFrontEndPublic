import {
  Component,
  Input,
  ViewChild,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Column } from '../../../../../core/types';
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
import {
  DEFAULT_INTERVIEW_PAGE,
  DEFAULT_INTERVIEW_SIZE,
} from '../../../../../core/utils/constants';
import { InterviewsActionsMenuComponent } from '../interviews-actions-menu/interviews-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddEditInterviewScheduleDialogComponent } from '../add-edit-interview-schedule-dialog/add-edit-interview-schedule-dialog.component';

@Component({
  selector: 'app-global-interviews-table',
  templateUrl: './global-interviews-table.component.html',
  standalone: true,
  providers: [ConfirmationService],
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
})
export class GlobalInterviewsTableComponent {
  @ViewChild('menu') menu!: InterviewsActionsMenuComponent;
  @Input({ required: true }) request!: WritableSignal<InterviewSearchRequest>;
  interviewService = inject(InterviewService);
  interviews = this.interviewService.interviews;
  selectedInterview: WritableSignal<InterviewResponse | null> = signal(null);

  isLoading = this.interviewService.isInterviewsLoading;

  columns: Column[] = [];
  private confirmationService = inject(ConfirmationService);
  getInterviewStatusClasses = getInterviewStatusClasses;
  getInterviewStatusStyle = getInterviewStatusStyle;

  constructor() {
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
  acceptButtonStyleClass = '';
  acceptIcon = '';

  cancelInterview() {
    this.confirmationHeader = 'CANCEL_INTERVIEW';
    this.confirmationMsg = 'CANCEL_INTERVIEW_CONFIRMATION';
    this.acceptLabel = 'CANCEL_INTERVIEW';
    this.acceptIcon = 'pi pi-ban';
    this.acceptButtonStyleClass = 'p-button-danger';
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
    this.acceptIcon = 'pi pi-times-circle';
    this.acceptButtonStyleClass = 'p-button-danger';
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
  sendReminder() {}

  rescheduleInterview() {
    this.interviewService.openEditDialog(this.selectedInterview()!);
  }

  deleteInterview() {
    if (this.selectedInterview) {
      this.confirmationHeader = 'DELETE_INTERVIEW';
      this.confirmationMsg = 'DELETE_INTERVIEW_CONFIRMATION';
      this.acceptLabel = 'DELETE_INTERVIEW';
      this.acceptIcon = 'pi pi-trash';
      this.acceptButtonStyleClass = 'p-button-danger';
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
        field: 'id',
        header: 'NUMBER',
        visible: true,
      },

      {
        field: 'offer.title',
        header: 'OFFER_TITLE',
        visible: true,
      },
      {
        field: 'application.profile.profileTitle',
        header: 'PROFILE_TITLE',
        visible: true,
      },
      {
        field: 'application.profile.candidate.firstName',
        header: 'CANDIDATE',
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
