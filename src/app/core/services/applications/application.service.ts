import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ApplicationResponse,
  ApplicationSearchRequest,
  UpdateApplicationStatusRequest,
  TransitionCommentRequest,
  ApplicationStatusEnum,
  ApplicationCommentAction,
  ApplicationHistoryRecord,
} from '../../models/application.models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { APPLICATION_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { OfferService } from '../offer/offer.service';
import { AppSettingsService } from '../app-settings.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly baseUrl = environment.domain + APPLICATION_SERVICE_DOMAIN;

  private applicationsSignal = signal<PaginatedResponse<ApplicationResponse>>({
    data: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  });
  private _applicationHistoryRecordsSignal = signal<ApplicationHistoryRecord[]>(
    []
  );
  private _applicationDetails = signal<ApplicationResponse | null>(null);

  private _isApplicationsLoading = signal<boolean>(false);
  private _isApplicationLoading = signal<boolean>(false);
  private _isApplicationHistoryRecordListLoading = signal<boolean>(false);
  private _isApplicationCommentDialogVisible = signal<boolean>(false);
  private _isApplicationHistoryRecordListDialogVisible = signal<boolean>(false);
  private _applicationCommentAction = signal<ApplicationCommentAction | null>(
    null
  );
  readonly applicationDetails = computed(() => this._applicationDetails());
  readonly isApplicationHistoryRecordListLoading = computed(() =>
    this._isApplicationHistoryRecordListLoading()
  );
  readonly applicationHistoryRecords = computed(() =>
    this._applicationHistoryRecordsSignal()
  );
  private _applicationId = signal<string | null>(null);
  readonly isApplicationsLoading = computed(() =>
    this._isApplicationsLoading()
  );
  readonly isApplicationLoading = computed(() => this._isApplicationLoading());
  readonly applicationId = computed(() => this._applicationId());
  readonly isApplicationCommentDialogVisible = computed(() =>
    this._isApplicationCommentDialogVisible()
  );
  readonly applicationCommentAction = computed(() =>
    this._applicationCommentAction()
  );
  readonly isApplicationHistoryRecordListDialogVisible = computed(() =>
    this._isApplicationHistoryRecordListDialogVisible()
  );
  setIsApplicationCommentDialogVisible(value: boolean) {
    this._isApplicationCommentDialogVisible.set(value);
  }
  openApplicationHistoryRecordListDialog(applicationId: string) {
    this._isApplicationHistoryRecordListDialogVisible.set(true);
    this._applicationId.set(applicationId);
  }
  setIsApplicationHistoryRecordListDialogVisible(value: boolean) {
    this._isApplicationHistoryRecordListDialogVisible.set(value);
  }
  closeApplicationHistoryRecordListDialog() {
    this._isApplicationHistoryRecordListDialogVisible.set(false);
    this._applicationId.set(null);
  }
  setApplicationId(applicationId: string) {
    this._applicationId.set(applicationId);
  }
  closeApplicationCommentDialog() {
    this._isApplicationCommentDialogVisible.set(false);
    this._applicationCommentAction.set(null);
  }
  openApplicationCommentDialog(action: ApplicationCommentAction) {
    this._applicationCommentAction.set(action);
    this._isApplicationCommentDialogVisible.set(true);
  }
  private http = inject(HttpClient);
  private appSettingsService = inject(AppSettingsService);
  private messageWrapper = inject(MessageWrapperService);
  private offerService = inject(OfferService);
  private router = inject(Router);
  createApplication(
    candidateId: string,
    profileId: string,
    sendEmail: boolean = false
  ) {
    const jobOfferId = this.offerService.offerDetails()?.id;
    const companyId = this.offerService.offerDetails()?.company.id;
    const url = `${this.baseUrl}/companies/${companyId}/offers/${jobOfferId}/candidates/${candidateId}/profiles/${profileId}?sendEmail=${sendEmail}`;
    this._isApplicationLoading.set(true);
    this.http
      .post<ApplicationResponse>(url, {})
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('APPLICATION_CREATED_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_CREATED_FAILED');
        },
      });
  }

  // Delete application
  deleteApplication(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}`;

    this._isApplicationLoading.set(true);
    this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('APPLICATION_DELETED_SUCCESSFULLY');
          this.applicationsSignal.update(
            (applications: PaginatedResponse<ApplicationResponse>) => ({
              ...applications,
              data: applications.data.filter((app) => app.id !== applicationId),
              totalItems: applications.totalItems - 1,
            })
          );
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_DELETED_FAILED');
        },
      });
  }

  // Get application by ID
  getApplicationById(applicationId: string) {
    this._applicationDetails.set(null);
    const url = `${this.baseUrl}/${applicationId}`;

    this._isApplicationLoading.set(true);
    this.http
      .get<ApplicationResponse>(url)
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: (response: ApplicationResponse) => {
          this._applicationDetails.set(response);
        },
        error: () => {
          this.router.navigate(
            ['/applications/' + applicationId + '/not-found'],
            {
              state: { message: 'APPLICATION_NOT_FOUND' },
            }
          );
        },
      });
  }

  getApplicationByIdPublic(applicationId: string) {
    this._applicationDetails.set(null);
    const url = `${this.baseUrl}/${applicationId}/public`;

    this._isApplicationLoading.set(true);
    this.http
      .get<ApplicationResponse>(url)
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._applicationDetails.set(response);
        },
        error: (error) => {
          this.router.navigate(
            ['/applications/' + applicationId + '/not-found'],
            {
              state: { message: 'APPLICATION_NOT_FOUND' },
            }
          );
        },
      });
  }
  // Get applications by job offer ID with filters
  getApplicationsByJobOfferId(
    jobOfferId: string,
    filters?: ApplicationSearchRequest
  ) {
    this.applicationsSignal.set({
      data: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    });
    const url = `${this.baseUrl}/offers/${jobOfferId}`;
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isApplicationsLoading.set(true);
    this.http
      .get<PaginatedResponse<ApplicationResponse>>(url, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isApplicationsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.applicationsSignal.set(response);
        },
        error: (error) => {},
      });
  }
  getApplicationsByValidator(filters?: ApplicationSearchRequest) {
    const url = `${this.baseUrl}/validator`;
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isApplicationsLoading.set(true);
    this.http
      .get<PaginatedResponse<ApplicationResponse>>(url, { params })
      .pipe(
        take(1),
        finalize(() => this._isApplicationsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.applicationsSignal.set(response);
        },
        error: (error) => {},
      });
  }
  getApplicationHistoryRecords(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}/status-history`;
    this._isApplicationHistoryRecordListLoading.set(true);
    this.http
      .get<ApplicationHistoryRecord[]>(url)
      .pipe(
        take(1),
        finalize(() => this._isApplicationHistoryRecordListLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._applicationHistoryRecordsSignal.set(response);
        },
        error: (error) => {},
      });
  }

  getApplicationsByCandidateId(
    candidateId: string,
    filters?: ApplicationSearchRequest
  ) {
    this.applicationsSignal.set({
      data: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    });
    const url = `${this.baseUrl}/candidates/${candidateId}`;
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isApplicationsLoading.set(true);
    this.http
      .get<PaginatedResponse<ApplicationResponse>>(url, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isApplicationsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.applicationsSignal.set(response);
        },
        error: (error) => {},
      });
  }

  getAllClientPushedApplications(filters?: ApplicationSearchRequest) {
    this.applicationsSignal.set({
      data: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    });
    const url = `${this.baseUrl}/pushed-to-client`;
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isApplicationsLoading.set(true);
    this.http
      .get<PaginatedResponse<ApplicationResponse>>(url, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isApplicationsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.applicationsSignal.set(response);
        },
        error: (error) => {},
      });
  }

  getClientPushedApplicationsByJobOfferId(
    jobOfferId: string,
    filters?: ApplicationSearchRequest
  ) {
    this.applicationsSignal.set({
      data: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    });
    const url = `${this.baseUrl}/offers/${jobOfferId}/pushed-to-client`;
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isApplicationsLoading.set(true);
    this.http
      .get<PaginatedResponse<ApplicationResponse>>(url, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => this._isApplicationsLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.applicationsSignal.set(response);
        },
        error: (error) => {},
      });
  }

  // Update application status
  updateApplicationStatus(
    applicationId: string,
    request: UpdateApplicationStatusRequest
  ) {
    const url = `${this.baseUrl}/${applicationId}/status`;

    this._isApplicationLoading.set(true);
    this.http
      .patch<void>(url, request)
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success(
            'APPLICATION_STATUS_UPDATED_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.messageWrapper.error('APPLICATION_STATUS_UPDATED_FAILED');
        },
      });
  }

  // Transition methods
  pushToHr(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/push-to-hr`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.SUBMITTED_TO_HR }
                : app
            ),
          }));
          this.messageWrapper.success('APPLICATION_PUSHED_TO_HR_SUCCESSFULLY');
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_PUSHED_TO_HR_FAILED');
        },
      });
  }

  pushToValidator(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/push-to-validator`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.PUSHED_TO_VALIDATOR }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_PUSHED_TO_VALIDATOR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_PUSHED_TO_VALIDATOR_FAILED');
        },
      });
  }

  rejectByHr(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/reject-by-hr`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.REJECTED_BY_HR }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_REJECTED_BY_HR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_REJECTED_BY_HR_FAILED');
        },
      });
  }

  cancelByHr(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/cancel-by-hr`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.CANCELLED_BY_HR }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_CANCELLED_BY_HR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_CANCELLED_BY_HR_FAILED');
        },
      });
  }

  invalidateByHr(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/invalidate-by-hr`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.INVALIDATED_BY_HR }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_INVALIDATED_BY_HR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_INVALIDATED_BY_HR_FAILED');
        },
      });
  }

  cancelByRecruiter(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/cancel-by-recruiter`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.CANCELLED_BY_RECRUITER,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_CANCELLED_BY_RECRUITER_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error(
            'APPLICATION_CANCELLED_BY_RECRUITER_FAILED'
          );
        },
      });
  }

  withdrawByCandidateStaff(
    applicationId: string,
    request: TransitionCommentRequest
  ) {
    const url = `${this.baseUrl}/${applicationId}/withdraw-by-candidate-staff`;
    this._isApplicationLoading.set(true);
    this.appSettingsService.setGlobalLoading(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.WITHDRAWN_BY_CANDIDATE,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_WITHDRAWN_BY_CANDIDATE_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error(
            'APPLICATION_WITHDRAWN_BY_CANDIDATE_FAILED'
          );
        },
      });
  }

  acceptByValidator(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/accept-by-validator`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          if (this.applicationDetails() != null) {
            this._applicationDetails.set({
              ...this.applicationDetails()!,
              status: ApplicationStatusEnum.ACCEPTED_BY_VALIDATOR,
            });
          }
          if (this.applicationsSignal().data.length > 0) {
            this.applicationsSignal.update((applications) => ({
              ...applications,
              data: applications.data.map((app) =>
                app.id === applicationId
                  ? {
                      ...app,
                      status: ApplicationStatusEnum.ACCEPTED_BY_VALIDATOR,
                    }
                  : app
              ),
            }));
          }

          this.messageWrapper.success(
            'APPLICATION_ACCEPTED_BY_VALIDATOR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_ACCEPTED_BY_VALIDATOR_FAILED');
        },
      });
  }

  rejectByValidator(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/reject-by-validator`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.REJECTED_BY_VALIDATOR,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_REJECTED_BY_VALIDATOR_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_REJECTED_BY_VALIDATOR_FAILED');
        },
      });
  }

  pushToClient(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/push-to-client`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? { ...app, status: ApplicationStatusEnum.PUSHED_TO_CLIENT }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_PUSHED_TO_CLIENT_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_PUSHED_TO_CLIENT_FAILED');
        },
      });
  }

  unpushApplication(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/unpush`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.UNPUSHED_BY_CLIENT,
                  }
                : app
            ),
          }));
          this.messageWrapper.success('APPLICATION_UNPUSHED_SUCCESSFULLY');
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_UNPUSHED_FAILED');
        },
      });
  }

  rejectByClient(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/reject-by-client`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this._applicationDetails.update((applications) => ({
            ...this.applicationDetails()!,
            status: ApplicationStatusEnum.REJECTED_BY_CLIENT,
          }));
          this.messageWrapper.success(
            'APPLICATION_REJECTED_BY_CLIENT_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_REJECTED_BY_CLIENT_FAILED');
        },
      });
  }

  invalidateByClient(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/invalidate-by-client`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.INVALIDATED_BY_CLIENT,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_INVALIDATED_BY_CLIENT_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_INVALIDATED_BY_CLIENT_FAILED');
        },
      });
  }

  validateByClient(applicationId: string, request: TransitionCommentRequest) {
    const url = `${this.baseUrl}/${applicationId}/validate-by-client`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, request)
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this._applicationDetails.update((applications) => ({
            ...this.applicationDetails()!,
            status: ApplicationStatusEnum.VALIDATED_BY_CLIENT,
          }));
          this.messageWrapper.success(
            'APPLICATION_VALIDATED_BY_CLIENT_SUCCESSFULLY'
          );
          this.closeApplicationCommentDialog();
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_VALIDATED_BY_CLIENT_FAILED');
        },
      });
  }

  shareApplicationProfileWithClient(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}/share-with-client`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, {})
      .pipe(
        take(1),
        finalize(() => {
          this._isApplicationLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success(
            'APPLICATION_SHARED_WITH_CLIENT_SUCCESSFULLY'
          );
        },
        error: () => {
          this.messageWrapper.error('APPLICATION_SHARED_WITH_CLIENT_FAILED');
        },
      });
  }

  // Candidate actions (no authentication required)
  withdrawByCandidate(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}/candidate/withdraw`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, {})
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.WITHDRAWN_BY_CANDIDATE,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_WITHDRAWN_BY_CANDIDATE_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.handleCandidateActionError(
            error,
            'APPLICATION_WITHDRAWN_BY_CANDIDATE_FAILED'
          );
        },
      });
  }

  interestedByCandidate(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}/candidate/interested`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, {})
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status: ApplicationStatusEnum.INTERESTED_BY_CANDIDATE,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_INTERESTED_BY_CANDIDATE_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.handleCandidateActionError(
            error,
            'APPLICATION_INTERESTED_BY_CANDIDATE_FAILED'
          );
        },
      });
  }

  moreInfoRequestedByCandidate(applicationId: string) {
    const url = `${this.baseUrl}/${applicationId}/candidate/more-info`;
    this._isApplicationLoading.set(true);
    this.http
      .put<void>(url, {})
      .pipe(
        take(1),
        finalize(() => this._isApplicationLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.applicationsSignal.update((applications) => ({
            ...applications,
            data: applications.data.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    status:
                      ApplicationStatusEnum.MORE_INFO_REQUESTED_BY_CANDIDATE,
                  }
                : app
            ),
          }));
          this.messageWrapper.success(
            'APPLICATION_MORE_INFO_REQUESTED_BY_CANDIDATE_SUCCESSFULLY'
          );
        },
        error: (error) => {
          this.handleCandidateActionError(
            error,
            'APPLICATION_MORE_INFO_REQUESTED_BY_CANDIDATE_FAILED'
          );
        },
      });
  }

  private handleCandidateActionError(error: any, defaultMessageKey: string) {
    if (error.error && error.error.message) {
      const message = error.error.message;

      if (message.includes('Action window has expired')) {
        this.messageWrapper.error('ACTION_WINDOW_EXPIRED');
      } else if (
        message.includes('Application cannot be withdrawn from final status')
      ) {
        this.messageWrapper.error(
          'APPLICATION_CANNOT_BE_WITHDRAWN_FROM_FINAL_STATUS'
        );
      } else if (
        message.includes(
          'Application cannot be marked as interested from status'
        )
      ) {
        this.messageWrapper.error(
          'APPLICATION_CANNOT_BE_MARKED_INTERESTED_FROM_STATUS'
        );
      } else if (
        message.includes('Application cannot request more info from status')
      ) {
        this.messageWrapper.error(
          'APPLICATION_CANNOT_REQUEST_MORE_INFO_FROM_STATUS'
        );
      } else if (
        message.includes('Application not found') ||
        message.includes('application not found')
      ) {
        this.messageWrapper.error('APPLICATION_NOT_FOUND');
      } else {
        // Use the error message directly if no specific match
        this.messageWrapper.error(defaultMessageKey);
      }
    } else {
      // Fallback to default message
      this.messageWrapper.error(defaultMessageKey);
    }
  }

  // Signal getter
  get applications() {
    return this.applicationsSignal.asReadonly();
  }
}
