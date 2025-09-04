import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProfileResponse,
  ProfileRequest,
  ProfileFilterRequest,
  ProfileShortResponse,
} from '../../models/profile.models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { CandidateService } from './candidate.service';
import {
  AttachmentRequest,
  AttachmentUploadResponse,
  EntityType,
  UploadRequest,
} from '../../models/attachment.models';
import { AttachmentService } from '../attachment/attachment.service';
import { detectContentType } from '../../utils';
import { JobCategory } from '../../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private _profilesSignal = signal<PaginatedResponse<ProfileShortResponse>>({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  private _isProfilesLoading = signal<boolean>(false);
  private _isProfileLoading = signal<boolean>(false);
  private _isEditProfileLoading = signal<boolean>(false);
  private _isProfileResumeLoading = signal<boolean>(false);

  private _selectedProfile = signal<ProfileResponse | null>(null);
  private _isAddProfileDialogVisible = signal<boolean>(false);
  private _isEditProfileDialogVisible = signal<boolean>(false);
  private _selectedProfileShort = signal<ProfileShortResponse | null>(null);
  private _isEditProfileResumeDialogVisible = signal<boolean>(false);

  readonly profiles = computed(() => this._profilesSignal());
  readonly isProfilesLoading = computed(() => this._isProfilesLoading());
  readonly isProfileLoading = computed(() => this._isProfileLoading());
  readonly isEditProfileLoading = computed(() => this._isEditProfileLoading());
  readonly isProfileResumeLoading = computed(() =>
    this._isProfileResumeLoading()
  );
  readonly selectedProfileShort = computed(() => this._selectedProfileShort());
  readonly selectedProfile = computed(() => this._selectedProfile());
  readonly isAddProfileDialogVisible = computed(() =>
    this._isAddProfileDialogVisible()
  );
  readonly isEditProfileDialogVisible = computed(() =>
    this._isEditProfileDialogVisible()
  );
  readonly isEditProfileResumeDialogVisible = computed(() =>
    this._isEditProfileResumeDialogVisible()
  );

  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private candidateService = inject(CandidateService);
  private attachmentService = inject(AttachmentService);

  openAddProfileDialog() {
    this._isAddProfileDialogVisible.set(true);
  }
  openEditProfileDialog(selectedProfile: ProfileShortResponse) {
    this._selectedProfileShort.set(selectedProfile);
    this._isEditProfileDialogVisible.set(true);
  }

  closeProfileDialog() {
    this._isAddProfileDialogVisible.set(false);
  }
  openEditProfileResumeDialog(selectedProfile: ProfileShortResponse) {
    this._isEditProfileResumeDialogVisible.set(true);
    this._selectedProfileShort.set(selectedProfile);
  }
  closeEditProfileResumeDialog() {
    this._isEditProfileResumeDialogVisible.set(false);
  }
  closeEditProfileDialog() {
    this._isEditProfileDialogVisible.set(false);
  }
  setSelectedProfileShort(profile: ProfileShortResponse | null) {
    this._selectedProfileShort.set(profile);
  }
  setIsAddProfileDialogVisible(visible: boolean) {
    this._isAddProfileDialogVisible.set(visible);
  }
  setIsEditProfileDialogVisible(visible: boolean) {
    this._isEditProfileDialogVisible.set(visible);
  }
  setIsEditProfileResumeDialogVisible(visible: boolean) {
    this._isEditProfileResumeDialogVisible.set(visible);
  }
  setIsEditProfileLoading(loading: boolean) {
    this._isEditProfileLoading.set(loading);
  }
  setIsProfileResumeLoading(loading: boolean) {
    this._isProfileResumeLoading.set(loading);
  }
  setIsProfileLoading(loading: boolean) {
    this._isProfileLoading.set(loading);
  }

  addProfile(candidateId: string, profileRequest: ProfileRequest, file?: File) {
    this._isProfileLoading.set(true);

    this.http
      .post<ProfileShortResponse>(
        `${this.baseUrl}/${candidateId}/profiles`,
        profileRequest
      )
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const resumeUpload = response.resumeUploadResponse;
          const profileId = response.id;

          // If file is passed and resume upload data is available
          if (file && resumeUpload?.url && resumeUpload?.key) {
            this.attachmentService
              .uploadFileToS3(resumeUpload.url, file)
              .subscribe({
                next: () => {
                  const attachment: AttachmentRequest = {
                    fileName: file.name,
                    contentType: detectContentType(file),
                    size: `${Math.round(file.size / 1024)}KB`,
                    key: resumeUpload?.key,
                    entityType: EntityType.CANDIDATE,
                    entityId: profileId,
                  };

                  this.attachmentService
                    .addDocumentMetaData(attachment)
                    .pipe(
                      finalize(() => {
                        this._isProfileLoading.set(false);
                      })
                    )
                    .subscribe({
                      next: (res) => {
                        response.resumeAttachment = {
                          attachmentType: res.attachmentType,
                          url: res.url,
                          contentType: res.contentType,
                        };
                        this.handleSuccess(response);
                      },
                      error: () => {
                        this.messageWrapper.success(
                          'PROFILE_ADDED_SUCCESSFULLY'
                        );
                        this.messageWrapper.warning('RESUME_UPLOAD_FAILED');
                        this._isProfileLoading.set(false);
                        this.closeProfileDialog();
                      },
                    });
                },
                error: () => {
                  this.messageWrapper.success('PROFILE_ADDED_SUCCESSFULLY');
                  this.messageWrapper.warning('RESUME_UPLOAD_FAILED');
                  this._isProfileLoading.set(false);
                  this.closeProfileDialog();
                },
              });
          } else {
            this.messageWrapper.success('PROFILE_ADDED_SUCCESSFULLY');
            this.handleSuccess(response);
          }
        },
        error: () => {
          this._isProfileLoading.set(false);
          this.messageWrapper.error('PROFILE_ADDED_FAILED');
        },
      });
  }

  handleSuccess(response: ProfileShortResponse) {
    this._isProfileLoading.set(false);
    this.closeProfileDialog();

    this._profilesSignal.update((prev) => ({
      ...prev,
      data: [...prev.data, response],
      totalItems: prev.totalItems + 1,
    }));
  }

  updateProfile(
    candidateId: string,
    profileId: string,
    profileRequest: ProfileRequest
  ) {
    this._isProfileLoading.set(true);
    return this.http
      .put<ProfileResponse>(
        `${this.baseUrl}/${candidateId}/profiles/${profileId}`,
        profileRequest
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfileLoading.set(false);
        })
      )
      .subscribe({
        next: (profile) => {
          const category: JobCategory =
            JobCategory[
              profile.category.toUpperCase() as keyof typeof JobCategory
            ];
          this.messageWrapper.success('PROFILE_UPDATED_SUCCESSFULLY');
          this._profilesSignal.update((prev) => ({
            ...prev,
            data: prev.data.map((profile) =>
              profile.id === profileId ? { ...profile, category } : profile
            ),
          }));
          this.closeEditProfileDialog();
        },
        error: () => {
          this.messageWrapper.error('PROFILE_UPDATED_FAILED');
        },
      });
  }

  addSkillToProfile(candidateId: string, profileId: string, skillId: string) {
    this._isProfileLoading.set(true);
    return this.http
      .put<ProfileResponse>(
        `${this.baseUrl}/${candidateId}/profiles/${profileId}/skills/${skillId}`,
        {}
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfileLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('PROFILE_SKILL_ADDED_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('PROFILE_SKILL_ADDED_FAILED');
        },
      });
  }

  removeSkillFromProfile(
    candidateId: string,
    profileId: string,
    skillId: string
  ) {
    this._isProfileLoading.set(true);
    return this.http
      .delete<ProfileResponse>(
        `${this.baseUrl}/${candidateId}/profiles/${profileId}/skills/${skillId}`
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfileLoading.set(false);
        })
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.messageWrapper.error('PROFILE_SKILL_REMOVED_FAILED');
        },
      });
  }

  deleteProfile(candidateId: string, profileId: string) {
    this._isProfileLoading.set(true);
    return this.http
      .delete<void>(`${this.baseUrl}/${candidateId}/profiles/${profileId}`)
      .pipe(
        take(1),
        finalize(() => {
          this._isProfileLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('PROFILE_DELETED_SUCCESSFULLY');
          this._profilesSignal.update((profiles) => ({
            ...profiles,
            data: profiles.data.filter((profile) => profile.id !== profileId),
            totalItems: profiles.totalItems - 1,
          }));
        },
        error: () => {
          this.messageWrapper.error('PROFILE_DELETED_FAILED');
        },
      });
  }

  getProfiles(filters?: ProfileFilterRequest) {
    this.emptyProfiles();
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    this._isProfilesLoading.set(true);
    return this.http
      .get<PaginatedResponse<ProfileShortResponse>>(
        `${this.baseUrl}/profiles/all`,
        { params }
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfilesLoading.set(false);
        })
      )
      .subscribe({
        next: (profiles) => {
          this._profilesSignal.set(profiles);
        },
      });
  }

  getProfilesByCandidateId(filters?: ProfileFilterRequest) {
    this.emptyProfiles();
    const candidateId = this.candidateService.candidateDetails()?.id;
    if (!candidateId) {
      return;
    }
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    this._isProfilesLoading.set(true);
    return this.http
      .get<PaginatedResponse<ProfileShortResponse>>(
        `${this.baseUrl}/${candidateId}/profiles`,
        { params }
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfilesLoading.set(false);
        })
      )
      .subscribe({
        next: (profile) => {
          this._profilesSignal.set(profile);
        },
      });
  }

  getProfileById(profileId: string) {
    this._selectedProfile.set(null);
    const candidateId = this.candidateService.candidateDetails()?.id;

    this._isProfileLoading.set(true);
    return this.http
      .get<ProfileResponse>(
        `${this.baseUrl}/${candidateId}/profiles/${profileId}`
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isProfileLoading.set(false);
        })
      )
      .subscribe({
        next: (profile) => {
          this._selectedProfile.set(profile);
        },
        error: () => {
          this.messageWrapper.error('PROFILE_FETCH_FAILED');
        },
      });
  }

  updateProfileResume(candidateId: string, profileId: string, file: File) {
    this._isProfileLoading.set(true);
    const uploadRequest: UploadRequest = {
      contentType: detectContentType(file),
    };
    return this.http
      .put<AttachmentUploadResponse>(
        `${this.baseUrl}/${candidateId}/profiles/${profileId}/resume`,
        uploadRequest
      )
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.attachmentService.uploadFileToS3(response.url, file).subscribe({
            next: () => {
              const attachment: AttachmentRequest = {
                fileName: file.name,
                contentType: detectContentType(file),
                size: `${Math.round(file.size / 1024)}KB`,
                key: response.key,
                entityType: EntityType.CANDIDATE,
                entityId: profileId,
              };
              this.attachmentService
                .updateDocumentMetaData(attachment)
                .subscribe({
                  next: (res) => {
                    this.messageWrapper.success(
                      'PROFILE_RESUME_UPDATED_SUCCESSFULLY'
                    );
                    this.closeEditProfileResumeDialog();
                  },
                });
            },
          });
        },
        error: () => {
          this.messageWrapper.error('PROFILE_RESUME_UPDATED_FAILED');
        },
      });
  }
  emptyProfiles() {
    this._profilesSignal.set({
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      data: [],
    });
  }
}
