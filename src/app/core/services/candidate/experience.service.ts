import { Injectable, signal, computed, inject } from '@angular/core';
import {
  ExperienceRequest,
  ExperienceResponse,
} from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take, finalize } from 'rxjs';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { CandidateService } from './candidate.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedExperience = signal<ExperienceResponse | null>(null);
  private isDialogVisible = signal(false);
  private _isExperienceLoading = signal<boolean>(false);

  selectedExperienceComputed = computed(() => this.selectedExperience());
  isDialogVisibleComputed = computed(() => this.isDialogVisible());
  isExperienceLoading = computed(() => this._isExperienceLoading());
  messageWrapper = inject(MessageWrapperService);
  candidateService = inject(CandidateService);

  experiences = this.candidateService.candidateExperiences;

  openAddDialog(): void {
    this.selectedExperience.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(experience: ExperienceResponse): void {
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

  setSelectedExperience(experience: ExperienceResponse) {
    this.selectedExperience.set(experience);
  }

  addExperience(experience: ExperienceRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/experiences`;
    this._isExperienceLoading.set(true);
    this.http
      .post<ExperienceResponse>(url, experience)
      .pipe(
        take(1),
        finalize(() => {
          this._isExperienceLoading.set(false);
          this.closeDialog();
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EXPERIENCE_ADDED_SUCCESSFULLY');
          this.experiences.set([...this.experiences(), res]);
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_ADDING_EXPERIENCE');
        },
      });
  }

  updateExperience(experience: ExperienceRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const experienceId: string = this.selectedExperienceComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/experiences/${experienceId}`;
    this._isExperienceLoading.set(true);
    this.http
      .put<ExperienceResponse>(url, experience)
      .pipe(
        take(1),
        finalize(() => {
          this._isExperienceLoading.set(false);
          this.closeDialog();
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('EXPERIENCE_UPDATED_SUCCESSFULLY');
          this.experiences.set(
            this.experiences().map((exp) => (exp.id === res.id ? res : exp))
          );
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_EXPERIENCE');
        },
      });
  }
  deleteExperience() {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const experienceId: string = this.selectedExperienceComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/experiences/${experienceId}`;
    this._isExperienceLoading.set(true);
    this.http
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
          this.experiences.set(
            this.experiences().filter((exp) => exp.id !== experienceId)
          );
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_DELETING_EXPERIENCE');
        },
      });
  }
}
