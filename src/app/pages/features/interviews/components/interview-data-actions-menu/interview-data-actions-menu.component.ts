import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import {
  InterviewDataResponse,
  InterviewResponse,
} from '../../../../../core/models/interview.models';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { RoleAction } from '../../../../../core/types';
import { ROUTES } from '../../../../../routes';
@Component({
  selector: 'app-interview-data-actions-menu',
  imports: [MenuModule, TranslateModule, RippleModule],
  templateUrl: './interview-data-actions-menu.component.html',
  styles: ``,
})
export class InterviewDataActionsMenuComponent {
  @ViewChild('menu') menu: any;
  @Input({ required: true })
  interviewData!: Signal<InterviewDataResponse | null>;

  @Output() onDeleteInterviewData = new EventEmitter<void>();
  @Output() onEditInterviewData = new EventEmitter<void>();

  menuItems: MenuItem[] = [];

  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private router = inject(Router);

  ngOnInit(): void {
    this.updateMenuItems();
  }

  toggle(event: any) {
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  private roleActions: Record<string, RoleAction[]> = {
    HR: [
      {
        key: 'EDIT_INTERVIEW_DATA',
        label: 'EDIT_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.onEditInterviewData.emit(),
      },
      {
        key: 'DELETE_INTERVIEW_DATA',
        label: 'DELETE_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.onDeleteInterviewData.emit(),
      },
    ],
    HR_ADMIN: [
      {
        key: 'EDIT_INTERVIEW_DATA',
        label: 'EDIT_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.onEditInterviewData.emit(),
      },
      {
        key: 'DELETE_INTERVIEW_DATA',
        label: 'DELETE_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.onDeleteInterviewData.emit(),
      },
    ],
    RECRUITER: [
      {
        key: 'EDIT_INTERVIEW_DATA',
        label: 'EDIT_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.onEditInterviewData.emit(),
      },
      {
        key: 'DELETE_INTERVIEW_DATA',
        label: 'DELETE_INTERVIEW_DATA',
        icon: 'pi pi-fw pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.onDeleteInterviewData.emit(),
      },
    ],
  };

  private updateMenuItems() {
    const actions = this.roleActions[this.userRole] || [];
    this.menuItems = actions.map((action: RoleAction) => ({
      key: action.key,
      label: action.label,
      icon: action.icon + ' ' + action.iconColor,
      can: action.can,
      command: () => action.action(),
      disabled: !action.can(),
    }));
  }
}
