import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffResponse } from '../../../../../core/models/staff.models';
import { CompanyDetailsMembersTabStaffListComponent } from '../company-details-members-tab-staff-list/company-details-members-tab-staff-list.component';
import { CompanyDetailsMembersTabStaffAssignmentsComponent } from '../company-details-members-tab-staff-assignments/company-details-members-tab-staff-assignments.component';
import { TranslateModule } from '@ngx-translate/core';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { AddEditCompanyStaffDialogComponent } from '../add-edit-company-staff-dialog/add-edit-company-staff-dialog.component';
import { StaffDetailsDialogComponent } from '../staff-details-dialog/staff-details-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-company-details-members-tab',
  standalone: true,
  imports: [
    CommonModule,
    CompanyDetailsMembersTabStaffListComponent,
    CompanyDetailsMembersTabStaffAssignmentsComponent,
    TranslateModule,
    AddEditCompanyStaffDialogComponent,
    StaffDetailsDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './company-details-members-tab.component.html',
  styles: ``,
})
export class CompanyDetailsMembersTabComponent implements OnDestroy {
  private staffService = inject(StaffService);
  private offerService = inject(OfferService);

  // Expose signals from service
  isStaffListCollapsed = this.staffService.isStaffListCollapsed;
  selectedStaff = this.staffService.selectedStaff;
  isStaffListLoading = this.staffService.isStaffRequestLoading;
  private route = inject(ActivatedRoute);
  companyId!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
      this.staffService.getStaffByCompanyId(this.companyId);
    });
    this.offerService.emptyOffers();
  }

  onStaffSelected(staff: StaffResponse) {
    this.staffService.setSelectedStaff(staff);
  }

  showAddStaffDialog() {
    this.staffService.openAddStaffDialog();
  }

  toggleStaffList(): void {
    this.staffService.toggleStaffList();
  }

  ngOnDestroy(): void {
    this.offerService.emptyOffers();
  }
}
