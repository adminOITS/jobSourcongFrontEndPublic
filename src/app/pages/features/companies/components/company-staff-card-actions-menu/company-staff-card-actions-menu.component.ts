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
import { RoleAction } from '../../../../../core/types';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-company-staff-card-actions-menu',
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './company-staff-card-actions-menu.component.html',
  styles: ``,
})
export class CompanyStaffCardActionsMenuComponent {
  @Input({ required: true }) staff!: WritableSignal<any | null>;
  @ViewChild('menu') menu: any;

  @Output() onDeleteStaff = new EventEmitter<void>();
  @Output() onEditStaff = new EventEmitter<void>();
  @Output() onViewDetails = new EventEmitter<void>();
  menuItems: MenuItem[] = [];
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private router = inject(Router);

  private roleActions: Record<string, RoleAction[]> = {
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
        key: 'EDIT_STAFF',
        label: 'EDIT',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        action: () => this.editStaff(),
      },

      {
        key: 'DELETE_STAFF',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteStaff(),
      },
    ],
  };
  constructor() {
    effect(() => {
      this.updateMenuItems();
    });
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
    this.onViewDetails.emit();
  }
  private editStaff(): void {
    this.onEditStaff.emit();
  }
  private deleteStaff(): void {
    this.onDeleteStaff.emit();
  }
}
