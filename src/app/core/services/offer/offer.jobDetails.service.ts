import { Injectable, signal, computed, inject } from '@angular/core';
import { OfferJobDetails } from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class OfferJobDetailsService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedOfferJobDetails = signal<OfferJobDetails | null>(null);
  private isDialogVisible = signal(false);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  private _isJobDetailsLoading = signal<boolean>(false);

  selectedOfferJobDetailsComputed = computed(() =>
    this.selectedOfferJobDetails()
  );
  isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isJobDetailsLoading = computed(() => this._isJobDetailsLoading());
  openAddDialog(): void {
    this.selectedOfferJobDetails.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(offerJobDetails: OfferJobDetails): void {
    this.selectedOfferJobDetails.set(offerJobDetails);
    this.isDialogVisible.set(true);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }
  closeDialog(): void {
    this.isDialogVisible.set(false);
    this.selectedOfferJobDetails.set(null);
  }

  updateOfferJobDetails(offerJobDetails: OfferJobDetails) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}`;
    this._isJobDetailsLoading.set(true);
    return this.http
      .put<OfferJobDetails>(url, offerJobDetails)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isJobDetailsLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_UPDATED_SUCCESSFULLY');
          this.offerService.updateOfferDetailsSignal({
            ...this.offerService.offerDetails()!,
            ...res,
          });
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_UPDATED_FAILED');
        },
      });
  }
}
