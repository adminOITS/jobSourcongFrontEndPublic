import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import {
  CompanyRequest,
  CompanyResponse,
  CompanySearchRequest,
} from '../../models/company.models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { environment } from '../../../../environments/environment';
import { COMPANY_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { Router } from '@angular/router';
import {
  AttachmentRequest,
  AttachmentType,
  AttachmentUploadResponse,
  ContentType,
  EntityType,
  UploadRequest,
} from '../../models/attachment.models';
import { AttachmentService } from '../attachment/attachment.service';
import { detectContentType } from '../../utils';
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = environment.domain + COMPANY_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private router = inject(Router);
  private attachmentService = inject(AttachmentService);

  private companiesSignal = signal<PaginatedResponse<CompanyResponse>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  private companySignal = signal<CompanyResponse | null>(null);
  private _isCompanyLoading = signal<boolean>(false);
  private _isCompanyAddDialogVisible = signal<boolean>(false);
  private _isCompanyEditDialogVisible = signal<boolean>(false);
  private _isCompanyLogoDialogVisible = signal<boolean>(false);
  private _isCompanyActionLoading = signal<boolean>(false);
  readonly companies = computed(() => this.companiesSignal());
  readonly companyDetails = computed(() => this.companySignal());
  readonly isCompanyLoading = computed(() => this._isCompanyLoading());
  readonly isCompanyAddDialogVisible = computed(() =>
    this._isCompanyAddDialogVisible()
  );
  readonly isCompanyLogoDialogVisible = computed(() =>
    this._isCompanyLogoDialogVisible()
  );
  readonly isCompanyEditDialogVisible = computed(() =>
    this._isCompanyEditDialogVisible()
  );
  readonly isCompanyActionLoading = computed(() =>
    this._isCompanyActionLoading()
  );
  isCompaniesLoading = signal<boolean>(false);

  setIsCompanyAddDialogVisible(visible: boolean) {
    this._isCompanyAddDialogVisible.set(visible);
  }
  openAddCompanyDialog() {
    this._isCompanyAddDialogVisible.set(true);
  }

  closeAddCompanyDialog() {
    this._isCompanyAddDialogVisible.set(false);
  }
  setIsCompanyLogoDialogVisible(visible: boolean) {
    this._isCompanyLogoDialogVisible.set(visible);
  }
  openLogoCompanyDialog() {
    this._isCompanyLogoDialogVisible.set(true);
  }

  closeLogoCompanyDialog() {
    this._isCompanyLogoDialogVisible.set(false);
  }

  setIsCompanyEditDialogVisible(visible: boolean) {
    this._isCompanyEditDialogVisible.set(visible);
  }
  openEditCompanyDialog() {
    this._isCompanyEditDialogVisible.set(true);
  }

  closeEditCompanyDialog() {
    this._isCompanyEditDialogVisible.set(false);
  }
  emptyCompanies() {
    this.companiesSignal.set({
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      data: [],
    });
  }

  getAllCompanies(filters?: CompanySearchRequest) {
    this.emptyCompanies();
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this.isCompaniesLoading.set(true);
    this.http
      .get<PaginatedResponse<CompanyResponse>>(`${this.baseUrl}`, {
        params,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isCompaniesLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.companiesSignal.set(response);
        },
      });
  }

  getCompanyById(id: string) {
    this._isCompanyLoading.set(true);
    this.http
      .get<CompanyResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        take(1),
        finalize(() => {
          this._isCompanyLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.companySignal.set(response);
        },
        error: (error) => {
          this.router.navigate(['/company/' + id + '/not-found'], {
            state: { message: 'COMPANY_NOT_FOUND' },
          });
        },
      });
  }

  createCompany(company: CompanyRequest, file?: File) {
    this._isCompanyLoading.set(true);

    this.http
      .post<CompanyResponse>(this.baseUrl, company)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const logoUpload = response.logoUploadResponse;
          const companyId = response.id;

          if (file && logoUpload?.url && logoUpload?.key) {
            this.attachmentService
              .uploadFileToS3(logoUpload.url, file)
              .subscribe({
                next: () => {
                  const attachment: AttachmentRequest = {
                    fileName: file.name,
                    contentType: detectContentType(file),
                    size: `${Math.round(file.size / 1024)}KB`,
                    key: logoUpload.key,
                    entityType: EntityType.COMPANY,
                    entityId: companyId,
                  };

                  this.attachmentService
                    .addCompanyLogoMetaData(attachment)
                    .pipe(
                      finalize(() => {
                        this._isCompanyLoading.set(false);
                      })
                    )
                    .subscribe({
                      next: (res) => {
                        response.logoAttachment = {
                          attachmentType: res.attachmentType,
                          url: res.url,
                          contentType: res.contentType,
                        };
                        this.messageWrapper.success(
                          'COMPANY_CREATED_SUCCESSFULLY'
                        );
                        this.handleSuccess(response);
                      },
                      error: () => {
                        this.messageWrapper.success(
                          'COMPANY_CREATED_SUCCESSFULLY'
                        );
                        this.messageWrapper.warning('LOGO_UPLOAD_FAILED');
                        this._isCompanyLoading.set(false);
                        this.closeAddCompanyDialog();
                      },
                    });
                },
                error: () => {
                  this.messageWrapper.success('COMPANY_CREATED_SUCCESSFULLY');

                  this.messageWrapper.warning('LOGO_UPLOAD_FAILED');
                  this._isCompanyLoading.set(false);
                  this.closeAddCompanyDialog();
                },
              });
          } else {
            this.messageWrapper.success('COMPANY_CREATED_SUCCESSFULLY');
            this.handleSuccess(response);
          }
        },
        error: () => {
          this._isCompanyLoading.set(false);
          this.messageWrapper.error('COMPANY_CREATION_FAILED');
        },
      });
  }
  handleSuccess(response: CompanyResponse) {
    this._isCompanyLoading.set(false);
    this.closeAddCompanyDialog();
    this.companiesSignal.update((prev) => ({
      ...prev,
      data: [...prev.data, response],
    }));
  }
  updateCompany(id: string, company: CompanyRequest) {
    this._isCompanyActionLoading.set(true);
    this.http
      .put<CompanyResponse>(`${this.baseUrl}/${id}`, company)
      .pipe(
        take(1),
        finalize(() => {
          this._isCompanyActionLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.closeEditCompanyDialog();
          this.companySignal.update((prev) => {
            if (prev) {
              return {
                ...prev,
                ...response,
                logoAttachment: prev.logoAttachment,
              };
            }
            return response;
          });
          this.messageWrapper.success('COMPANY_UPDATED_SUCCESSFULLY');
        },
        error: (error) => {
          this.messageWrapper.error('COMPANY_UPDATE_FAILED');
        },
      });
  }

  deleteCompany(id: string) {
    this._isCompanyLoading.set(true);
    this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        take(1),
        finalize(() => {
          this._isCompanyLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('COMPANY_DELETED_SUCCESSFULLY');

          this.companiesSignal.update((prev) => ({
            ...prev,
            data: prev.data.filter((company) => company.id !== id),
            totalItems: prev.totalItems - 1,
          }));
        },
        error: (error) => {
          this.messageWrapper.error('COMPANY_DELETION_FAILED');
        },
      });
  }

  updateCompanyLogo(companyId: string, file: File) {
    this._isCompanyActionLoading.set(true);
    const uploadRequest: UploadRequest = {
      contentType: detectContentType(file),
    };
    this.http
      .put<AttachmentUploadResponse>(
        `${this.baseUrl}/${companyId}/logo`,
        uploadRequest
      )
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.attachmentService
            .uploadFileToS3(response.url, file)
            .pipe(take(1))
            .subscribe({
              next: () => {
                const attachment: AttachmentRequest = {
                  fileName: file.name,
                  contentType: detectContentType(file),
                  size: `${Math.round(file.size / 1024)}KB`,
                  key: response.key,
                  entityType: EntityType.COMPANY,
                  entityId: companyId,
                };
                this.attachmentService
                  .updateCompanyLogoMetaData(attachment)
                  .pipe(take(1))
                  .subscribe({
                    next: (res) => {
                      this.companySignal.update((prev) => {
                        return {
                          ...prev!,
                          logoAttachment: {
                            attachmentType: res.attachmentType,
                            url: res.url,
                            contentType: res.contentType,
                          },
                        };
                      });
                      const now = Date.now();
                      this.companySignal.set({
                        ...this.companySignal()!,
                        logoAttachment: {
                          attachmentType: res.attachmentType,
                          url: res.url + '?t=' + now,
                          contentType: res.contentType,
                        },
                      });
                      this.closeLogoCompanyDialog();
                      this._isCompanyActionLoading.set(false);

                      this.messageWrapper.success(
                        'COMPANY_LOGO_UPDATED_SUCCESSFULLY'
                      );
                    },
                    error: () => {
                      this._isCompanyActionLoading.set(false);

                      this.messageWrapper.error('COMPANY_LOGO_UPDATE_FAILED');
                    },
                  });
              },
              error: () => {
                this._isCompanyActionLoading.set(false);

                this.messageWrapper.error('COMPANY_LOGO_UPDATE_FAILED');
              },
            });
        },
      });
  }
}
