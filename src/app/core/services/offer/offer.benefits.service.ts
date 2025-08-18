import { Injectable, computed, inject, signal } from '@angular/core';
import { OfferBenefits } from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class OfferBenefitsService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  // State signals
  private selectedBenefit = signal<OfferBenefits | undefined>(undefined);
  private isDialogVisible = signal<boolean>(false);
  private _isBenefitLoading = signal<boolean>(false);

  // Public computed values
  readonly selectedBenefitComputed = computed(() => this.selectedBenefit());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isBenefitLoading = computed(() => this._isBenefitLoading());
  setSelectedBenefit(benefit: OfferBenefits | undefined) {
    this.selectedBenefit.set(benefit);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  updateBenefit(benefit: OfferBenefits) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/benefits`;
    this._isBenefitLoading.set(true);
    return this.http
      .put<OfferBenefits>(url, benefit)
      .pipe(
        take(1),
        finalize(() => {
          this._isBenefitLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('BENEFITS_UPDATED_SUCCESSFULLY');
          this.offerService.offerBenefits.set(res.benefits);
          this.offerService.updateOfferBenefits(res);
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_BENEFITS');
        },
      });
  }

  // Helper methods
  private clearSelection() {
    this.selectedBenefit.set(undefined);
    this.isDialogVisible.set(false);
  }

  // Dialog management
  openAddDialog() {
    this.selectedBenefit.set(undefined);
    this.isDialogVisible.set(true);
  }

  openEditDialog(benefit: OfferBenefits) {
    this.selectedBenefit.set(benefit);
    this.isDialogVisible.set(true);
  }

  closeDialog() {
    this.clearSelection();
  }
}
