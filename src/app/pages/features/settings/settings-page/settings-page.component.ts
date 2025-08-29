import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GenericSettingsComponent } from './components/generic-settings.component';
import { ProfileSettingsComponent } from './components/profile-settings.component';
import { SecuritySettingsComponent } from './components/security-settings.component';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserRole } from '../../../../core/models/user.models';
import { StaffService } from '../../../../core/services/company/staff.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GenericSettingsComponent,
    ProfileSettingsComponent,
    SecuritySettingsComponent,
    HasRoleDirective,
  ],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  private authService = inject(AuthService);
  private staffService = inject(StaffService);

  constructor() {
    if (this.authService.getRole() !== UserRole.HR_ADMIN) {
      const staffId = this.authService.getUser()?.staffId;
      const companyId = this.authService.getUser()?.companyId;
      if (staffId && companyId) {
        this.staffService.getStaffById(staffId, companyId);
      }
    }
  }
}
