import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ATS_SERVICE_DOMAIN } from '../../utils/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProfileShortResponseDto,
  OfferTopMatchFilterRequest,
  PaginatedNoSqlResponse,
} from '../../models/ats.models';
import { finalize, take } from 'rxjs';
import { MessageWrapperService } from '../message-wrapper.service';
import { JobCategory } from '../../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class MatchingResultService {
  private readonly baseUrl = environment.domain + ATS_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);

  // Loading states
  private _isProfileLoading = signal<boolean>(false);
  private _isTopMatchesLoading = signal<boolean>(false);
  private _isPublishingLoading = signal<boolean>(false);

  // Data states
  private _currentProfile = signal<ProfileShortResponseDto | null>(null);
  private _topMatches = signal<PaginatedNoSqlResponse<ProfileShortResponseDto>>(
    {
      data: [],
      hasNext: false,
      limit: 10,
      totalCount: 0,
      nextKey: undefined,
      previousKey: undefined,
    }
  );

  // Computed readonly properties
  readonly isProfileLoading = computed(() => this._isProfileLoading());
  readonly isTopMatchesLoading = computed(() => this._isTopMatchesLoading());
  readonly isPublishingLoading = computed(() => this._isPublishingLoading());
  readonly currentProfile = computed(() => this._currentProfile());
  readonly topMatches = computed(() => this._topMatches());

  /**
   * Get profile by offer ID, profile ID, and candidate ID
   * GET /offers/{offerId}/candidates/{candidateId}/profiles/{profileId}
   */
  getByOfferIdAndProfileId(
    offerId: string,
    profileId: string,
    candidateId: string
  ) {
    if (!offerId || !profileId || !candidateId) {
      this.messageWrapper.error('INVALID_PARAMETERS');
      return;
    }

    this._isProfileLoading.set(true);
    return this.http
      .get<ProfileShortResponseDto>(
        `${this.baseUrl}/offers/${offerId}/candidates/${candidateId}/profiles/${profileId}`
      )
      .pipe(
        take(1),
        finalize(() => this._isProfileLoading.set(false))
      )
      .subscribe({
        next: (profile) => {
          this._currentProfile.set(profile);
        },
        error: (error) => {
          this.messageWrapper.error('FAILED_TO_LOAD_PROFILE');
        },
      });
  }

  /**
   * Get top matching profiles for an offer with advanced filtering
   * GET /offers/{offerId}
   */
  getTopByTotalMatchAdvanced(
    offerId: string,
    filters?: OfferTopMatchFilterRequest
  ) {
    if (!offerId) {
      this.messageWrapper.error('SOMETHING_WENT_WRONG');
      return;
    }

    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    this._isTopMatchesLoading.set(true);
    return this.http
      .get<PaginatedNoSqlResponse<ProfileShortResponseDto>>(
        `${this.baseUrl}/offers/${offerId}`,
        { params }
      )
      .pipe(
        take(1),
        finalize(() => this._isTopMatchesLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._topMatches.set(response);
        },
      });
  }

  /**
   * Publish profiles for an offer (async operation)
   * POST /offers/{offerId}/publish-profiles
   */
  publishProfilesForOffer(offerId: string) {
    if (!offerId) {
      this.messageWrapper.error('OFFER_ID_REQUIRED');
      return;
    }

    this._isPublishingLoading.set(true);
    return this.http
      .post<void>(`${this.baseUrl}/offers/${offerId}/publish-profiles`, {})
      .pipe(
        take(1),
        finalize(() => this._isPublishingLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success(
            'PROFILES_PUBLISH_INITIATED_PLEASE_WAIT_FOR_COMPLETION'
          );
        },
        error: (error) => {
          this.messageWrapper.error('FAILED_TO_PUBLISH_PROFILES');
        },
      });
  }

  /**
   * Load more profiles (pagination for NoSQL)
   */
  loadMoreTopMatches(offerId: string) {
    const currentMatches = this._topMatches();
    if (!currentMatches.hasNext || !currentMatches.nextKey) {
      return;
    }

    const filters: OfferTopMatchFilterRequest = {
      profileKey: currentMatches.nextKey.profileId,
      scoreKey: currentMatches.nextKey.score.toString(),
      limit: currentMatches.limit,
    };

    this._isTopMatchesLoading.set(true);
    return this.http
      .get<PaginatedNoSqlResponse<ProfileShortResponseDto>>(
        `${this.baseUrl}/offers/${offerId}`,
        {
          params: this.buildHttpParams(filters),
        }
      )
      .pipe(
        take(1),
        finalize(() => this._isTopMatchesLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          // Append new data to existing data
          const updatedResponse = {
            ...response,
            data: [...currentMatches.data, ...response.data],
          };
          this._topMatches.set(updatedResponse);
        },
      });
  }

  /**
   * Clear current profile data
   */
  clearCurrentProfile() {
    this._currentProfile.set(null);
  }

  /**
   * Clear top matches data
   */
  clearTopMatches() {
    this._topMatches.set({
      data: [],
      hasNext: false,
      limit: 10,
      totalCount: 0,
    });
  }

  /**
   * Reset all data and loading states
   */
  resetAll() {
    this.clearCurrentProfile();
    this.clearTopMatches();
    this._isProfileLoading.set(false);
    this._isTopMatchesLoading.set(false);
    this._isPublishingLoading.set(false);
  }

  /**
   * Helper method to build HTTP params from filter object
   */
  private buildHttpParams(filters: OfferTopMatchFilterRequest): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return params;
  }
}
