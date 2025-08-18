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
import { MenuItem } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { RoleAction } from '../../../../../core/types';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import {
  CandidateAvailabilityStatusEnum,
  CandidateValidationStatusEnum,
} from '../../../../../core/models/candidate.models';

@Component({
  selector: 'app-candidates-actions-menu',
  standalone: true,
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './candidates-actions-menu.component.html',
  styles: [],
})
export class CandidatesActionsMenuComponent implements OnInit {
  @Input({ required: true }) candidate!: WritableSignal<any | null>;
  @ViewChild('menu') menu: any;
  @Output() onDeleteCandidate = new EventEmitter<void>();

  menuItems: MenuItem[] = [];
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private candidateService = inject(CandidateService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.candidate()) {
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
        key: 'VALIDATE_CANDIDATE',
        label: 'MARK_AS_VALID',
        icon: 'pi pi-check-circle',
        iconColor: 'text-green-600',
        can: () => this.candidate()?.candidateCreationSource !== 'MANUAL',
        action: () => this.validateCandidate(),
      },
      {
        key: 'MARK_AS_INVALID',
        label: 'MARK_AS_INVALID',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-600',
        can: () => this.candidate()?.candidateCreationSource !== 'MANUAL',
        action: () => this.markAsInvalid(),
      },
      {
        key: 'MARK_AS_REACHABLE',
        label: 'MARK_AS_REACHABLE',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'REACHABLE',
        action: () => this.markAsReachable(),
      },
      {
        key: 'MARK_AS_UNREACHABLE',
        label: 'MARK_AS_UNREACHABLE',
        icon: 'pi pi-user-minus',
        iconColor: 'text-yellow-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'UNREACHABLE',
        action: () => this.markAsUnreachable(),
      },
      {
        key: 'DELETE_CANDIDATE',
        label: 'DELETE_CANDIDATE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-700',
        can: () => true,
        action: () => this.deleteCandidate(),
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
        key: 'VALIDATE_CANDIDATE',
        label: 'MARK_AS_VALID',
        icon: 'pi pi-check-circle',
        iconColor: 'text-green-600',
        can: () => this.candidate()?.candidateCreationSource !== 'MANUAL',
        action: () => this.validateCandidate(),
      },
      {
        key: 'MARK_AS_INVALID',
        label: 'MARK_AS_INVALID',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-600',
        can: () => this.candidate()?.candidateCreationSource !== 'MANUAL',
        action: () => this.markAsInvalid(),
      },
      {
        key: 'MARK_AS_REACHABLE',
        label: 'MARK_AS_REACHABLE',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'REACHABLE',
        action: () => this.markAsReachable(),
      },
      {
        key: 'MARK_AS_UNREACHABLE',
        label: 'MARK_AS_UNREACHABLE',
        icon: 'pi pi-user-minus',
        iconColor: 'text-yellow-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'UNREACHABLE',
        action: () => this.markAsUnreachable(),
      },
      {
        key: 'DELETE_CANDIDATE',
        label: 'DELETE_CANDIDATE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-700',
        can: () => true,
        action: () => this.deleteCandidate(),
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
        key: 'VALIDATE_CANDIDATE',
        label: 'MARK_AS_VALID',
        icon: 'pi pi-check-circle',
        iconColor: 'text-green-600',
        can: () => this.candidate()?.candidateValidationStatus !== 'VERIFIED',
        action: () => this.validateCandidate(),
      },
      {
        key: 'MARK_AS_INVALID',
        label: 'MARK_AS_INVALID',
        icon: 'pi pi-times-circle',
        iconColor: 'text-red-600',
        can: () =>
          this.candidate()?.candidateValidationStatus !== 'INVALIDATED',
        action: () => this.markAsInvalid(),
      },
      {
        key: 'MARK_AS_REACHABLE',
        label: 'MARK_AS_REACHABLE',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'REACHABLE',
        action: () => this.markAsReachable(),
      },
      {
        key: 'MARK_AS_UNREACHABLE',
        label: 'MARK_AS_UNREACHABLE',
        icon: 'pi pi-user-minus',
        iconColor: 'text-yellow-600',
        can: () =>
          this.candidate()?.candidateAvailabilityStatus !== 'UNREACHABLE',
        action: () => this.markAsUnreachable(),
      },
      {
        key: 'DELETE_CANDIDATE',
        label: 'DELETE_CANDIDATE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-700',
        can: () => true,
        action: () => this.deleteCandidate(),
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
    const candidate = this.candidate();

    this.menuItems = actions
      .filter((action: RoleAction) => {
        // Hide validate/invalidate actions for manually created candidates
        if (
          action.key === 'VALIDATE_CANDIDATE' ||
          action.key === 'MARK_AS_INVALID'
        ) {
          return candidate?.candidateCreationSource !== 'MANUAL';
        }

        // Show all other actions (including availability actions)
        return true;
      })
      .map((action: RoleAction) => ({
        label: action.label,
        icon: action.icon + ' ' + action.iconColor,
        command: action.action,
        disabled: !action.can(),
      }));
  }

  private viewDetails(): void {
    if (this.candidate()) {
      const currentUrl = this.router.url;
      this.router.navigate([`${currentUrl}/${this.candidate().id}`]);
    }
  }

  private deleteCandidate() {
    this.onDeleteCandidate.emit();
  }

  private validateCandidate() {
    this.candidateService.updateCandidateValidationStatus(
      this.candidate().id,
      CandidateValidationStatusEnum.VERIFIED
    );
  }

  private markAsInvalid() {
    this.candidateService.updateCandidateValidationStatus(
      this.candidate().id,
      CandidateValidationStatusEnum.INVALIDATED
    );
  }

  private markAsReachable() {
    this.candidateService.updateCandidateAvailability(
      this.candidate().id,
      CandidateAvailabilityStatusEnum.REACHABLE
    );
  }

  private markAsUnreachable() {
    this.candidateService.updateCandidateAvailability(
      this.candidate().id,
      CandidateAvailabilityStatusEnum.UNREACHABLE
    );
  }
}
