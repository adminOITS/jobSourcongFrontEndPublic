import { Component, inject, Input, OnDestroy, signal } from '@angular/core';
import {
  AiCandidateProcessingHistoryFilter,
  ProcessingStatus,
} from '../../../../../core/models/candidate.models';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';
import { ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import {
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
} from '../../../../../core/utils/constants';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-candidates-ai-processing-history-filter-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    SelectModule,
    DatePickerModule,
    TranslateModule,
    FloatLabelModule,
  ],
  templateUrl: './candidates-ai-processing-history-filter-form.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryFilterFormComponent
  implements OnDestroy
{
  @Input() request = signal<AiCandidateProcessingHistoryFilter>({
    page: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
    size: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
  });
  @ViewChild('filterPopover') filterPopover!: Popover;
  private fb: FormBuilder = inject(FormBuilder);
  private translateService: TranslateService = inject(TranslateService);

  filterForm: FormGroup;
  statusOptions: { label: string; value: string }[] = [];
  destroy$ = new Subject<void>();
  constructor() {
    this.initOptions();
    this.filterForm = this.fb.group({
      status: [null],
      creationDate: [null],
    });
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initOptions();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initOptions() {
    this.statusOptions = Object.values(ProcessingStatus).map((status) => ({
      label: this.translateService.instant(status),
      value: status,
    }));
  }
  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: AiCandidateProcessingHistoryFilter = {
      page: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
      size: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
    };

    if (filters.status) {
      filteredRequest.status = filters.status.value;
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
      page: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
      size: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
    });
    this.filterPopover.hide();
  }
  refresh() {
    this.request.set({
      ...this.request(),
      page: this.request().page,
      size: this.request().size,
    });
  }
}
