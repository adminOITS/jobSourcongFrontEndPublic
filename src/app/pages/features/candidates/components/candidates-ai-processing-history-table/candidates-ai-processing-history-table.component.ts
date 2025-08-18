import {
  Component,
  inject,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CandidatesAiProcessingHistoryTableActionsMenuComponent } from '../candidates-ai-processing-history-table-actions-menu/candidates-ai-processing-history-table-actions-menu.component';
import { RippleModule } from 'primeng/ripple';
import { CandidateAiProcessingHistoryService } from '../../../../../core/services/candidate/candidate-ai-processing-history.service';
import {
  AiCandidateProcessingHistoryFilter,
  CandidateAIProcessingHistoryResponseDto,
  ProcessingStatus,
} from '../../../../../core/models/candidate.models';
import { Column } from '../../../../../core/types';
import { CommonModule } from '@angular/common';
import {
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE,
  DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE,
} from '../../../../../core/utils/constants';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidates-ai-processing-history-table',
  imports: [
    TableModule,
    TranslateModule,
    RippleModule,
    MenuModule,
    ConfirmDialogModule,
    CandidatesAiProcessingHistoryTableActionsMenuComponent,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './candidates-ai-processing-history-table.component.html',
  styles: ``,
})
export class CandidatesAiProcessingHistoryTableComponent {
  @ViewChild('candidatesAiProcessingHistoryTableActionsMenu')
  candidatesAiProcessingHistoryTableActionsMenu!: CandidatesAiProcessingHistoryTableActionsMenuComponent;
  @Input({ required: true })
  request!: WritableSignal<AiCandidateProcessingHistoryFilter>;
  private candidateAiProcessingHistoryService = inject(
    CandidateAiProcessingHistoryService
  );
  selectedCandidateAiProcessingHistoryResponseDto =
    signal<CandidateAIProcessingHistoryResponseDto | null>(null);
  candidateAiProcessingHistoryResponseDto =
    this.candidateAiProcessingHistoryService.candidateAiProcessingHistory;
  isLoading =
    this.candidateAiProcessingHistoryService
      .isCandidateAiProcessingHistoryLoading;

  columns: Column[] = [];
  private router = inject(Router);
  constructor() {
    this.columns = [
      { field: 'id', header: 'NUMBER', visible: true },
      { field: 'resume', header: 'RESUME', visible: true },
      { field: 'status', header: 'STATUS', visible: true },
      { field: 'processingDate', header: 'PROCESSING_DATE', visible: true },
      { field: 'processingTime', header: 'PROCESSING_TIME', visible: true },
      { field: 'candidate', header: 'CANDIDATE', visible: true },
      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }
  selectRowId(
    event: any,
    candidateAiProcessingHistoryResponseDto: CandidateAIProcessingHistoryResponseDto
  ) {
    this.selectedCandidateAiProcessingHistoryResponseDto.set(
      candidateAiProcessingHistoryResponseDto
    );
    if (this.candidatesAiProcessingHistoryTableActionsMenu) {
      this.candidatesAiProcessingHistoryTableActionsMenu.toggle(event);
    }
  }

  viewCandidate(candidateId: string) {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean);
    const baseSegment = segments.length > 0 ? segments[0] : '';

    const newUrl = `/${baseSegment}/candidates/${candidateId}`;
    window.open(newUrl, '_blank');
  }
  loadCandidatesLazy(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_PAGE;
    const size = event.rows
      ? event.rows
      : DEFAULT_CANDIDATE_AI_PROCESSING_HISTORY_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }

  getStatusClasses(status: ProcessingStatus): string {
    const baseClasses =
      'px-3 py-2 rounded-full text-xs font-medium inline-flex items-center gap-1';

    switch (status) {
      case ProcessingStatus.PENDING:
        return `${baseClasses} bg-yellow-100  text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case ProcessingStatus.IN_PROGRESS:
        return `${baseClasses} bg-blue-100  text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
      case ProcessingStatus.COMPLETED:
        return `${baseClasses} bg-green-100   text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case ProcessingStatus.FAILED:
        return `${baseClasses} bg-red-100  text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100  text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  }

  getStatusIcon(status: ProcessingStatus): string {
    switch (status) {
      case ProcessingStatus.PENDING:
        return 'pi pi-clock';
      case ProcessingStatus.IN_PROGRESS:
        return 'pi pi-spin pi-spinner';
      case ProcessingStatus.COMPLETED:
        return 'pi pi-check';
      case ProcessingStatus.FAILED:
        return 'pi pi-times';
      default:
        return 'pi pi-question';
    }
  }
}
