import {
  Component,
  inject,
  Input,
  OnDestroy,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import {
  CONTRACT_TYPE_OPTIONS,
  DEFAULT_JOB_OFFER_PAGE,
  DEFAULT_JOB_OFFER_SIZE,
  EMPLOYMENT_TYPES,
  OFFER_STATUS_OPTIONS,
  WORK_MODES,
} from '../../../../../core/utils/constants';
import {
  count,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
} from 'rxjs';
import { JobOfferFilterRequest } from '../../../../../core/models/offer.models';

@Component({
  selector: 'app-offers-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePicker,
    ButtonModule,
    FloatLabelModule,
    PopoverModule,
    TranslateModule,
  ],
  templateUrl: './offers-filter-form.component.html',
  styles: ``,
})
export class OffersFilterFormComponent implements OnDestroy {
  @Input() request = signal<JobOfferFilterRequest>({
    page: DEFAULT_JOB_OFFER_PAGE,
    size: DEFAULT_JOB_OFFER_SIZE,
  });
  @ViewChild('filterPopover') filterPopover!: Popover;
  filterForm: FormGroup;
  private _statusOptions = OFFER_STATUS_OPTIONS;
  private _employmentTypes = EMPLOYMENT_TYPES;
  private _workModes = WORK_MODES;
  private _contractTypeOptions = CONTRACT_TYPE_OPTIONS;

  statusesOptions: typeof OFFER_STATUS_OPTIONS = [];
  employmentTypesOptions: typeof EMPLOYMENT_TYPES = [];
  workModesOptions: typeof WORK_MODES = [];
  contractTypeOptions: typeof CONTRACT_TYPE_OPTIONS = [];

  translateService = inject(TranslateService);

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [null],
      workMode: [null],
      employmentType: [null],
      contractType: [null],
      status: [null],
      creationDateRange: [null],
    });
    // Listen to search input with debounce
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.initializeOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.initializeOptions();
      });
  }
  private destroy$ = new Subject<void>();

  private initializeOptions() {
    this.employmentTypesOptions = this._employmentTypes.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof EMPLOYMENT_TYPES;

    this.workModesOptions = this._workModes.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof WORK_MODES;

    this.statusesOptions = this._statusOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof OFFER_STATUS_OPTIONS;

    this.contractTypeOptions = this._contractTypeOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof CONTRACT_TYPE_OPTIONS;
  }

  applyFilters() {
    const filters = this.filterForm.value;

    const filteredRequest: JobOfferFilterRequest = {
      page: this.request().page,
      size: this.request().size,
      keyword: '',
    };

    if (filters.search) {
      filteredRequest.keyword = filters.search;
    }
    if (filters.workMode) {
      filteredRequest.workMode = filters.workMode.value;
    }
    if (filters.employmentType) {
      filteredRequest.employmentType = filters.employmentType.value;
    }
    if (filters.status) {
      filteredRequest.status = filters.status.value;
    }

    if (filters.contractType) {
      filteredRequest.contractType = filters.contractType.value;
    }

    if (filters.creationDateRange) {
      const [startDate, endDate] = filters.creationDateRange;
      if (startDate) {
        const isoString = new Date(startDate).toISOString();
        const trimmed = isoString.replace('.000Z', '');
        filteredRequest.startDate = trimmed;
      }
      if (endDate) {
        const isoString = new Date(endDate).toISOString();
        const trimmed = isoString.replace('.000Z', '');
        filteredRequest.endDate = trimmed;
      }
    }
    this.request.set(filteredRequest);

    this.filterPopover.hide();
  }

  resetFilters() {
    this.filterForm.reset();
    this.request.set({
      page: DEFAULT_JOB_OFFER_PAGE,
      size: DEFAULT_JOB_OFFER_SIZE,
    });
    this.filterPopover.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
