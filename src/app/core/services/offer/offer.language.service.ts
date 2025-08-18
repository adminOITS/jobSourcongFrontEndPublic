import { Injectable, computed, inject, signal } from '@angular/core';
import {
  OfferLanguageRequest,
  OfferLanguageResponse,
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
export class OfferLanguageService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedLanguage = signal<OfferLanguageResponse | null>(null);
  private isDialogVisible = signal<boolean>(false);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  private _isLanguageLoading = signal<boolean>(false);
  offerLanguages = this.offerService.offerLanguages;

  readonly selectedLanguageComputed = computed(() => this.selectedLanguage());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isLanguageLoading = computed(() => this._isLanguageLoading());
  setSelectedLanguage(language: OfferLanguageResponse | null) {
    this.selectedLanguage.set(language);
  }

  openAddDialog() {
    this.selectedLanguage.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(language: OfferLanguageResponse) {
    this.selectedLanguage.set(language);
    this.isDialogVisible.set(true);
  }
  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  closeDialog() {
    this.isDialogVisible.set(false);
    this.selectedLanguage.set(null);
  }

  addLanguage(language: OfferLanguageRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/languages`;
    this._isLanguageLoading.set(true);
    return this.http
      .post<OfferLanguageResponse>(url, language)
      .pipe(
        take(1),
        finalize(() => {
          this._isLanguageLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('LANGUAGE_ADDED_SUCCESSFULLY');
          this.offerLanguages.set([...this.offerLanguages(), res]);
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_ADDING_LANGUAGE');
        },
      });
  }

  updateLanguage(language: OfferLanguageRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const languageId: string = this.selectedLanguageComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/languages/${languageId}`;
    this._isLanguageLoading.set(true);
    return this.http
      .put<OfferLanguageResponse>(url, language)
      .pipe(
        take(1),
        finalize(() => {
          this._isLanguageLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('LANGUAGE_UPDATED_SUCCESSFULLY');
          this.offerLanguages.set(
            this.offerLanguages().map((lang) =>
              lang.id === res.id ? res : lang
            )
          );
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_LANGUAGE');
        },
      });
  }

  deleteLanguage() {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const languageId: string = this.selectedLanguageComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/languages/${languageId}`;
    this._isLanguageLoading.set(true);
    return this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isLanguageLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('LANGUAGE_DELETED_SUCCESSFULLY');
          this.offerLanguages.set(
            this.offerLanguages().filter((lang) => lang.id !== languageId)
          );
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_DELETING_LANGUAGE');
        },
      });
  }
}
