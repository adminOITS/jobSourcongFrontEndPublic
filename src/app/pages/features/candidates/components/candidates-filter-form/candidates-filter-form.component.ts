import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Popover, PopoverModule } from 'primeng/popover';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CANDIDATE_CREATION_SOURCE_OPTIONS,
  CANDIDATE_REACHABILITY_STATUS_OPTIONS,
  CANDIDATE_VALIDATION_STATUS_OPTIONS,
  DEFAULT_CANDIDATE_PAGE,
  DEFAULT_CANDIDATE_SIZE,
} from '../../../../../core/utils/constants';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CandidateSearchRequest } from '../../../../../core/models/candidate.models';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';

@Component({
  selector: 'app-candidates-filter-form',
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
  templateUrl: './candidates-filter-form.component.html',
  styles: ``,
})
export class CandidatesFilterFormComponent implements OnDestroy {
  @Input() request = signal<CandidateSearchRequest>({
    page: DEFAULT_CANDIDATE_PAGE,
    size: DEFAULT_CANDIDATE_SIZE,
  });
  @ViewChild('filterPopover') filterPopover!: Popover;
  private fb: FormBuilder = inject(FormBuilder);
  private translateService: TranslateService = inject(TranslateService);
  reachabilityStatusOptions: { label: string; value: string }[] = [];
  validationStatusOptions: { label: string; value: string }[] = [];
  creationSourceOptions: { label: string; value: string }[] = [];
  destroy$ = new Subject<void>();
  candidateService = inject(CandidateService);
  candidates = this.candidateService.candidatesComputed;

  filterForm: FormGroup;
  constructor() {
    this.initOptions();
    this.filterForm = this.fb.group({
      search: [''],
      // status: [null],
      creationDate: [null],
      reachabilityStatus: [null],
      validationStatus: [null],
      creationSource: [null],
    });

    this.filterForm
      .get('search')
      ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((value) => {
        this.applyFilters();
      });

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initOptions();
      });
  }

  initOptions() {
    this.reachabilityStatusOptions = CANDIDATE_REACHABILITY_STATUS_OPTIONS.map(
      (option) => ({
        label: this.translateService.instant(option.name),
        value: option.value,
      })
    );
    this.validationStatusOptions = CANDIDATE_VALIDATION_STATUS_OPTIONS.map(
      (option) => ({
        label: this.translateService.instant(option.name),
        value: option.value,
      })
    );
    this.creationSourceOptions = CANDIDATE_CREATION_SOURCE_OPTIONS.map(
      (option) => ({
        label: this.translateService.instant(option.name),
        value: option.value,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: CandidateSearchRequest = {
      page: DEFAULT_CANDIDATE_PAGE,
      size: DEFAULT_CANDIDATE_SIZE,
    };
    if (filters.search) {
      filteredRequest.keyword = filters.search;
    }

    if (filters.reachabilityStatus) {
      filteredRequest.availabilityStatus = filters.reachabilityStatus.value;
    }
    if (filters.validationStatus) {
      filteredRequest.validationStatus = filters.validationStatus.value;
    }
    if (filters.creationSource) {
      filteredRequest.creationSource = filters.creationSource.value;
    }
    if (filters.creationDate) {
      const [startDate, endDate] = filters.creationDate;
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
      page: DEFAULT_CANDIDATE_PAGE,
      size: DEFAULT_CANDIDATE_SIZE,
    });
    this.filterPopover.hide();
  }
}
