import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  OfferStaffResponse,
  StaffRequest,
  StaffResponse,
  StaffRole,
} from '../../models/staff.models';
import { HttpClient } from '@angular/common/http';
import { MessageWrapperService } from '../message-wrapper.service';
import { environment } from '../../../../environments/environment';
import { COMPANY_SERVICE_DOMAIN } from '../../utils/constants';
import { finalize, take } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { Router } from '@angular/router';
import { H_R_Response } from '../../models/hr.models';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private baseUrl = environment.domain + COMPANY_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageWrapper = inject(MessageWrapperService);
  private _staffList = signal<PaginatedResponse<StaffResponse>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  private _offerValidatorsList = signal<OfferStaffResponse[]>([]);
  private _offerRecruitersList = signal<OfferStaffResponse[]>([]);

  private _isStaffListCollapsed = signal<boolean>(false);
  private _selectedStaff = signal<StaffResponse | null>(null);
  private _staffDetails = signal<StaffResponse | null>(null);
  private _addEditSelectedStaff = signal<StaffResponse | H_R_Response | null>(
    null
  );

  private _isAddEditStaffDialogVisible = signal<boolean>(false);
  private _isEditHrDialogVisible = signal<boolean>(false);
  private _isStaffRequestLoading = signal<boolean>(false);
  private _isStaffDetailsDialogVisible = signal<boolean>(false);
  private _selectedStaffForDetails = signal<StaffResponse | null>(null);
  // Getters
  readonly staffList = computed(() => this._staffList());
  offerValidatorsList = linkedSignal({
    source: () => this._offerValidatorsList(),
    computation: (source) =>
      source.map((r) => ({
        ...r,
        selected: r.selected,
        staff: { ...r.staff },
      })),
  });
  offerRecruitersList = linkedSignal({
    source: () => this._offerRecruitersList(),
    computation: (source) =>
      source.map((r) => ({
        ...r,
        selected: r.selected,
        staff: { ...r.staff },
      })),
  });
  readonly addEditSelectedStaff = computed(() => this._addEditSelectedStaff());
  readonly isAddEditStaffDialogVisible = computed(() =>
    this._isAddEditStaffDialogVisible()
  );
  readonly isStaffListCollapsed = computed(() => this._isStaffListCollapsed());
  readonly isStaffRequestLoading = computed(() =>
    this._isStaffRequestLoading()
  );
  readonly isStaffDetailsDialogVisible = computed(() =>
    this._isStaffDetailsDialogVisible()
  );
  readonly selectedStaffForDetails = computed(() =>
    this._selectedStaffForDetails()
  );
  readonly isEditHrDialogVisible = computed(() =>
    this._isEditHrDialogVisible()
  );
  resetOfferValidatorsList(): void {
    this._offerValidatorsList.set([]);
  }
  resetOfferRecruitersList(): void {
    this._offerRecruitersList.set([]);
  }
  selectedStaff = computed(() => this._selectedStaff());
  resetSelectedStaff(): void {
    this._selectedStaff.set(null);
  }
  readonly staffDetails = computed(() => this._staffDetails());
  resetStaffDetails(): void {
    this._staffDetails.set(null);
  }

  openAddStaffDialog(): void {
    this._addEditSelectedStaff.set(null);

    this._isAddEditStaffDialogVisible.set(true);
  }
  openEditStaffDialog(staff: StaffResponse): void {
    this._addEditSelectedStaff.set(staff);
    this._isAddEditStaffDialogVisible.set(true);
  }
  openEditHrDialog(staff: H_R_Response): void {
    this._addEditSelectedStaff.set(staff);
    this._isEditHrDialogVisible.set(true);
  }

  setDialogVisible(visible: boolean): void {
    this._isAddEditStaffDialogVisible.set(visible);
  }
  setEditHrDialogVisible(visible: boolean): void {
    this._isEditHrDialogVisible.set(visible);
  }
  closeEditHrDialog(): void {
    this._isEditHrDialogVisible.set(false);
  }

  setStaffDetailsDialogVisible(visible: boolean): void {
    this._isStaffDetailsDialogVisible.set(visible);
  }

  openStaffDetailsDialog(staff: StaffResponse): void {
    this._selectedStaffForDetails.set(staff);
    this._isStaffDetailsDialogVisible.set(true);
  }

  closeStaffDetailsDialog(): void {
    this._isStaffDetailsDialogVisible.set(false);
    this._selectedStaffForDetails.set(null);
  }

  // Methods
  toggleStaffList(): void {
    this._isStaffListCollapsed.update((value) => !value);
  }

  setSelectedStaff(staff: StaffResponse | null): void {
    this._selectedStaff.set(staff);
  }

  // Reset state
  reset(): void {
    this._isStaffListCollapsed.set(false);
    this._selectedStaff.set(null);
    this._isStaffDetailsDialogVisible.set(false);
    this._selectedStaffForDetails.set(null);
    this._staffDetails.set(null);
  }
  closeDialog(): void {
    this._isAddEditStaffDialogVisible.set(false);
    this._addEditSelectedStaff.set(null);
  }
  //to do: add load more staff functionality
  getStaffByCompanyId(companyId: string): void {
    this._isStaffRequestLoading.set(true);
    this.http
      .get<PaginatedResponse<StaffResponse>>(
        `${this.baseUrl}/${companyId}/staff?page=0&size=100`
      )
      .pipe(
        take(1),
        finalize(() => this._isStaffRequestLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._staffList.set(response);
        },
        error: (error) => {
          this.router.navigate(['/company/' + companyId + '/not-found'], {
            state: { message: 'COMPANY_NOT_FOUND' },
          });
        },
      });
  }

  getCompanyStaffByOfferId(
    companyId: string,
    offerId: string,
    role: StaffRole
  ): void {
    this.resetOfferValidatorsList();
    this.resetOfferRecruitersList();
    this._isStaffRequestLoading.set(true);
    this.http
      .get<OfferStaffResponse[]>(
        `${this.baseUrl}/${companyId}/staff/offers/${offerId}?role=${role}`
      )
      .pipe(
        take(1),
        finalize(() => this._isStaffRequestLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (role === 'VALIDATOR') {
            this._offerValidatorsList.set(response);
          } else {
            this._offerRecruitersList.set(response);
          }
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_GETTING_STAFF');
        },
      });
  }
  getStaffById(staffId: string, companyId: string): void {
    this._staffDetails.set(null);
    this._isStaffRequestLoading.set(true);
    this.http
      .get<StaffResponse>(`${this.baseUrl}/${companyId}/staff/${staffId}`)
      .pipe(
        take(1),
        finalize(() => this._isStaffRequestLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this._staffDetails.set(response);
        },
      });
  }
  addStaff(staff: StaffRequest, staffRole: string, companyId: string): void {
    this._isStaffRequestLoading.set(true);
    this.http
      .post<StaffResponse>(
        `${this.baseUrl}/${companyId}/staff?role=${staffRole}`,
        staff
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isStaffRequestLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success('MEMBER_CREATED_SUCCESSFULLY');
          this._staffList.update((value) => {
            return {
              ...value,
              data: [response, ...value.data],
            };
          });
          this.closeDialog();
        },
        error: (error) => {
          this.messageWrapper.error('MEMBER_CREATED_FAILED');
        },
      });
  }

  editStaff(staffId: string, staff: StaffRequest, companyId: string): void {
    this._isStaffRequestLoading.set(true);
    this.http
      .put<StaffResponse>(
        `${this.baseUrl}/${companyId}/staff/${staffId}`,
        staff
      )
      .pipe(
        take(1),
        finalize(() => {
          this._isStaffRequestLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success('MEMBER_UPDATED_SUCCESSFULLY');
          this.closeDialog();
          this._staffList.update((value) => {
            return {
              ...value,
              data: value.data.map((item) =>
                item.id === staffId ? response : item
              ),
            };
          });
        },
        error: (error) => {
          this.messageWrapper.error('MEMBER_UPDATED_FAILED');
        },
      });
  }
  deleteStaff(staffId: string, companyId: string): void {
    this._isStaffRequestLoading.set(true);
    this.http
      .delete<void>(`${this.baseUrl}/${companyId}/staff/${staffId}`)
      .pipe(
        take(1),
        finalize(() => this._isStaffRequestLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.messageWrapper.success('MEMBER_DELETED_SUCCESSFULLY');
          this._staffList.update((value) => {
            return {
              ...value,
              data: value.data.filter((item) => item.id !== staffId),
            };
          });
        },
        error: (error) => {
          this.messageWrapper.error('MEMBER_DELETED_FAILED');
        },
      });
  }
}
