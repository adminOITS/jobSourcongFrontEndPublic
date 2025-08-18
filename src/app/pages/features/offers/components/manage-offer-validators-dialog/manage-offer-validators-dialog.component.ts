import { Component, effect, inject } from '@angular/core';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { OfferStaffResponse } from '../../../../../core/models/staff.models';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-offer-validators-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './manage-offer-validators-dialog.component.html',
  styles: ``,
})
export class ManageOfferValidatorsDialogComponent {
  offerService = inject(OfferService);
  staffService = inject(StaffService);
  selectedValidatorId: string | null = null;

  constructor() {
    effect(() => {
      if (this.offerService.selectedOffer()) {
        this.selectedValidatorId = null;
        this.staffService.getCompanyStaffByOfferId(
          this.offerService.selectedOffer()!.companyId,
          this.offerService.selectedOffer()!.offerId,
          'VALIDATOR'
        );
      }
    });
  }

  isSelected(validatorId: string): boolean {
    return this.staffService
      .offerValidatorsList()
      .find((r: OfferStaffResponse) => r.staff.id === validatorId && r.selected)
      ? true
      : false;
  }
  onHide(): void {
    this.offerService.closeManageValidatorsDialog();
    this.staffService.resetOfferValidatorsList();
  }
  onVisibleChange(visible: boolean): void {
    this.staffService.resetOfferValidatorsList();
    this.offerService.setManageValidatorsDialogVisible(visible);
  }
  onCheckboxChange(validatorId: string): void {
    this.selectedValidatorId = validatorId;
    this.staffService.offerValidatorsList.set(
      this.staffService.offerValidatorsList().map((r) => {
        if (r.staff.id === validatorId) {
          return { ...r, selected: !r.selected };
        }
        return { ...r };
      })
    );
  }
  getSelectedValidatorMessage(): string | number {
    const selectedLength = this.staffService
      .offerValidatorsList()
      .filter((r) => r.selected).length;
    const totalComponents = this.staffService.offerValidatorsList().length;

    if (selectedLength === totalComponents) {
      return 'ALL_VALIDATORS_SELECTED';
    } else if (selectedLength === 1) {
      return 'ONE_VALIDATOR_SELECTED';
    } else if (selectedLength === 2) {
      return 'TWO_VALIDATORS_SELECTED';
    } else if (selectedLength > 1 && selectedLength < totalComponents) {
      return selectedLength;
    } else {
      return 'NO_VALIDATOR_SELECTED';
    }
  }
  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  saveValidatorAssignment(): void {
    const selectedValidators = this.staffService
      .offerValidatorsList()
      .filter((r) => r.selected);
    if (selectedValidators.length > 0) {
      this.offerService.assignOfferToValidator(
        this.offerService.selectedOffer()!.offerId,
        this.offerService.selectedOffer()!.companyId,
        selectedValidators.map((r) => r.staff.id)
      );
    }
  }
}
