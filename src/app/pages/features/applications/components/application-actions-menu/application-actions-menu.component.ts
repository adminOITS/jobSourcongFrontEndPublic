import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  WritableSignal,
  effect,
  inject,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import {
  ApplicationResponse,
  TransitionCommentRequest,
} from '../../../../../core/models/application.models';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { RoleAction } from '../../../../../core/types';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { ApplicationCommentActionDialogComponent } from '../application-comment-action-dialog/application-comment-action-dialog.component';
import { Router } from '@angular/router';
import { ApplicationEmailService } from '../../../../../core/services/applications/application-email.service';

@Component({
  selector: 'app-application-actions-menu',
  standalone: true,
  imports: [
    MenuModule,
    RippleModule,
    TranslateModule,
    ApplicationCommentActionDialogComponent,
  ],
  providers: [ConfirmationService],

  templateUrl: './application-actions-menu.component.html',
  styles: [],
})
export class ApplicationActionsMenuComponent implements OnInit {
  @Input() application!: WritableSignal<ApplicationResponse | null>;
  @ViewChild('menu') menu: any;
  menuItems: MenuItem[] = [];
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onViewDetails = new EventEmitter<void>();

  constructor() {
    effect(() => {
      if (this.application()) {
        this.updateMenuItems();
      }
    });
  }

  // Define possible actions for each role
  private roleActions: Record<string, RoleAction[]> = {
    RECRUITER: [
      // {
      //   key: 'VIEW_DETAILS',
      //   label: 'VIEW_DETAILS',
      //   icon: 'pi pi-eye',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.viewDetails(),
      // },
      {
        key: 'SCHEDULE_INTERVIEW',
        label: 'SCHEDULE_INTERVIEW',
        icon: 'pi pi-calendar-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.scheduleInterview(),
      },
      {
        key: 'PUSH_TO_HR',
        label: 'SUBMITTED_TO_HR_Action',
        icon: 'pi pi-arrow-right',
        iconColor: 'text-blue-500',
        can: () =>
          ['NEW', 'CANCELLED_BY_RECRUITER', 'WITHDRAWN_BY_CANDIDATE'].includes(
            this.application()?.status!
          ),

        action: () => this.pushToHr(),
      },
      {
        key: 'CANCEL_PUSH_TO_HR',
        label: 'CANCELLED_BY_RECRUITER_Action',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => this.application()?.status === 'SUBMITTED_TO_HR',
        action: () => this.cancelByRecruiter(),
      },
      {
        key: 'WITHDRAW_APPLICATION',
        label: 'WITHDRAWN_BY_CANDIDATE_Action',
        icon: 'pi pi-undo',
        iconColor: 'text-yellow-500',
        can: () =>
          ['NEW', 'SUBMITTED_TO_HR'].includes(this.application()?.status!),
        action: () => this.withdrawByCandidate(),
      },
      {
        key: 'DELETE_APPLICATION',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () =>
          ['NEW', 'SUBMITTED_TO_HR', 'CANCELLED_BY_RECRUITER'].includes(
            this.application()?.status!
          ),
        action: () => this.deleteApplication(),
      },
    ],
    HR: [
      {
        key: 'VIEW_DETAILS',
        label: 'VIEW_DETAILS',
        icon: 'pi pi-eye',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.viewDetails(),
      },
      {
        key: 'SCHEDULE_INTERVIEW',
        label: 'SCHEDULE_INTERVIEW',
        icon: 'pi pi-calendar-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.scheduleInterview(),
      },
      {
        key: 'PUSH_TO_VALIDATOR',
        label: 'PUSHED_TO_VALIDATOR_Action',
        icon: 'pi pi-arrow-right-arrow-left',
        iconColor: 'text-blue-500',
        can: () =>
          [
            'NEW',
            'SUBMITTED_TO_HR',
            'CANCELLED_BY_RECRUITER',
            'CANCELLED_BY_HR',
            'INVALIDATED_BY_HR',
            'REJECTED_BY_HR',
            'REJECTED_BY_VALIDATOR',
          ].includes(this.application()?.status!),
        action: () => this.pushToValidator(),
      },
      {
        key: 'ACCEPT_APPLICATION',
        label: 'ACCEPTED_BY_VALIDATOR_Action',
        icon: 'pi pi-check',
        iconColor: 'text-green-500',
        can: () =>
          [
            'NEW',
            'SUBMITTED_TO_HR',
            'CANCELLED_BY_RECRUITER',
            'CANCELLED_BY_HR',
            'INVALIDATED_BY_HR',
            'REJECTED_BY_HR',
            'REJECTED_BY_VALIDATOR',
            'PUSHED_TO_VALIDATOR',
          ].includes(this.application()?.status!),
        action: () => this.acceptByValidator(),
      },
      {
        key: 'SEND_ACCEPTANCE_EMAIL',
        label: 'SEND_ACCEPTANCE_EMAIL_Action',
        icon: 'pi pi-envelope',
        iconColor: 'text-blue-500',
        can: () =>
          ['ACCEPTED_BY_VALIDATOR'].includes(this.application()?.status!),
        action: () => this.sendAcceptanceEmail(),
      },
      {
        key: 'SEND_REFUSAL_EMAIL',
        label: 'SEND_REFUSAL_EMAIL_Action',
        icon: 'pi pi-envelope',
        iconColor: 'text-blue-500',
        can: () =>
          ['ACCEPTED_BY_VALIDATOR', 'REJECTED_BY_VALIDATOR'].includes(
            this.application()?.status!
          ),
        action: () => this.sendRefusalEmail(),
      },
      {
        key: 'REJECT_APPLICATION',
        label: 'REJECTED_BY_VALIDATOR_Action',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () => this.application()?.status === 'SUBMITTED_TO_HR',
        action: () => this.rejectByValidator(),
      },
      {
        key: 'CANCEL_BY_HR',
        label: 'CANCELLED_BY_HR_Action',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => this.application()?.status === 'SUBMITTED_TO_HR',
        action: () => this.cancelByHr(),
      },
      {
        key: 'INVALIDATE_BY_HR',
        label: 'INVALIDATED_BY_HR_Action',
        icon: 'pi pi-exclamation-triangle',
        iconColor: 'text-yellow-500',
        can: () => this.application()?.status === 'ACCEPTED_BY_VALIDATOR',
        action: () => this.invalidateByHr(),
      },
      {
        key: 'DELETE_APPLICATION',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteApplication(),
      },
    ],
    HR_ADMIN: [
      {
        key: 'VIEW_DETAILS',
        label: 'VIEW_DETAILS',
        icon: 'pi pi-eye',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.viewDetails(),
      },
      {
        key: 'SCHEDULE_INTERVIEW',
        label: 'SCHEDULE_INTERVIEW',
        icon: 'pi pi-calendar-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.scheduleInterview(),
      },
      {
        key: 'PUSH_TO_VALIDATOR',
        label: 'PUSHED_TO_VALIDATOR_Action',
        icon: 'pi pi-arrow-right-arrow-left',
        iconColor: 'text-blue-500',
        can: () =>
          [
            'NEW',
            'SUBMITTED_TO_HR',
            'CANCELLED_BY_RECRUITER',
            'CANCELLED_BY_HR',
            'INVALIDATED_BY_HR',
            'REJECTED_BY_HR',
            'REJECTED_BY_VALIDATOR',
          ].includes(this.application()?.status!),
        action: () => this.pushToValidator(),
      },
      {
        key: 'ACCEPT_APPLICATION',
        label: 'ACCEPTED_BY_VALIDATOR_Action',
        icon: 'pi pi-check',
        iconColor: 'text-green-500',
        can: () =>
          [
            'NEW',
            'SUBMITTED_TO_HR',
            'CANCELLED_BY_RECRUITER',
            'CANCELLED_BY_HR',
            'INVALIDATED_BY_HR',
            'REJECTED_BY_HR',
            'REJECTED_BY_VALIDATOR',
            'PUSHED_TO_VALIDATOR',
          ].includes(this.application()?.status!),
        action: () => this.acceptByValidator(),
      },
      {
        key: 'REJECT_APPLICATION',
        label: 'REJECTED_BY_VALIDATOR_Action',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () => this.application()?.status === 'SUBMITTED_TO_HR',
        action: () => this.rejectByValidator(),
      },
      {
        key: 'SEND_ACCEPTANCE_EMAIL',
        label: 'SEND_ACCEPTANCE_EMAIL_Action',
        icon: 'pi pi-envelope',
        iconColor: 'text-blue-500',
        can: () =>
          ['ACCEPTED_BY_VALIDATOR'].includes(this.application()?.status!),
        action: () => this.sendAcceptanceEmail(),
      },
      {
        key: 'SEND_REFUSAL_EMAIL',
        label: 'SEND_REFUSAL_EMAIL_Action',
        icon: 'pi pi-envelope',
        iconColor: 'text-blue-500',
        can: () =>
          ['ACCEPTED_BY_VALIDATOR', 'REJECTED_BY_VALIDATOR'].includes(
            this.application()?.status!
          ),
        action: () => this.sendRefusalEmail(),
      },
      {
        key: 'CANCEL_BY_HR',
        label: 'CANCELLED_BY_HR_Action',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => this.application()?.status === 'SUBMITTED_TO_HR',
        action: () => this.cancelByHr(),
      },
      {
        key: 'INVALIDATE_BY_HR',
        label: 'INVALIDATED_BY_HR_Action',
        icon: 'pi pi-exclamation-triangle',
        iconColor: 'text-yellow-500',
        can: () => this.application()?.status === 'ACCEPTED_BY_VALIDATOR',
        action: () => this.invalidateByHr(),
      },
      {
        key: 'DELETE_APPLICATION',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteApplication(),
      },
    ],
    VALIDATOR: [
      {
        key: 'VIEW_DETAILS',
        label: 'VIEW_DETAILS',
        icon: 'pi pi-eye',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.viewValidationDetails(),
      },
      {
        key: 'ACCEPT_APPLICATION',
        label: 'ACCEPTED_BY_VALIDATOR_Action',
        icon: 'pi pi-check',
        iconColor: 'text-green-500',
        can: () =>
          ['PUSHED_TO_VALIDATOR', 'INVALIDATED_BY_HR'].includes(
            this.application()?.status!
          ),
        action: () => this.acceptByValidator(),
      },
      {
        key: 'REJECT_APPLICATION',
        label: 'REJECTED_BY_VALIDATOR_Action',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () =>
          ['PUSHED_TO_VALIDATOR', 'INVALIDATED_BY_HR'].includes(
            this.application()?.status!
          ),
        action: () => this.rejectByValidator(),
      },
    ],
  };

  ngOnInit() {
    this.updateMenuItems();
  }

  toggle(event: MouseEvent) {
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  private updateMenuItems() {
    const actions = this.roleActions[this.userRole] || [];
    this.menuItems = actions.map((action: RoleAction) => ({
      label: action.label,
      icon: action.icon + ' ' + action.iconColor,
      command: action.action,
      disabled: !action.can(),
    }));
  }
  private interviewService = inject(InterviewService);
  private router = inject(Router);
  private applicationEmailService = inject(ApplicationEmailService);
  viewValidationDetails() {
    this.router.navigate([
      '/validator/applications/validation-review',
      this.application()?.id,
    ]);
  }
  private sendAcceptanceEmail() {
    this.applicationEmailService.sendAcceptanceEmail(this.application()?.id!);
  }
  private sendRefusalEmail() {
    this.applicationEmailService.sendRefusalEmail(this.application()?.id!);
  }
  viewDetails() {
    this.onViewDetails.emit();
  }
  scheduleInterview() {
    this.interviewService.openAddDialog(this.application()?.id!);
  }

  deleteApplication() {
    this.onDelete.emit();
  }
  private pushToHr() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'SUBMITTED_TO_HR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.pushToHr(this.application()?.id!, comment);
        },
      });
    }
  }
  private cancelByRecruiter() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'CANCELLED_BY_RECRUITER_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.cancelByRecruiter(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
  private withdrawByCandidate() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'WITHDRAWN_BY_CANDIDATE_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.withdrawByCandidateStaff(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
  private pushToValidator() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'PUSHED_TO_VALIDATOR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.pushToValidator(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
  private acceptByValidator() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'ACCEPTED_BY_VALIDATOR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.acceptByValidator(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
  private rejectByValidator() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'REJECTED_BY_VALIDATOR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.rejectByValidator(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
  private cancelByHr() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'CANCELLED_BY_HR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.cancelByHr(this.application()?.id!, comment);
        },
      });
    }
  }
  private invalidateByHr() {
    if (this.application()) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'INVALIDATED_BY_HR_Action',
        commentRequired: true,
        actionFunction: (comment: TransitionCommentRequest) => {
          this.applicationService.invalidateByHr(
            this.application()?.id!,
            comment
          );
        },
      });
    }
  }
}
