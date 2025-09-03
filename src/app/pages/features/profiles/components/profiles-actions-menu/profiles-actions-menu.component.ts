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
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';

@Component({
  selector: 'app-profiles-actions-menu',
  standalone: true,
  imports: [MenuModule, RippleModule, TranslateModule],
  templateUrl: './profiles-actions-menu.component.html',
  styles: [],
})
export class ProfilesActionsMenuComponent implements OnInit {
  @Input({ required: true }) profile!: WritableSignal<any | null>;
  @Input() isOfferDetails = false;
  @ViewChild('menu') menu: any;

  @Output() onDeleteProfile = new EventEmitter<void>();
  menuItems: MenuItem[] = [];
  private authService = inject(AuthService);
  private userRole = this.authService.getRole();
  private profileService = inject(ProfileService);

  private applicationService = inject(ApplicationService);
  constructor() {
    effect(() => {
      if (this.profile()) {
        this.updateMenuItems();
      }
    });
  }

  // Define possible actions for each role
  private roleActions: Record<string, RoleAction[]> = {
    HR: [
      // {
      //   key: 'VIEW_DETAILS',
      //   label: 'VIEW_DETAILS',
      //   icon: 'pi pi-eye',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.viewDetails(),
      // },

      {
        key: 'APPLY_TO_OFFER',
        label: 'APPLY',
        icon: 'pi pi-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.applyToOffer(),
        show: this.isOfferDetails,
      },
      {
        key: 'EDIT_PROFILE',
        label: 'EDIT',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        show: !this.isOfferDetails,
        action: () => this.editProfile(),
      },
      {
        key: 'EDIT_RESUME',
        label: 'EDIT_RESUME',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        show: !this.isOfferDetails,
        action: () => this.editResume(),
      },
      {
        key: 'DELETE_PROFILE',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,

        action: () => this.deleteProfile(),
      },
    ],
    HR_ADMIN: [
      // {
      //   key: 'VIEW_DETAILS',
      //   label: 'VIEW_DETAILS',
      //   icon: 'pi pi-eye',
      //   iconColor: 'text-gray-500',
      //   can: () => true,
      //   action: () => this.viewDetails(),
      // },

      {
        key: 'APPLY_TO_OFFER',
        label: 'APPLY',
        icon: 'pi pi-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.applyToOffer(),
        show: this.isOfferDetails,
      },
      {
        key: 'EDIT_PROFILE',
        label: 'EDIT',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        show: !this.isOfferDetails,
        action: () => this.editProfile(),
      },
      {
        key: 'EDIT_RESUME',
        label: 'EDIT_RESUME',
        icon: 'pi pi-pencil',
        iconColor: 'text-blue-500',
        can: () => true,
        show: !this.isOfferDetails,
        action: () => this.editResume(),
      },
      {
        key: 'DELETE_PROFILE',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteProfile(),
      },
    ],
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
        key: 'APPLY_TO_OFFER',
        label: 'APPLY',
        icon: 'pi pi-plus',
        iconColor: 'text-green-500',
        can: () => true,
        action: () => this.applyToOffer(),
        show: this.isOfferDetails,
      },
      {
        key: 'DELETE_PROFILE',
        label: 'DELETE',
        icon: 'pi pi-trash',
        iconColor: 'text-red-500',
        can: () => true,
        action: () => this.deleteProfile(),
      },
    ],
    // VALIDATOR: [
    //   {
    //     key: 'VIEW_DETAILS',
    //     label: 'VIEW_DETAILS',
    //     icon: 'pi pi-eye',
    //     iconColor: 'text-gray-500',
    //     can: () => true,
    //     action: () => this.viewDetails(),
    //   },
    // ],
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

    this.menuItems = actions
      .filter((action: RoleAction) => {
        if (action.show === undefined) {
          return true;
        }
        if (action.show == false && this.isOfferDetails) {
          return true;
        }
        if (action.show == true && !this.isOfferDetails) {
          return true;
        }
        return false;
      })
      .map((action: RoleAction) => ({
        label: action.label,
        icon: action.icon + ' ' + action.iconColor,
        command: action.action,
        disabled: !action.can(),
      }));
  }

  private viewDetails(): void {}
  private applyToOffer() {
    if (this.profile()) {
      this.applicationService.createApplication(
        this.profile().candidate.id,
        this.profile().id
      );
    }
  }
  private deleteProfile() {
    this.onDeleteProfile.emit();
  }
  private editProfile() {
    this.profileService.openEditProfileDialog(this.profile()!);
  }
  private editResume() {
    this.profileService.openEditProfileResumeDialog(this.profile()!);
  }
}
