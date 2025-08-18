import { Injectable, computed, inject, signal } from '@angular/core';
import {
  LanguageRequest,
  LanguageResponse,
} from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { CandidateService } from './candidate.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedLanguage = signal<LanguageResponse | null>(null);
  private isDialogVisible = signal<boolean>(false);
  private messageWrapper = inject(MessageWrapperService);
  private _isLanguageLoading = signal<boolean>(false);
  candidateService = inject(CandidateService);
  candidateLanguages = this.candidateService.candidateLanguages;

  readonly selectedLanguageComputed = computed(() => this.selectedLanguage());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isLanguageLoading = computed(() => this._isLanguageLoading());
  openAddDialog() {
    this.selectedLanguage.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(language: LanguageResponse) {
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

  setSelectedLanguage(language: LanguageResponse) {
    this.selectedLanguage.set(language);
  }

  addLanguage(language: LanguageRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/languages`;
    this._isLanguageLoading.set(true);
    return this.http
      .post<LanguageResponse>(url, language)
      .pipe(
        take(1),
        finalize(() => {
          this._isLanguageLoading.set(false);
          this.closeDialog();
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('LANGUAGE_ADDED_SUCCESSFULLY');
          this.candidateLanguages.set([...this.candidateLanguages(), res]);
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_ADDING_LANGUAGE');
        },
      });
  }

  updateLanguage(language: LanguageRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;

    const languageId: string = this.selectedLanguageComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/languages/${languageId}`;
    this._isLanguageLoading.set(true);
    return this.http
      .put<LanguageResponse>(url, language)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isLanguageLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('LANGUAGE_UPDATED_SUCCESSFULLY');
          this.candidateLanguages.set(
            this.candidateLanguages().map((lang) =>
              lang.id === res.id ? res : lang
            )
          );
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_LANGUAGE');
        },
      });
  }

  deleteLanguage() {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const languageId: string = this.selectedLanguageComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/languages/${languageId}`;
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
        next: () => {
          this.messageWrapper.success('LANGUAGE_DELETED_SUCCESSFULLY');
          this.candidateLanguages.set(
            this.candidateLanguages().filter((lang) => lang.id !== languageId)
          );
        },
      });
  }
}
