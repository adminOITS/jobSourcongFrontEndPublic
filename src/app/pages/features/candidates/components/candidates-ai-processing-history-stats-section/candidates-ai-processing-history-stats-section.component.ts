import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateAiProcessingHistoryService } from '../../../../../core/services/candidate/candidate-ai-processing-history.service';
import { CandidatesAiProcessingHistoryStatsCardComponent } from '../candidates-ai-processing-history-stats-card/candidates-ai-processing-history-stats-card.component';
import type { StatsCardData } from '../../../../../core/types';

@Component({
  selector: 'app-candidates-ai-processing-history-stats-section',
  imports: [
    CommonModule,
    TranslateModule,
    CandidatesAiProcessingHistoryStatsCardComponent,
  ],
  templateUrl:
    './candidates-ai-processing-history-stats-section.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryStatsSectionComponent
  implements OnInit
{
  private candidateAiProcessingHistoryService = inject(
    CandidateAiProcessingHistoryService
  );

  statsCards: StatsCardData[] = [];

  readonly candidateAiProcessingStatistics =
    this.candidateAiProcessingHistoryService.candidateAiProcessingStatistics;
  readonly isCandidateAiProcessingStatisticsLoading =
    this.candidateAiProcessingHistoryService
      .isCandidateAiProcessingStatisticsLoading;

  constructor() {
    effect(() => {
      this.candidateAiProcessingStatistics();
      this.updateStatsCards();
    });
  }

  ngOnInit() {
    this.loadStatistics();
    this.updateStatsCards();
  }

  loadStatistics() {
    this.candidateAiProcessingHistoryService.getStatisticsByConnectedUser();
  }

  updateStatsCards() {
    const stats = this.candidateAiProcessingStatistics();
    this.statsCards = [
      {
        title: 'TOTAL_PROCESSED',
        value: stats?.totalProcessed ?? 0,
        icon: 'pi pi-chart-bar',
        iconColor: '#3B82F6',
        bgColor: '#DBEAFE',
        textColor: '#1E40AF',
      },
      {
        title: 'IN_PROGRESS',
        value: stats?.inProgress ?? 0,
        icon: 'pi pi-spin pi-spinner',
        iconColor: '#F59E0B',
        bgColor: '#FEF3C7',
        textColor: '#D97706',
      },
      {
        title: 'SUCCESSFUL',
        value: stats?.successful ?? 0,
        icon: 'pi pi-check-circle',
        iconColor: '#10B981',
        bgColor: '#D1FAE5',
        textColor: '#059669',
      },
      {
        title: 'FAILED',
        value: stats?.failed ?? 0,
        icon: 'pi pi-times-circle',
        iconColor: '#EF4444',
        bgColor: '#FEE2E2',
        textColor: '#DC2626',
      },
    ];
  }
}
