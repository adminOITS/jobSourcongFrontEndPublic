import { Injectable, computed, inject, signal } from '@angular/core';
import {
  EducationRequest,
  EducationResponse,
} from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { take, finalize, tap } from 'rxjs';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { CandidateService } from './candidate.service';
@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  // State signals
  private selectedEducation = signal<EducationResponse | undefined>(undefined);
  private isDialogVisible = signal<boolean>(false);
  private _isEducationLoading = signal<boolean>(false);

  // Public computed values
  readonly selectedEducationComputed = computed(() => this.selectedEducation());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isEducationLoading = computed(() => this._isEducationLoading());

  messageWrapper = inject(MessageWrapperService);
  candidateService = inject(CandidateService);
  candidateEducation = this.candidateService.candidateEducation;

  setSelectedEducation(education: EducationResponse | undefined) {
    this.selectedEducation.set(education);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  // CRUD operations
  addEducation(education: EducationRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/educations`;
    this._isEducationLoading.set(true);
    return this.http
      .post<EducationResponse>(url, education)
      .pipe(
        take(1),
        finalize(() => {
          this._isEducationLoading.set(false);
        })
      )
      .subscribe({
        next: (education) => {
          this.messageWrapper.success('EDUCATION_ADDED_SUCCESSFULLY');
          this.candidateEducation.set([
            ...this.candidateEducation(),
            education,
          ]);
          this.closeDialog();
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_ADDING_EDUCATION');
        },
      });
  }

  updateEducation(education: EducationRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const educationId: string = this.selectedEducationComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/educations/${educationId}`;
    this._isEducationLoading.set(true);
    return this.http
      .put<EducationResponse>(url, education)
      .pipe(
        take(1),
        finalize(() => {
          this._isEducationLoading.set(false);
        })
      )
      .subscribe({
        next: (education) => {
          this.closeDialog();
          this.messageWrapper.success('EDUCATION_UPDATED_SUCCESSFULLY');
          this.candidateEducation.set(
            this.candidateEducation().map((edu) =>
              edu.id === education.id ? education : edu
            )
          );
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_UPDATING_EDUCATION');
        },
      });
  }

  deleteEducation() {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const educationId: string = this.selectedEducationComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/educations/${educationId}`;
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
          this.candidateEducation.set(
            this.candidateEducation().filter((edu) => edu.id !== educationId)
          );
          this.closeDialog();
        },
        error: (error) => {
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

  openEditDialog(education: EducationResponse) {
    console.log('education', education);

    this.selectedEducation.set(education);
    this.isDialogVisible.set(true);
  }

  closeDialog() {
    this.clearSelection();
  }
}
