import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { CompanyResponse } from '../../../../../core/models/company.models';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { APP_ROLES } from '../../../../../core/utils/constants';
import { EditLogoDialogComponent } from '../edit-logo-dialog';
import { EditCompanyDialogComponent } from '../edit-company-dialog/edit-company-dialog.component';
import { EditCompanyHrDialogComponent } from '../edit-company-hr-dialog/edit-company-hr-dialog.component';
import { StaffService } from '../../../../../core/services/company/staff.service';

@Component({
  selector: 'app-company-details-overview-tab',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TagModule,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    SkeletonModule,
    EditCompanyDialogComponent,
    EditLogoDialogComponent,
    EditCompanyHrDialogComponent,
  ],
  templateUrl: './company-details-overview-tab.component.html',
})
export class CompanyDetailsOverviewTabComponent {
  companyService = inject(CompanyService);
  authService = inject(AuthService);

  isHr = this.authService.currentUser()?.roles.includes(APP_ROLES.HR);
  company = this.companyService.companyDetails;
  isImageLoading = signal(true);
  route = inject(ActivatedRoute);
  private staffService = inject(StaffService);

  companyId!: string;

  @ViewChild('logoDialogRef') logoDialogRef!: EditLogoDialogComponent;

  openHrEditDialog() {
    this.staffService.openEditHrDialog({
      firstName: 'x',
      lastName: 'x',
      phone: 'x',
      city: 'x',
      country: 'x',
      email: 'x',
      role: 'HR',
      isEnabled: true,
      id: 'x',
    });
  }

  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
  }

  ngOnInit() {
    if (this.isHr) {
      this.companyService.getCompanyById(this.companyId);
    }
  }

  onImageLoaded() {
    this.isImageLoading.set(false);
  }

  onImageError() {
    this.isImageLoading.set(false);
  }

  editLogo() {
    if (this.logoDialogRef) {
      this.logoDialogRef.showDialog();
    }
  }

  editCompanyInfo() {
    this.companyService.openEditCompanyDialog();
  }

  onLogoUpdated() {
    // Refresh company data after logo update
    if (this.companyId) {
      this.companyService.getCompanyById(this.companyId);
    }
  }
}
