import {
  Component,
  effect,
  inject,
  Input,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import {
  CandidateAIProcessingHistoryResponseDto,
  ProcessingStatus,
} from '../../../../../core/models/candidate.models';
import { RoleAction } from '../../../../../core/types';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { CandidateAiService } from '../../../../../core/services/candidate/candidate-ai.service';

@Component({
  selector: 'app-candidates-ai-processing-history-table-actions-menu',
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl:
    './candidates-ai-processing-history-table-actions-menu.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryTableActionsMenuComponent {
  @Input({ required: true })
  candidateAiProcessingHistoryResponseDto!: WritableSignal<CandidateAIProcessingHistoryResponseDto | null>;
  @ViewChild('menu') menu: any;
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private candidateAiService = inject(CandidateAiService);
  menuItems: MenuItem[] = [];
  constructor() {
    effect(() => {
      if (this.candidateAiProcessingHistoryResponseDto()) {
        this.updateMenuItems();
      }
    });
  }

  ngOnInit() {
    this.updateMenuItems();
  }
  private roleActions: Record<string, RoleAction[]> = {
    HR: [
      {
        key: 'RETRY_PROCESSING',
        label: 'RETRY_PROCESSING',
        icon: 'pi pi-refresh',
        iconColor: 'text-blue-500',
        can: () =>
          this.candidateAiProcessingHistoryResponseDto()?.status ===
          ProcessingStatus.FAILED,
        action: () => this.retryProcessing(),
      },
    ],
    HR_ADMIN: [
      {
        key: 'RETRY_PROCESSING',
        label: 'RETRY_PROCESSING',
        icon: 'pi pi-refresh',
        iconColor: 'text-blue-500',
        can: () =>
          this.candidateAiProcessingHistoryResponseDto()?.status ===
          ProcessingStatus.FAILED,
        action: () => this.retryProcessing(),
      },
    ],
    RECRUITER: [
      {
        key: 'RETRY_PROCESSING',
        label: 'RETRY_PROCESSING',
        icon: 'pi pi-refresh',
        iconColor: 'text-blue-500',
        can: () =>
          this.candidateAiProcessingHistoryResponseDto()?.status ===
          ProcessingStatus.FAILED,
        action: () => this.retryProcessing(),
      },
    ],
  };

  toggle(event: any) {
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  retryProcessing() {
    this.candidateAiService.retryResumeProcessing(
      this.candidateAiProcessingHistoryResponseDto()!.id
    );
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
}
