import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Component, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { StaffResponse } from '../../../../../core/models/staff.models';

@Component({
  selector: 'app-staff-details-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, TranslateModule],
  templateUrl: './staff-details-dialog.component.html',
  styles: ``,
})
export class StaffDetailsDialogComponent {
  staffService = inject(StaffService);

  // Expose signals from service
  isStaffDetailsDialogVisible = this.staffService.isStaffDetailsDialogVisible;
  selectedStaffForDetails = this.staffService.selectedStaffForDetails;

  closeDialog(): void {
    this.staffService.closeStaffDetailsDialog();
  }

  editStaff(): void {
    if (this.selectedStaffForDetails()) {
      this.staffService.openEditStaffDialog(this.selectedStaffForDetails()!);
      this.closeDialog();
    }
  }
}
