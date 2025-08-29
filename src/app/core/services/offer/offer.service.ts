import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, take, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  JobOfferFilterRequest,
  OfferBenefits,
  OfferDescription,
  OfferJobDetails,
  OfferNotes,
  OfferRequest,
  OfferResponse,
  OfferShortResponse,
  OfferStatus,
} from '../../models/offer.models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { Router } from '@angular/router';
import { MessageWrapperService } from '../message-wrapper.service';
import { ROUTES } from '../../../routes';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private _offersSignal = signal<PaginatedResponse<OfferShortResponse>>({
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  });
  private _selectedOffer = signal<{
    offerId: string;
    companyId: string;
  } | null>(null);
  private _isOffersLoading = signal(false);
  private _isOfferActionLoading = signal(false);
  private _isOffersAssignedLoading = signal(false);
  private _manageRecruitersDialogVisible = signal(false);
  private _isOfferLoading = signal(false);
  readonly selectedOffer = computed(() => this._selectedOffer());
  private offerDetailsSignal = signal<OfferResponse | null>(null);
  offerDetails = computed(() => this.offerDetailsSignal());
  isOffersLoading = computed(() => this._isOffersLoading());
  isOfferActionLoading = computed(() => this._isOfferActionLoading());
  isOffersAssignedLoading = computed(() => this._isOffersAssignedLoading());
  manageRecruitersDialogVisible = computed(() =>
    this._manageRecruitersDialogVisible()
  );
  isOfferLoading = computed(() => this._isOfferLoading());
  private _manageValidatorsDialogVisible = signal(false);
  manageValidatorsDialogVisible = computed(() =>
    this._manageValidatorsDialogVisible()
  );
  offers = computed(() => this._offersSignal());
  offerEducations = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.educations ?? [],
  });
  offerExperiences = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.experiences ?? [],
  });
  offerSkills = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.skills ?? [],
  });
  offerLanguages = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.languages ?? [],
  });

  offerDescription = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.description ?? null,
  });
  offerNotes = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.notes ?? null,
  });

  offerBenefits = linkedSignal({
    source: () => this.offerDetailsSignal(),
    computation: (source) => source?.benefits ?? null,
  });

  updateOfferDescription(desc: OfferDescription) {
    this.offerDetailsSignal.update((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        description: desc.description,
      };
    });
  }
  updateOfferNotes(notes: OfferNotes) {
    this.offerDetailsSignal.update((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: notes.notes,
      };
    });
  }
  updateOfferBenefits(benefits: OfferBenefits) {
    this.offerDetailsSignal.update((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        benefits: benefits.benefits,
      };
    });
  }

  setSelectedOffer(offerId: string, companyId: string) {
    this._selectedOffer.set({ offerId, companyId });
  }

  openManageRecruitersDialog() {
    this._manageRecruitersDialogVisible.set(true);
  }
  setManageRecruitersDialogVisible(visible: boolean) {
    this._manageRecruitersDialogVisible.set(visible);
  }
  closeManageRecruitersDialog() {
    this._manageRecruitersDialogVisible.set(false);
    this._selectedOffer.set(null);
  }
  openManageValidatorsDialog() {
    this._manageValidatorsDialogVisible.set(true);
  }
  setManageValidatorsDialogVisible(visible: boolean) {
    this._manageValidatorsDialogVisible.set(visible);
  }
  closeManageValidatorsDialog() {
    this._manageValidatorsDialogVisible.set(false);
    this._selectedOffer.set(null);
  }

  isLoadingSignal = signal(false);
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageWrapper = inject(MessageWrapperService);
  // Get all offers
  getOffers(filters?: JobOfferFilterRequest) {
    this.emptyOffers();
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this.isLoadingSignal.set(true);
    this.http
      .get<PaginatedResponse<OfferShortResponse>>(this.baseUrl, { params })
      .pipe(
        take(1),
        tap({
          error: (err) => {
            this.isLoadingSignal.set(false);
          },
          complete: () => {
            this.isLoadingSignal.set(false);
          },
        })
      )
      .subscribe({
        next: (res) => {
          this._offersSignal.set(res);
          this.isLoadingSignal.set(false);
        },
      });
  }

  getJobOffersByIds(ids: string[], limit: number = 10) {
    const params = new HttpParams()
      .set('ids', ids.join(','))
      .set('limit', limit.toString());

    return this.http
      .get<OfferShortResponse[]>(`${this.baseUrl}/by-ids`, {
        params,
      })
      .pipe(take(1));
  }
  getOffersByCompanyId(companyId: string, filters?: JobOfferFilterRequest) {
    this.emptyOffers();
    const url = `${this.baseUrl}/companies/${companyId}`;
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this.isLoadingSignal.set(true);
    this.http
      .get<PaginatedResponse<OfferShortResponse>>(url, { params })
      .pipe(
        take(1),
        tap({
          complete: () => {
            this.isLoadingSignal.set(false);
          },
        })
      )
      .subscribe({
        next: (res) => {
          this._offersSignal.set(res);
          this.isLoadingSignal.set(false);
        },
      });
  }

  emptyOfferDetails() {
    this.offerDetailsSignal.set(null);
  }
  // Get offer by ID
  getOfferById(id: string) {
    this.emptyOfferDetails();
    this._isOfferLoading.set(true);
    this.http
      .get<OfferResponse>(`${this.baseUrl}/${id}`)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.offerDetailsSignal.set(res);
          this._isOfferLoading.set(false);
        },
        error: (err) => {
          this._isOfferLoading.set(false);
          this.router.navigate(['/offers/' + id + '/not-found'], {
            state: { message: 'OFFER_NOT_FOUND' },
          });
        },
      });
  }
  getOffersAssignedToStaff(companyId: string, staffId: string, role: string) {
    this.emptyOffers();

    const url = `${this.baseUrl}/companies/${companyId}/${role}/${staffId}`;
    this._isOffersAssignedLoading.set(true);
    this.http
      .get<PaginatedResponse<OfferShortResponse>>(url)
      .pipe(
        take(1),
        finalize(() => this._isOffersAssignedLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this._offersSignal.set(res);
        },
      });
  }

  unassignStaffOffer(
    offerId: string,
    companyId: string,
    staffId: string,
    role: string
  ) {
    const url = `${this.baseUrl}/${offerId}/companies/${companyId}/${role}/${staffId}/deassign`;
    this._isOfferActionLoading.set(true);
    this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => this._isOfferActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this._offersSignal.set({
            ...this._offersSignal(),
            data: this._offersSignal().data.filter(
              (offer) => offer.id !== offerId
            ),
          });
          this.messageWrapper.success('OFFER_UNASSIGNED_SUCCESSFULLY');
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_UNASSIGNED_FAILED');
        },
      });
  }

  assignOfferToRecruiter(offerId: string, companyId: string, staffId: string) {
    const url = `${this.baseUrl}/${offerId}/companies/${companyId}/recruiters/${staffId}/assign`;
    this._isOfferActionLoading.set(true);
    this.http
      .post<void>(url, {})
      .pipe(
        take(1),
        finalize(() => this._isOfferActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_ASSIGNED_SUCCESSFULLY');
          this.setManageRecruitersDialogVisible(false);
          this._selectedOffer.set(null);
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_UNASSIGNED_FAILED');
        },
      });
  }
  assignOfferToValidator(
    offerId: string,
    companyId: string,
    staffIds: string[]
  ) {
    const url = `${this.baseUrl}/${offerId}/companies/${companyId}/validators/assign`;
    this._isOfferActionLoading.set(true);
    this.http
      .post<void>(url, staffIds)
      .pipe(
        take(1),
        finalize(() => this._isOfferActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_ASSIGNED_SUCCESSFULLY');
          this.setManageValidatorsDialogVisible(false);
          this._selectedOffer.set(null);
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_UNASSIGNED_FAILED');
        },
      });
  }
  // Create new offer
  createOffer(companyId: string, offer?: OfferRequest) {
    const url = `${this.baseUrl}/companies/${companyId}`;
    this._isOfferActionLoading.set(true);
    this.http
      .post<OfferResponse>(url, offer)
      .pipe(
        take(1),
        finalize(() => this._isOfferActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_CREATED_SUCCESSFULLY');
          const currentUrl = this.router.url;
          const url = currentUrl.split('/');
          this.router.navigate([`${url[1]}/${ROUTES.OFFER.LIST}`]);
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_CREATED_FAILED');
        },
      });
  }

  // Update offer
  updateOffer(id: string, offer: OfferJobDetails) {
    this.http
      .put<OfferResponse>(`${this.baseUrl}/${id}`, offer)
      .pipe(take(1))

      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_UPDATED_SUCCESSFULLY');
          this.offerDetailsSignal.set({
            ...this.offerDetailsSignal(),
            ...res,
          });
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_UPDATED_FAILED');
        },
      });
  }

  // Delete offer
  deleteOffer(id: string) {
    this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_DELETED_SUCCESSFULLY');
          this._offersSignal.set({
            ...this._offersSignal(),
            data: this._offersSignal().data.filter((offer) => offer.id !== id),
            totalItems: this._offersSignal().totalItems - 1,
          });
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_DELETED_FAILED');
        },
      });
  }

  updateOfferStatus(id: string, status: OfferStatus) {
    const url = `${this.baseUrl}/${id}/status`;
    const params = new HttpParams().set('status', status);

    this.http
      .put<void>(url, null, { params })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('OFFER_STATUS_UPDATED_SUCCESSFULLY');
          this._offersSignal.set({
            ...this._offersSignal(),
            data: this._offersSignal().data.map((offer) =>
              offer.id === id ? { ...offer, status } : offer
            ),
          });
        },
        error: (err) => {
          this.messageWrapper.error('OFFER_STATUS_UPDATED_FAILED');
        },
      });
  }

  // Update offers signal
  updateOffersSignal(offers: PaginatedResponse<OfferShortResponse>): void {
    this._offersSignal.set(offers);
  }
  emptyOffers() {
    this._offersSignal.set({
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
    });
  }
  updateOfferDetailsSignal(offer: OfferResponse): void {
    this.offerDetailsSignal.set(offer);
  }
}
