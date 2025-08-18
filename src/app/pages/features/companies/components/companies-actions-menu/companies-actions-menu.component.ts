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
  selector: 'app-companies-actions-menu',
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './companies-actions-menu.component.html',
  styles: ``,
})
export class CompaniesActionsMenuComponent {
  @Input({ required: true }) company!: WritableSignal<any | null>;
  @ViewChild('menu') menu: any;

  @Output() onDeleteCompany = new EventEmitter<void>();
  menuItems: MenuItem[] = [];
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private router = inject(Router);
  constructor() {
    effect(() => {
      if (this.company()) {
        this.updateMenuItems();
      }
    });
  }

  // Define possible actions for each role
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
        key: 'DELETE_COMPANY',
        label: 'DELETE_COMPANY',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteCompany(),
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
    if (this.company()) {
      const currentUrl = this.router.url;
      this.router.navigate([`${currentUrl}/${this.company().id}`]);
    }
  }

  private deleteCompany() {
    this.onDeleteCompany.emit();
  }
}
