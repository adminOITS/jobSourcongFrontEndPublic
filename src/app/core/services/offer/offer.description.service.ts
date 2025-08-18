import { Injectable, computed, inject, signal } from '@angular/core';
import { OfferDescription } from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class OfferDescriptionService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  // State signals
  private selectedDescription = signal<OfferDescription | undefined>(undefined);
  private isDialogVisible = signal<boolean>(false);
  private _isDescriptionLoading = signal<boolean>(false);

  // Public computed values
  readonly selectedDescriptionComputed = computed(() =>
    this.selectedDescription()
  );
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isDescriptionLoading = computed(() => this._isDescriptionLoading());
  setSelectedDescription(description: OfferDescription | undefined) {
    this.selectedDescription.set(description);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  updateDescription(description: OfferDescription) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/description`;
    this._isDescriptionLoading.set(true);
    return this.http
      .put<OfferDescription>(url, description)
      .pipe(
        take(1),
        finalize(() => {
          this._isDescriptionLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('DESCRIPTION_UPDATED_SUCCESSFULLY');
          this.closeDialog();
          this.offerService.offerDescription.set(res.description);
          this.offerService.updateOfferDescription(res);
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_DESCRIPTION');
        },
      });
  }
  // Helper methods
  private clearSelection() {
    this.selectedDescription.set(undefined);
    this.isDialogVisible.set(false);
  }

  // Dialog management
  openAddDialog() {
    this.selectedDescription.set(undefined);
    this.isDialogVisible.set(true);
  }

  openEditDialog(description: OfferDescription) {
    this.selectedDescription.set(description);
    this.isDialogVisible.set(true);
  }

  closeDialog() {
    this.clearSelection();
  }
}
