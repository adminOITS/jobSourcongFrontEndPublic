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
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../../routes';

@Component({
  selector: 'app-offers-actions-menu',
  standalone: true,
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './offers-actions-menu.component.html',
  styles: [],
})
export class OffersActionsMenuComponent implements OnInit {
  @Input({ required: true }) offer!: WritableSignal<any | null>;
  @ViewChild('menu') menu: any;
  @Output() onManageRecruiters = new EventEmitter<void>();
  @Output() onOpenOffer = new EventEmitter<void>();
  @Output() onHoldOffer = new EventEmitter<void>();
  @Output() onCloseOffer = new EventEmitter<void>();
  @Output() onDeleteOffer = new EventEmitter<void>();
  @Output() onManageValidators = new EventEmitter<void>();

  menuItems: MenuItem[] = [];
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (this.offer()) {
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
        key: 'MANAGE_RECRUITERS',
        label: 'MANAGE_RECRUITERS',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.manageRecruiters(),
      },
      {
        key: 'MANAGE_VALIDATORS',
        label: 'MANAGE_VALIDATORS',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.manageValidators(),
      },
      {
        key: 'OPEN_OFFER',
        label: 'OPEN_OFFER',
        icon: 'pi pi-play',
        iconColor: 'text-green-500',
        can: () =>
          this.offer()?.status === 'HOLD' || this.offer()?.status === 'CLOSE',
        action: () => this.openOffer(),
      },
      {
        key: 'HOLD_OFFER',
        label: 'HOLD_OFFER',
        icon: 'pi pi-pause',
        iconColor: 'text-yellow-500',
        can: () => this.offer()?.status === 'OPEN',
        action: () => this.holdOffer(),
      },
      {
        key: 'CLOSE_OFFER',
        label: 'CLOSE_OFFER',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => this.offer()?.status === 'OPEN',
        action: () => this.closeOffer(),
      },
      {
        key: 'DELETE_OFFER',
        label: 'DELETE_OFFER',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () =>
          this.offer()?.status === 'OPEN' || this.offer()?.status === 'CLOSE',
        action: () => this.deleteOffer(),
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
        key: 'MANAGE_RECRUITERS',
        label: 'MANAGE_RECRUITERS',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.manageRecruiters(),
      },
      {
        key: 'MANAGE_VALIDATORS',
        label: 'MANAGE_VALIDATORS',
        icon: 'pi pi-user-plus',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.manageValidators(),
      },
      {
        key: 'OPEN_OFFER',
        label: 'OPEN_OFFER',
        icon: 'pi pi-play',
        iconColor: 'text-green-500',
        can: () =>
          this.offer()?.status === 'HOLD' || this.offer()?.status === 'CLOSE',
        action: () => this.openOffer(),
      },
      {
        key: 'HOLD_OFFER',
        label: 'HOLD_OFFER',
        icon: 'pi pi-pause',
        iconColor: 'text-yellow-500',
        can: () => this.offer()?.status === 'OPEN',
        action: () => this.holdOffer(),
      },
      {
        key: 'CLOSE_OFFER',
        label: 'CLOSE_OFFER',
        icon: 'pi pi-times',
        iconColor: 'text-red-500',
        can: () => this.offer()?.status === 'OPEN',
        action: () => this.closeOffer(),
      },
      {
        key: 'DELETE_OFFER',
        label: 'DELETE_OFFER',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () =>
          this.offer()?.status === 'OPEN' || this.offer()?.status === 'CLOSE',
        action: () => this.deleteOffer(),
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
      label: action.label,
      icon: action.icon + ' ' + action.iconColor,
      command: action.action,
      disabled: !action.can(),
    }));
  }

  private viewDetails(): void {
    if (this.offer()) {
      const currentUrl = this.router.url;
      const url = currentUrl.split('/');
      this.router.navigate([
        `${url[1]}/${ROUTES.OFFER.LIST}/${this.offer().id}`,
      ]);
    }
  }

  private manageRecruiters() {
    this.onManageRecruiters.emit();
  }

  private manageValidators() {
    this.onManageValidators.emit();
  }

  private openOffer() {
    this.onOpenOffer.emit();
  }

  private holdOffer() {
    this.onHoldOffer.emit();
  }

  private closeOffer() {
    this.onCloseOffer.emit();
  }

  private deleteOffer() {
    this.onDeleteOffer.emit();
  }
}
