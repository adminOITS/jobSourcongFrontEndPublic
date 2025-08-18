import { inject, Injectable, computed, signal } from '@angular/core';
import {
  InterviewRequest,
  InterviewResponse,
  InterviewSearchRequest,
  UpdateInterviewStatusRequest,
} from '../../models/interview.models';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take, finalize } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { INTERVIEW_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private readonly baseUrl = environment.domain + INTERVIEW_SERVICE_DOMAIN;
  private selectedInterview = signal<InterviewResponse | null>(null);
  private selectedApplication = signal<string | null>(null);
  private _interviews = signal<PaginatedResponse<InterviewResponse>>({
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  });
  private isDialogVisible = signal<boolean>(false);
  private _isInterviewsLoading = signal<boolean>(false);
  private _selectedInterviewLoading = signal<boolean>(false);
  private _isInterviewActionLoading = signal<boolean>(false);

  readonly interviews = computed(() => this._interviews());

  readonly selectedInterviewComputed = computed(() => this.selectedInterview());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly selectedApplicationComputed = computed(() =>
    this.selectedApplication()
  );
  readonly isInterviewsLoading = computed(() => this._isInterviewsLoading());
  readonly selectedInterviewLoading = computed(() =>
    this._selectedInterviewLoading()
  );
  readonly isInterviewActionLoading = computed(() =>
    this._isInterviewActionLoading()
  );

  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);

  openAddDialog(applicationId: string) {
    this.selectedInterview.set(null);
    this.selectedApplication.set(applicationId);
    this.isDialogVisible.set(true);
  }

  openEditDialog(interview: InterviewResponse) {
    this.selectedInterview.set(interview);
    this.isDialogVisible.set(true);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  closeDialog() {
    this.isDialogVisible.set(false);
    this.selectedInterview.set(null);
  }

  getInterviewsByApplicationId(applicationId: string) {
    const url = `${this.baseUrl}/application/${applicationId}`;
    this._isInterviewsLoading.set(true);
    return this.http
      .get<PaginatedResponse<InterviewResponse>>(url)
      .pipe(
        take(1),
        finalize(() => this._isInterviewsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.set(response);
        },
        error: (error) => {},
      });
  }
  getInterviews(filters?: InterviewSearchRequest) {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }
    this._isInterviewsLoading.set(true);
    this.http
      .get<PaginatedResponse<InterviewResponse>>(`${this.baseUrl}`, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isInterviewsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.set(response);
        },
        error: (error) => {},
      });
  }
  getInterviewById(interviewId: string) {
    const url = `${this.baseUrl}/${interviewId}`;
    this._selectedInterviewLoading.set(true);
    this.http
      .get<InterviewResponse>(url)
      .pipe(
        take(1),
        finalize(() => this._selectedInterviewLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.selectedInterview.set(response);
        },
        error: (error) => {},
      });
  }
  updateInterviewStatus(
    interviewId: string,
    status: UpdateInterviewStatusRequest
  ) {
    const url = `${this.baseUrl}/${interviewId}/status`;
    this._selectedInterviewLoading.set(true);
    this.http
      .put<InterviewResponse>(url, status)
      .pipe(
        take(1),
        finalize(() => this._selectedInterviewLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.update((prev) => ({
            ...prev,
            data: prev.data.map((interview) =>
              interview.id === interviewId ? response : interview
            ),
          }));
          this.messageWrapper.success('INTERVIEW_STATUS_UPDATED_SUCCESSFULLY');
        },
        error: (error) => {
          this.messageWrapper.error('INTERVIEW_STATUS_UPDATED_FAILED');
        },
      });
  }

  createInterview(interview: InterviewRequest) {
    const applicationId = this.selectedApplication();
    const url = `${this.baseUrl}/applications/${applicationId}`;
    this._selectedInterviewLoading.set(true);
    this.http
      .post<InterviewResponse>(url, interview)
      .pipe(
        take(1),
        finalize(() => this._selectedInterviewLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success('INTERVIEW_CREATED_SUCCESSFULLY');
          this.closeDialog();
        },
        error: (error) => {
          this.messageWrapper.error('INTERVIEW_CREATED_FAILED');
        },
      });
  }
  getInterviewsByOfferId(offerId: string, filters?: InterviewSearchRequest) {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }
    const url = `${this.baseUrl}/offers/${offerId}`;
    this._isInterviewsLoading.set(true);
    this.http
      .get<PaginatedResponse<InterviewResponse>>(url, { params })
      .pipe(
        take(1),
        finalize(() => this._isInterviewsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.set(response);
        },
        error: (error) => {},
      });
  }
  getInterviewByCandidateId(
    candidateId: string,
    filters?: InterviewSearchRequest
  ) {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }
    const url = `${this.baseUrl}/candidates/${candidateId}`;
    this._isInterviewsLoading.set(true);
    this.http
      .get<PaginatedResponse<InterviewResponse>>(url, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isInterviewsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.set(response);
        },
        error: (error) => {},
      });
  }

  updateInterview(interviewId: string, interview: InterviewRequest) {
    const url = `${this.baseUrl}/${interviewId}`;
    this._selectedInterviewLoading.set(true);
    this.http
      .put<InterviewResponse>(url, interview)
      .pipe(
        take(1),
        finalize(() => this._selectedInterviewLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.update((prev) => ({
            ...prev,
            data: prev.data.map((interview) =>
              interview.id === interviewId ? response : interview
            ),
          }));
          this.messageWrapper.success('INTERVIEW_UPDATED_SUCCESSFULLY');
          this.closeDialog();
        },
        error: (error) => {
          this.messageWrapper.error('INTERVIEW_UPDATED_FAILED');
        },
      });
  }

  deleteInterview(interviewId: string) {
    const url = `${this.baseUrl}/${interviewId}`;
    this._selectedInterviewLoading.set(true);
    this.http
      .delete<InterviewResponse>(url)
      .pipe(
        take(1),
        finalize(() => this._selectedInterviewLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._interviews.update((prev) => ({
            ...prev,
            data: prev.data.filter((interview) => interview.id !== interviewId),
            totalItems: prev.totalItems - 1,
          }));
          this.messageWrapper.success('INTERVIEW_DELETED_SUCCESSFULLY');
        },
        error: (error) => {
          this.messageWrapper.error('INTERVIEW_DELETED_FAILED');
        },
      });
  }
}
