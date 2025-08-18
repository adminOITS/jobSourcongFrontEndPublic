import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { InterviewResponse } from '../../../../../core/models/interview.models';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { RoleAction } from '../../../../../core/types';
import { ROUTES } from '../../../../../routes';
import { InterviewEmailService } from '../../../../../core/services/interview/inteview-email.service';

@Component({
  selector: 'app-interviews-actions-menu',
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './interviews-actions-menu.component.html',
  styles: ``,
})
export class InterviewsActionsMenuComponent {
  @Input({ required: true })
  interview!: WritableSignal<InterviewResponse | null>;
  @ViewChild('menu') menu: any;

  @Output() onDeleteInterview = new EventEmitter<void>();
  @Output() onRescheduleInterview = new EventEmitter<void>();
  @Output() onEditInterview = new EventEmitter<void>();
  @Output() onCancelInterview = new EventEmitter<void>();
  @Output() onMarkAsNoShow = new EventEmitter<void>();
  @Output() onSendReminder = new EventEmitter<void>();
  @Output() onGenerateReport = new EventEmitter<void>();

  menuItems: MenuItem[] = [];

  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private router = inject(Router);
  private interviewEmailService = inject(InterviewEmailService);
  constructor() {
    effect(() => {
      if (this.interview()) {
        this.updateMenuItems();
      }
    });
  }

  // Define possible actions for each role
  private roleActions: Record<string, RoleAction[]> = {
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
        key: 'RESCHEDULE',
        label: 'RESCHEDULE',
        icon: 'pi pi-calendar',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.rescheduleInterview(),
      },
      {
        key: 'EDIT_INTERVIEW_DETAILS',
        label: 'EDIT_INTERVIEW_DETAILS',
        icon: 'pi pi-pencil',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.editInterview(),
      },
      {
        key: 'CANCEL_INTERVIEW',
        label: 'CANCEL_INTERVIEW',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.cancelInterview(),
      },
      {
        key: 'MARK_AS_NO_SHOW',
        label: 'MARK_AS_NO_SHOW',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.markAsNoShow(),
      },
      {
        key: 'SEND_REMINDER',
        label: 'SEND_REMINDER',
        icon: 'pi pi-bell',
        iconColor: 'text-yellow-500',

        can: () => true,
        action: () => this.sendReminder(),
      },
      // {
      //   key: 'GENERATE_REPORT',
      //   label: 'GENERATE_REPORT',
      //   icon: 'pi pi-file-pdf',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.generateReport(),
      // },

      {
        key: 'DELETE_INTERVIEW',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteInterview(),
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
        key: 'RESCHEDULE',
        label: 'RESCHEDULE',
        icon: 'pi pi-calendar',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.rescheduleInterview(),
      },
      {
        key: 'EDIT_INTERVIEW_DETAILS',
        label: 'EDIT_INTERVIEW_DETAILS',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.editInterview(),
      },
      {
        key: 'CANCEL',
        label: 'CANCEL',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.cancelInterview(),
      },
      {
        key: 'MARK_AS_NO_SHOW',
        label: 'MARK_AS_NO_SHOW',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.markAsNoShow(),
      },
      {
        key: 'SEND_REMINDER',
        label: 'SEND_REMINDER',
        icon: 'pi pi-bell',
        iconColor: 'text-yellow-500',
        can: () => true,
        action: () => this.sendReminder(),
      },
      // {
      //   key: 'GENERATE_REPORT',
      //   label: 'GENERATE_REPORT',
      //   icon: 'pi pi-file-pdf',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.generateReport(),
      // },

      {
        key: 'DELETE_INTERVIEW',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteInterview(),
      },
    ],
    RECRUITER: [
      {
        key: 'VIEW_DETAILS',
        label: 'VIEW_DETAILS',
        icon: 'pi pi-eye',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.viewDetails(),
      },
      {
        key: 'RESCHEDULE',
        label: 'RESCHEDULE',
        icon: 'pi pi-calendar',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.rescheduleInterview(),
      },
      {
        key: 'EDIT_INTERVIEW_DETAILS',
        label: 'EDIT_INTERVIEW_DETAILS',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.editInterview(),
      },
      {
        key: 'CANCEL',
        label: 'CANCEL',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.cancelInterview(),
      },
      {
        key: 'MARK_AS_NO_SHOW',
        label: 'MARK_AS_NO_SHOW',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.markAsNoShow(),
      },
      {
        key: 'SEND_REMINDER',
        label: 'SEND_REMINDER',
        icon: 'pi pi-bell',
        iconColor: 'text-yellow-500',
        can: () => true,
        action: () => this.sendReminder(),
      },
      // {
      //   key: 'GENERATE_REPORT',
      //   label: 'GENERATE_REPORT',
      //   icon: 'pi pi-file-pdf',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.generateReport(),
      // },

      {
        key: 'DELETE_INTERVIEW',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteInterview(),
      },
    ],
    VALIDATOR: [
      {
        key: 'VIEW_DETAILS',
        label: 'VIEW_DETAILS',
        icon: 'pi pi-eye',
        iconColor: 'text-gray-500',
        can: () => true,
        action: () => this.viewDetails(),
      },
    ],
  };

  ngOnInit() {
    this.updateMenuItems();
  }

  toggle(event: any) {
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  private updateMenuItems() {
    const actions = this.roleActions[this.userRole] || [];
    this.menuItems = actions.map((action: RoleAction) => ({
      key: action.key,
      label: action.label,
      icon: action.icon + ' ' + action.iconColor,
      command: action.action,
      disabled: !action.can(),
    }));
  }

  private viewDetails(): void {
    if (this.interview()) {
      const currentRoute = this.router.url;
      const url = currentRoute.split('/');
      this.router.navigate([
        `${url[1]}/${ROUTES.INTERVIEW.LIST}/${this.interview()!.id}`,
      ]);
    }
  }

  private rescheduleInterview() {
    this.onRescheduleInterview.emit();
  }
  private editInterview() {
    if (this.interview()) {
      const currentUrl = this.router.url;
      const url = currentUrl.split('/');
      this.router.navigate([
        `${url[1]}/${ROUTES.INTERVIEW.LIST}/edit/${this.interview()!.id}`,
      ]);
    }
  }
  private cancelInterview() {
    this.onCancelInterview.emit();
  }
  private markAsNoShow() {
    this.onMarkAsNoShow.emit();
  }
  private sendReminder() {
    this.interviewEmailService.sendInterviewReminderEmail(this.interview()!.id);
  }
  private generateReport() {
    this.onGenerateReport.emit();
  }
  private deleteInterview() {
    this.onDeleteInterview.emit();
  }
}
