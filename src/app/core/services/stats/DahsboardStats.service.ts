import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { STATS_SERVICE_DOMAIN } from '../../utils/constants';
import {
  DashboardStatistics,
  RecruiterDashboardStatisticsResponse,
  ValidatorDashboardStatisticsResponse,
} from '../../models/statistics.models';
import { finalize, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardStatsService {
  private readonly baseUrl = environment.domain + STATS_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private _dashboardStatsSignal = signal<DashboardStatistics | null>(null);
  private _dashboardStatsByCompanyIdSignal = signal<any | null>(null);
  private _dashboardStatsByRecruiterSignal =
    signal<RecruiterDashboardStatisticsResponse | null>(null);
  private _isDashboardStatsLoading = signal<boolean>(false);
  private _dashboardStatsByValidatorSignal =
    signal<ValidatorDashboardStatisticsResponse | null>(null);
  dashboardStats = computed(() => this._dashboardStatsSignal());
  dashboardStatsByCompanyId = computed(() =>
    this._dashboardStatsByCompanyIdSignal()
  );
  dashboardStatsByRecruiter = computed(() =>
    this._dashboardStatsByRecruiterSignal()
  );
  dashboardStatsByValidator = computed(() =>
    this._dashboardStatsByValidatorSignal()
  );
  isDashboardStatsLoading = computed(() => this._isDashboardStatsLoading());

  getDashboardStats() {
    this._isDashboardStatsLoading.set(true);
    return this.http
      .get<DashboardStatistics>(`${this.baseUrl}/async`)
      .pipe(
        take(1),
        finalize(() => this._isDashboardStatsLoading.set(false))
      )
      .subscribe((stats) => {
        this._dashboardStatsSignal.set(stats);
      });
  }
  getDashboardStatsByCompanyId(companyId: string) {
    this._isDashboardStatsLoading.set(true);
    return this.http
      .get<DashboardStatistics>(`${this.baseUrl}/companies/${companyId}`)
      .pipe(
        take(1),
        finalize(() => this._isDashboardStatsLoading.set(false))
      )
      .subscribe((stats) => {
        this._dashboardStatsByCompanyIdSignal.set(stats);
      });
  }
  getDashboardStatsByRecruiter() {
    this._isDashboardStatsLoading.set(true);
    return this.http
      .get<RecruiterDashboardStatisticsResponse>(`${this.baseUrl}/recruiter`)
      .pipe(
        take(1),
        finalize(() => this._isDashboardStatsLoading.set(false))
      )
      .subscribe((stats) => {
        this._dashboardStatsByRecruiterSignal.set(stats);
      });
  }
  getDashboardStatsByValidator() {
    this._isDashboardStatsLoading.set(true);
    return this.http
      .get<ValidatorDashboardStatisticsResponse>(`${this.baseUrl}/validator`)
      .pipe(
        take(1),
        finalize(() => this._isDashboardStatsLoading.set(false))
      )
      .subscribe((stats) => {
        this._dashboardStatsByValidatorSignal.set(stats);
      });
  }
}
