import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { ApplicationSearchRequest } from '../../../../../core/models/application.models';
import {
  APPLICATION_STATUS_OPTIONS,
  DEFAULT_APPLICATION_PAGE,
} from '../../../../../core/utils/constants';
import { DEFAULT_APPLICATION_SIZE } from '../../../../../core/utils/constants';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-applications-filter-form',
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    PopoverModule,
    SelectModule,
    DatePicker,
  ],
  templateUrl: './applications-filter-form.component.html',
  styles: ``,
})
export class ApplicationsFilterFormComponent implements OnDestroy {
  @Input() request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  filterForm!: FormGroup;
  @ViewChild('filterPopover') filterPopover!: Popover;
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  applicationStatusesOptions = [] as typeof APPLICATION_STATUS_OPTIONS;
  translateService = inject(TranslateService);

  constructor() {
    this.applicationStatusesOptions = APPLICATION_STATUS_OPTIONS.map(
      (item) => ({
        ...item,
        name: this.translateService.instant(item.name),
      })
    ) as typeof APPLICATION_STATUS_OPTIONS;
    this.filterForm = this.fb.group({
      creationDate: [null],
      status: [null],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: ApplicationSearchRequest = {
      page: this.request().page,
      size: this.request().size,
    };

    if (filters.status) {
      filteredRequest.status = filters.status.value;
    }

    if (filters.creationDate) {
      const [startDate, endDate] = filters.creationDate;
      if (startDate) {
        const isoString = new Date(startDate).toISOString();
        const trimmed = isoString.replace('.000Z', '');
        filteredRequest.createdAtFrom = trimmed;
      }
      if (endDate) {
        const isoString = new Date(endDate).toISOString();
        const trimmed = isoString.replace('.000Z', '');
        filteredRequest.createdAtTo = trimmed;
      }
    }

    this.request.set(filteredRequest);
    this.filterPopover.hide();
  }

  resetFilters() {
    this.filterForm.reset();
    this.request.set({
      page: DEFAULT_APPLICATION_PAGE,
      size: this.request().size,
    });
    this.filterPopover.hide();
  }
}
