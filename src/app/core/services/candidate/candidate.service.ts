import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  CandidateRequest,
  CandidateResponse,
  CandidateSearchRequest,
  CandidateAvailabilityStatusEnum,
  CandidateValidationStatusEnum,
} from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take, finalize } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageWrapper = inject(MessageWrapperService);
  private selectedCandidate = signal<CandidateResponse | null>(null);
  private isDialogVisible = signal<boolean>(false);
  private candidates = signal<PaginatedResponse<CandidateResponse>>({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  private _isCandidatesLoading = signal<boolean>(false);
  private _isCandidateLoading = signal<boolean>(false);
  readonly candidatesComputed = computed(() => this.candidates());
  readonly isCandidatesLoading = computed(() => this._isCandidatesLoading());
  readonly isCandidateLoading = computed(() => this._isCandidateLoading());
  readonly candidateDetails = computed(() => this.selectedCandidate());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());

  CandidatePersonalInfo = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source ?? null,
  });
  candidateExperiences = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source?.experiences ?? [],
  });
  candidateEducation = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source?.education ?? [],
  });
  candidateSkills = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source?.skills ?? [],
  });

  candidateLanguages = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source?.languages ?? [],
  });
  candidateSocialLinks = linkedSignal({
    source: () => this.selectedCandidate(),
    computation: (source) => source?.socialLinks ?? null,
  });

  openAddDialog() {
    this.CandidatePersonalInfo.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(Candidate: CandidateResponse) {
    this.CandidatePersonalInfo.set(Candidate);
    this.isDialogVisible.set(true);
  }
  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
    if (!visible) {
      this.CandidatePersonalInfo.set(null);
    }
  }

  closeDialog() {
    this.isDialogVisible.set(false);
    this.CandidatePersonalInfo.set(null);
  }

  getCandidates(filters?: CandidateSearchRequest) {
    this.emptyCandidates();
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    this._isCandidatesLoading.set(true);
    this.http
      .get<PaginatedResponse<CandidateResponse>>(`${this.baseUrl}`, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => {
          this._isCandidatesLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.candidates.set(response);
        },
      });
  }

  getCandidateById(candidateId: string) {
    this.selectedCandidate.set(null);
    this._isCandidateLoading.set(true);
    this.http
      .get<CandidateResponse>(`${this.baseUrl}/${candidateId}`)
      .pipe(
        take(1),
        finalize(() => {
          this._isCandidateLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.selectedCandidate.set(response);
        },
        error: (error) => {
          this.router.navigate(['/candidate/' + candidateId + '/not-found'], {
            state: { message: 'CANDIDATE_NOT_FOUND' },
          });
        },
      });
  }

  addCandidate(candidate: CandidateRequest) {
    this._isCandidateLoading.set(true);
    this.http
      .post<CandidateResponse>(`${this.baseUrl}`, candidate)
      .pipe(
        take(1),
        finalize(() => {
          this._isCandidateLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success('CANDIDATE_CREATED_SUCCESSFULLY');
          this.closeDialog();
          this.candidates.set({
            ...this.candidates(),
            data: [...this.candidates().data, response],
          });
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_CREATING_CANDIDATE');
        },
      });
  }

  updateCandidate(candidate: CandidateRequest) {
    if (!this.selectedCandidate()) {
      this.messageWrapper.error('CANDIDATE_NOT_FOUND');
      return;
    }
    this._isCandidateLoading.set(true);
    const candidateId = this.selectedCandidate()!.id;
    this.http
      .put<CandidateResponse>(`${this.baseUrl}/${candidateId}`, candidate)
      .pipe(
        take(1),
        finalize(() => {
          this._isCandidateLoading.set(false);
        })
      )
      .subscribe({
        next: (candidate) => {
          this.selectedCandidate.set({
            ...this.selectedCandidate()!,
            ...candidate,
          });
          this.messageWrapper.success('CANDIDATE_UPDATED_SUCCESSFULLY');
          this.closeDialog();
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_UPDATING_CANDIDATE');
        },
      });
  }

  updateCandidateAvailability(
    candidateId: string,
    availability: CandidateAvailabilityStatusEnum
  ) {
    this.http
      .put<CandidateResponse>(
        `${this.baseUrl}/${candidateId}/availability-status`,
        null,
        {
          params: { status: availability },
        }
      )
      .pipe(take(1))
      .subscribe({
        next: (candidate) => {
          this.candidates.update((prev) => ({
            ...prev,
            data: prev.data.map((c) => (c.id === candidateId ? candidate : c)),
          }));
          this.messageWrapper.success(
            'CANDIDATE_AVAILABILITY_UPDATED_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_UPDATING_CANDIDATE_AVAILABILITY');
        },
      });
  }

  updateCandidateValidationStatus(
    candidateId: string,
    validationStatus: CandidateValidationStatusEnum
  ) {
    this.http
      .put<CandidateResponse>(
        `${this.baseUrl}/${candidateId}/validation-status`,
        null,
        {
          params: { status: validationStatus },
        }
      )
      .pipe(take(1))
      .subscribe({
        next: (candidate) => {
          this.candidates.update((prev) => ({
            ...prev,
            data: prev.data.map((c) => (c.id === candidateId ? candidate : c)),
          }));
          this.messageWrapper.success(
            'CANDIDATE_VALIDATION_STATUS_UPDATED_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.messageWrapper.error(
            'ERROR_UPDATING_CANDIDATE_VALIDATION_STATUS'
          );
        },
      });
  }

  deleteCandidate(candidateId: string) {
    this.http
      .delete<void>(`${this.baseUrl}/${candidateId}`)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageWrapper.success('CANDIDATE_DELETED_SUCCESSFULLY');
          this.candidates.set({
            ...this.candidates(),
            data: this.candidates().data.filter(
              (candidate) => candidate.id !== candidateId
            ),
            totalItems: this.candidates().totalItems - 1,
          });
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_DELETING_CANDIDATE');
        },
      });
  }
  emptyCandidates() {
    this.candidates.set({
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      data: [],
    });
  }
}
