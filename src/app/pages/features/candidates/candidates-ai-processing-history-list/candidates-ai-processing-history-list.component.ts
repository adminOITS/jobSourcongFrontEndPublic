import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CandidatesAiProcessingHistoryFilterFormComponent } from '../components/candidates-ai-processing-history-filter-form/candidates-ai-processing-history-filter-form.component';
import { CandidatesAiProcessingHistoryTableComponent } from '../components/candidates-ai-processing-history-table/candidates-ai-processing-history-table.component';
import {
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
} from '../../../../core/utils/constants';
import { AiCandidateProcessingHistoryFilter } from '../../../../core/models/candidate.models';
import { CandidatesAiProcessingHistoryStatsSectionComponent } from '../components/candidates-ai-processing-history-stats-section/candidates-ai-processing-history-stats-section.component';
import { CandidateAiProcessingHistoryService } from '../../../../core/services/candidate/candidate-ai-processing-history.service';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-candidates-ai-processing-history-list',
  imports: [
    CandidatesAiProcessingHistoryFilterFormComponent,
    CandidatesAiProcessingHistoryTableComponent,
    CandidatesAiProcessingHistoryStatsSectionComponent,
  ],
  templateUrl: './candidates-ai-processing-history-list.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryListComponent implements OnInit {
  request = signal<AiCandidateProcessingHistoryFilter>({
    page: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
    size: DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
  });
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  private candidateAiProcessingHistoryService = inject(
    CandidateAiProcessingHistoryService
  );
  isCandidateAiProcessingStatisticsLoading =
    this.candidateAiProcessingHistoryService
      .isCandidateAiProcessingStatisticsLoading;
  isCandidateAiProcessingHistoryLoading =
    this.candidateAiProcessingHistoryService
      .isCandidateAiProcessingHistoryLoading;

  isLoading = computed(
    () =>
      this.isCandidateAiProcessingHistoryLoading() ||
      this.isCandidateAiProcessingStatisticsLoading()
  );
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService
        .get('CANDIDATE_AI_PROCESSING_HISTORY_LIST')
        .subscribe((res) => {
          this.appSettingsService.setTitle(res);
        });
    });
    effect(() => {
      if (this.request()) {
        this.candidateAiProcessingHistoryService.getFilteredHistory(
          this.request()
        );
      }
    });
  }

  ngOnInit() {
    this.candidateAiProcessingHistoryService.getStatisticsByConnectedUser();
    this.candidateAiProcessingHistoryService.getFilteredHistory(this.request());
  }
}
