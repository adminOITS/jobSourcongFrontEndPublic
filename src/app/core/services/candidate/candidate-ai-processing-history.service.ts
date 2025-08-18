import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AiCandidateProcessingHistoryFilter,
  CandidateAIProcessingHistoryResponseDto,
  CandidateAiProcessingStatisticsResponse,
  ProcessingStatus,
} from '../../models/candidate.models';
import { filter, finalize, take } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { AttachmentType, ContentType } from '../../models/attachment.models';

@Injectable({
  providedIn: 'root',
})
export class CandidateAiProcessingHistoryService {
  private readonly baseUrl =
    environment.domain + CANDIDATE_SERVICE_DOMAIN + '/ai-processing';
  private http = inject(HttpClient);
  private _isCandidateAiProcessingHistoryLoading = signal<boolean>(false);
  _candidateAiProcessingHistory = signal<
    PaginatedResponse<CandidateAIProcessingHistoryResponseDto>
  >({
    data: [],
    totalItems: 10,
    totalPages: 1,
    currentPage: 1,
  });

  private _candidateAiProcessingStatistics =
    signal<CandidateAiProcessingStatisticsResponse | null>(null);
  private _isCandidateAiProcessingStatisticsLoading = signal<boolean>(false);

  readonly candidateAiProcessingHistory = computed(() =>
    this._candidateAiProcessingHistory()
  );
  readonly isCandidateAiProcessingHistoryLoading = computed(() =>
    this._isCandidateAiProcessingHistoryLoading()
  );
  readonly candidateAiProcessingStatistics = computed(() =>
    this._candidateAiProcessingStatistics()
  );
  readonly isCandidateAiProcessingStatisticsLoading = computed(() =>
    this._isCandidateAiProcessingStatisticsLoading()
  );
  updateProcessingHistory(trackId: string, status: ProcessingStatus) {
    this._candidateAiProcessingHistory.set({
      ...this._candidateAiProcessingHistory(),
      data: this._candidateAiProcessingHistory().data.map((item) =>
        item.id === trackId ? { ...item, status: status } : item
      ),
    });
  }

  getFilteredHistory(filters?: AiCandidateProcessingHistoryFilter) {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    this._isCandidateAiProcessingHistoryLoading.set(true);
    return this.http
      .get<PaginatedResponse<CandidateAIProcessingHistoryResponseDto>>(
        `${this.baseUrl}/history`,
        { params }
      )
      .pipe(
        take(1),
        finalize(() => this._isCandidateAiProcessingHistoryLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this._candidateAiProcessingHistory.set(res);
        },
      });
  }

  getAllStatistics() {
    this._isCandidateAiProcessingStatisticsLoading.set(true);
    return this.http
      .get<CandidateAiProcessingStatisticsResponse>(
        `${this.baseUrl}/statistics/all`
      )
      .pipe(
        take(1),
        finalize(() =>
          this._isCandidateAiProcessingStatisticsLoading.set(false)
        )
      )
      .subscribe((res) => {
        this._candidateAiProcessingStatistics.set(res);
      });
  }

  getStatisticsByCompany(companyId: string) {
    this._isCandidateAiProcessingStatisticsLoading.set(true);
    return this.http
      .get<CandidateAiProcessingStatisticsResponse>(
        `${this.baseUrl}/statistics/by-company/${companyId}`
      )
      .pipe(
        take(1),
        finalize(() =>
          this._isCandidateAiProcessingStatisticsLoading.set(false)
        )
      )
      .subscribe((res) => {
        this._candidateAiProcessingStatistics.set(res);
      });
  }

  getStatisticsByConnectedUser() {
    this._isCandidateAiProcessingStatisticsLoading.set(true);
    return this.http
      .get<CandidateAiProcessingStatisticsResponse>(
        `${this.baseUrl}/statistics/by-user`
      )
      .pipe(
        take(1),
        finalize(() =>
          this._isCandidateAiProcessingStatisticsLoading.set(false)
        )
      )
      .subscribe((res) => {
        this._candidateAiProcessingStatistics.set(res);
      });
  }

  emptyCandidateAiProcessingStatistics() {
    this._candidateAiProcessingStatistics.set(null);
  }

  emptyCandidateAiProcessingHistory() {
    this._candidateAiProcessingHistory.set({
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
    });
  }
}
