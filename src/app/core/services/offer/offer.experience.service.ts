import { Injectable, signal, computed, inject } from '@angular/core';
import {
  OfferExperienceRequest,
  OfferExperienceResponse,
} from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class OfferExperienceService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedExperience = signal<OfferExperienceResponse | null>(null);
  private isDialogVisible = signal(false);
  private messageWrapper = inject(MessageWrapperService);
  private _isExperienceLoading = signal<boolean>(false);

  private offerService = inject(OfferService);
  offerExperiences = this.offerService.offerExperiences;
  readonly isExperienceLoading = computed(() => this._isExperienceLoading());

  selectedExperienceComputed = computed(() => this.selectedExperience());
  isDialogVisibleComputed = computed(() => this.isDialogVisible());

  setSelectedExperience(experience: OfferExperienceResponse | null) {
    this.selectedExperience.set(experience);
  }

  openAddDialog(): void {
    this.selectedExperience.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(experience: OfferExperienceResponse): void {
    this.selectedExperience.set(experience);
    this.isDialogVisible.set(true);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }
  closeDialog(): void {
    this.isDialogVisible.set(false);
    this.selectedExperience.set(null);
  }

  addExperience(experience: OfferExperienceRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/experiences`;
    this._isExperienceLoading.set(true);
    this.http
      .post<OfferExperienceResponse>(url, experience)
      .pipe(
        take(1),
        finalize(() => {
          this._isExperienceLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EXPERIENCE_ADDED_SUCCESSFULLY');
          this.offerExperiences.set([...this.offerExperiences(), res]);
          this.closeDialog();
        },
        error: () => {
          this.messageWrapper.error('ERROR_ADDING_EXPERIENCE');
        },
      });
  }

  updateExperience(experience: OfferExperienceRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const experienceId: string = this.selectedExperienceComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/experiences/${experienceId}`;
    this._isExperienceLoading.set(true);
    return this.http
      .put<OfferExperienceResponse>(url, experience)
      .pipe(
        take(1),
        finalize(() => {
          this._isExperienceLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EXPERIENCE_UPDATED_SUCCESSFULLY');
          this.offerExperiences.set(
            this.offerExperiences().map((exp) =>
              exp.id === res.id ? res : exp
            )
          );
          this.closeDialog();
        },
        error: () => {
          this.messageWrapper.error('ERROR_UPDATING_EXPERIENCE');
        },
      });
  }

  deleteExperience() {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const experienceId: string = this.selectedExperienceComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/experiences/${experienceId}`;
    this._isExperienceLoading.set(true);
    return this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isExperienceLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('EXPERIENCE_DELETED_SUCCESSFULLY');
          this.offerExperiences.set(
            this.offerExperiences().filter((exp) => exp.id !== experienceId)
          );
          this.closeDialog();
        },
        error: () => {
          this.messageWrapper.error('ERROR_DELETING_EXPERIENCE');
        },
      });
  }
}
