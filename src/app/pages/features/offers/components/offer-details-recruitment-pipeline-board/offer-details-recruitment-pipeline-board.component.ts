import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PipelineColumnComponent,
  PipelineItem,
} from './column/pipeline-column.component';
import { PipelineColumnHeader } from '../../../../../core/types';
import { InterviewResponse } from '../../../../../core/models/interview.models';
import { ApplicationResponse } from '../../../../../core/models/application.models';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-offer-details-recruitment-pipeline-board',
  standalone: true,
  imports: [CommonModule, PipelineColumnComponent, TranslateModule],
  templateUrl: './offer-details-recruitment-pipeline-board.component.html',
})
export class OfferDetailsRecruitmentPipelineBoardComponent {
  columns: PipelineColumnHeader[] = [
    {
      key: 'applications',
      label: 'APPLICATIONS',
      icon: 'pi pi-user-plus',
      visible: true,
      count: 0,
    },
    {
      key: 'interviews',
      label: 'SCHEDULED_INTERVIEWS',
      icon: 'pi pi-calendar',
      visible: true,
      count: 0,
    },
    {
      key: 'passed',
      label: 'PASSED_INTERVIEWS',
      icon: 'pi pi-check-circle',
      visible: true,
      count: 0,
    },
    {
      key: 'pushed',
      label: 'PUSHED_TO_CLIENT',
      icon: 'pi pi-send',
      visible: true,
      count: 0,
    },
    {
      key: 'accepted',
      label: 'ACCEPTED_PROFILES',
      icon: 'pi pi-user-check',
      visible: true,
      count: 0,
    },
    {
      key: 'rejected',
      label: 'REJECTED_PROFILES',
      icon: 'pi pi-user-minus',
      visible: true,
      count: 0,
    },
  ];

  applications: ApplicationResponse[] = [];
  interviews: InterviewResponse[] = [];
  pushed: ApplicationResponse[] = [];
  accepted: ApplicationResponse[] = [];
  rejected: ApplicationResponse[] = [];

  constructor() {
    this.updateColumnCounts();
  }

  toggleColumnVisibility(key: string) {
    const col = this.columns.find((c) => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  getColumnItems(key: string): PipelineItem[] {
    switch (key) {
      case 'applications':
        return this.applications;
      case 'interviews':
        return this.interviews.filter((i) => i.status === 'SCHEDULED');
      case 'passed':
        return this.interviews.filter((i) => i.status === 'COMPLETED');
      case 'pushed':
        return this.pushed;
      case 'accepted':
        return this.accepted;
      case 'rejected':
        return this.rejected;
      default:
        return [];
    }
  }

  private updateColumnCounts() {
    this.columns.forEach((col) => {
      col.count = this.getColumnItems(col.key).length;
    });
  }
}
