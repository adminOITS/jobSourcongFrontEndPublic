import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ProfileFilterRequest } from '../../../../../core/models/profile.models';
import {
  DEFAULT_PROFILE_PAGE,
  DEFAULT_PROFILE_SIZE,
} from '../../../../../core/utils/constants';
import { debounceTime, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profiles-filter-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FloatLabelModule,
    ButtonModule,
    PopoverModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './profiles-filter-form.component.html',
  styles: ``,
})
export class ProfilesFilterFormComponent implements OnDestroy {
  @Input() request = signal<ProfileFilterRequest>({
    page: DEFAULT_PROFILE_PAGE,
    size: DEFAULT_PROFILE_SIZE,
  });
  private fb: FormBuilder = inject(FormBuilder);
  filterForm: FormGroup = this.fb.group({
    search: [''],
    status: [null],
    creationDate: [null],
  });

  statuses = [
    { name: 'Pending', value: 'pending' },
    { name: 'Approved', value: 'approved' },
    { name: 'Rejected', value: 'rejected' },
  ];
  @ViewChild('filterPopover') filterPopover!: Popover;
  private destroy$ = new Subject<void>();
  constructor() {
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(700))
      .subscribe((value) => {
        this.applyFilters();
      });
  }
  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: ProfileFilterRequest = {
      page: this.request().page,
      size: this.request().size,
      keyword: '',
    };

    if (filters.search) {
      filteredRequest.keyword = filters.search;
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
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
