import { Component, effect, inject } from '@angular/core';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { OfferStaffResponse } from '../../../../../core/models/staff.models';

@Component({
  selector: 'app-manage-offer-recruiters-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './manage-offer-recruiters-dialog.component.html',
})
export class ManageOfferRecruitersDialogComponent {
  offerService = inject(OfferService);
  staffService = inject(StaffService);
  selectedRecruiterId: string | null = null;

  constructor() {
    effect(() => {
      if (this.offerService.selectedOffer()) {
        this.selectedRecruiterId = null;
        this.staffService.getCompanyStaffByOfferId(
          this.offerService.selectedOffer()!.companyId,
          this.offerService.selectedOffer()!.offerId,
          'RECRUITER'
        );
      }
    });
  }

  isSelected(recruiterId: string): boolean {
    return (
      this.staffService
        .offerRecruitersList()
        .find((r: OfferStaffResponse) => r.selected === true)?.staff.id ===
      recruiterId
    );
  }
  onHide(): void {
    this.offerService.closeManageRecruitersDialog();
  }
  onVisibleChange(visible: boolean): void {
    this.staffService.resetOfferRecruitersList();
    this.offerService.setManageRecruitersDialogVisible(visible);
  }

  onRadioChange(recruiterId: string): void {
    this.selectedRecruiterId = recruiterId;
    this.staffService.offerRecruitersList.set(
      this.staffService.offerRecruitersList().map((r) => {
        if (r.staff.id === recruiterId) {
          return { ...r, selected: !r.selected };
        }
        return { ...r, selected: false };
      })
    );
  }

  getSelectedRecruiterMessage(): string {
    if (!this.selectedRecruiterId) {
      return '';
    }
    const selectedRecruiter = this.staffService
      .offerRecruitersList()
      .find((r: OfferStaffResponse) => r.staff.id === this.selectedRecruiterId);
    return selectedRecruiter
      ? ` ${selectedRecruiter.staff.firstName} ${selectedRecruiter.staff.lastName}`
      : '';
  }

  saveRecruiterAssignment(): void {
    if (this.selectedRecruiterId) {
      this.offerService.assignOfferToRecruiter(
        this.offerService.selectedOffer()!.offerId,
        this.offerService.selectedOffer()!.companyId,
        this.selectedRecruiterId
      );
    }
  }
}
