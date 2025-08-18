import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  INTERVIEW_TYPE_OPTIONS,
  INTERVIEW_STATUS_OPTIONS,
} from '../../../../../core/utils/constants';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { InterviewSearchRequest } from '../../../../../core/models/interview.models';
import {
  DEFAULT_INTERVIEW_PAGE,
  DEFAULT_INTERVIEW_SIZE,
} from '../../../../../core/utils/constants';
import { Popover } from 'primeng/popover';
@Component({
  selector: 'app-interviews-filter-form',
  templateUrl: './interviews-filter-form.component.html',
  styles: ``,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PopoverModule,
    SelectModule,
    FloatLabelModule,
    DatePickerModule,
    ButtonModule,
    TranslateModule,
    InputTextModule,
  ],
})
export class InterviewsFilterFormComponent implements OnDestroy {
  @Input() request = signal<InterviewSearchRequest>({
    page: DEFAULT_INTERVIEW_PAGE,
    size: DEFAULT_INTERVIEW_SIZE,
  });
  @ViewChild('filterPopover') filterPopover!: Popover;
  filterForm!: FormGroup;
  interviewTypeOptions: any[] = [];
  interviewStatusOptions: any[] = [];
  private translateService = inject(TranslateService);

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeOptions();
    this.filterForm = this.fb.group({
      search: [null],
      interviewType: [null],
      status: [null],
      creationDateRange: [null],
    });
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(700))
      .subscribe((value) => {
        this.applyFilters();
      });

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeOptions();
      });
  }

  initializeOptions() {
    this.interviewTypeOptions = INTERVIEW_TYPE_OPTIONS.map((option) => ({
      ...option,
      name: this.translateService.instant(option.name),
    }));
    this.interviewStatusOptions = INTERVIEW_STATUS_OPTIONS.map((option) => ({
      ...option,
      name: this.translateService.instant(option.name),
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: InterviewSearchRequest = {
      page: this.request().page,
      size: this.request().size,
      keyword: '',
    };

    if (filters.search) {
      filteredRequest.keyword = filters.search;
    }

    if (filters.interviewType) {
      filteredRequest.type = filters.interviewType;
    }

    if (filters.status) {
      filteredRequest.status = filters.status;
    }

    if (filters.creationDateRange) {
      const [startDate, endDate] = filters.creationDateRange;
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
    this.request.set({
      page: DEFAULT_INTERVIEW_PAGE,
      size: DEFAULT_INTERVIEW_SIZE,
    });
    this.filterForm.reset();
    this.filterPopover.hide();
  }
}
