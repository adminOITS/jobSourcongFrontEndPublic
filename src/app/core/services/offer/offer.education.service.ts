import { Injectable, computed, inject, signal } from '@angular/core';
import {
  OfferEducationRequest,
  OfferEducationResponse,
} from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class OfferEducationService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  offerEducations = this.offerService.offerEducations;
  // State signals
  private selectedEducation = signal<OfferEducationResponse | undefined>(
    undefined
  );
  private isDialogVisible = signal<boolean>(false);
  private _isEducationLoading = signal<boolean>(false);

  // Public computed values
  readonly selectedEducationComputed = computed(() => this.selectedEducation());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isEducationLoading = computed(() => this._isEducationLoading());

  setSelectedEducation(education: OfferEducationResponse | undefined) {
    this.selectedEducation.set(education);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  // CRUD operations
  addEducation(education: OfferEducationRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/educations`;
    this._isEducationLoading.set(true);
    return this.http
      .post<OfferEducationResponse>(url, education)
      .pipe(
        take(1),
        finalize(() => {
          this._isEducationLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EDUCATION_ADDED_SUCCESSFULLY');
          this.closeDialog();
          this.offerEducations.set([...this.offerEducations(), res]);
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_ADDING_EDUCATION');
        },
      });
  }

  updateEducation(education: OfferEducationRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const educationId: string = this.selectedEducationComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/educations/${educationId}`;
    this._isEducationLoading.set(true);
    return this.http
      .put<OfferEducationResponse>(url, education)
      .pipe(
        take(1),
        finalize(() => {
          this._isEducationLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EDUCATION_UPDATED_SUCCESSFULLY');
          this.closeDialog();
          this.offerEducations.set(
            this.offerEducations().map((edu) => (edu.id === res.id ? res : edu))
          );
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_EDUCATION');
        },
      });
  }

  deleteEducation() {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const educationId: string = this.selectedEducationComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/educations/${educationId}`;
    this._isEducationLoading.set(true);
    return this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isEducationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('EDUCATION_DELETED_SUCCESSFULLY');
          this.offerEducations.set(
            this.offerEducations().filter((edu) => edu.id !== educationId)
          );
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_DELETING_EDUCATION');
        },
      });
  }

  // Helper methods
  private clearSelection() {
    this.selectedEducation.set(undefined);
    this.isDialogVisible.set(false);
  }

  // Dialog management
  openAddDialog() {
    this.selectedEducation.set(undefined);
    this.isDialogVisible.set(true);
  }

  openEditDialog(education: OfferEducationResponse) {
    this.selectedEducation.set(education);
    this.isDialogVisible.set(true);
  }

  closeDialog() {
    this.clearSelection();
  }
}
