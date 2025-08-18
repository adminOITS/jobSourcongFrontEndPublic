import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StatsCardData } from '../../../../../core/types';

@Component({
  selector: 'app-candidates-ai-processing-history-stats-card',
  imports: [CommonModule, TranslateModule],
  templateUrl: './candidates-ai-processing-history-stats-card.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryStatsCardComponent {
  @Input() statsData!: StatsCardData;
}
