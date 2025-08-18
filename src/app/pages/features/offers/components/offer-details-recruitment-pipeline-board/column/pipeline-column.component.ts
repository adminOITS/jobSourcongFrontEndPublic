import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationCardComponent } from '../cards/application-card/application-card.component';
import { InterviewResponse } from '../../../../../../core/models/interview.models';
import { ApplicationResponse } from '../../../../../../core/models/application.models';
import { InterviewCardComponent } from '../cards/interview-card/interview-card.component';
import { TranslateModule } from '@ngx-translate/core';
export interface PipelineHeader {
  key: string;
  label: string;
  icon: string;
  count: number;
  visible: boolean;
}

export type PipelineItem = InterviewResponse | ApplicationResponse;

@Component({
  selector: 'app-pipeline-column',
  standalone: true,
  imports: [
    CommonModule,
    InterviewCardComponent,
    ApplicationCardComponent,
    TranslateModule,
  ],
  templateUrl: './pipeline-column.component.html',
})
export class PipelineColumnComponent {
  @Input() header!: PipelineHeader;
  @Input() items: PipelineItem[] = [];
  @Output() onToggleVisibility = new EventEmitter<string>();

  isInterview(item: PipelineItem): item is InterviewResponse {
    return 'interviewerName' in item && 'interviewDuration' in item;
  }

  isApplication(item: PipelineItem): item is ApplicationResponse {
    return 'identifier' in item && 'profile' in item;
  }
}
