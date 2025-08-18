import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StatsCardComponent } from '../components/stats-card';
import { RecentOffersListComponent } from '../components/recent-offers-list';
import { DashboardStatsService } from '../../../../core/services/stats/DahsboardStats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { StatsCardData } from '../../../../core/types';
import { calculateGrowthPercentage } from '../../../../core/utils';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hr-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    StatsCardComponent,
    RecentOffersListComponent,
    SkeletonModule,
  ],
  templateUrl: './hr-admin-dashboard.component.html',
  styles: ``,
})
export class HrAdminDashboardComponent {
  dashboardStatsService = inject(DashboardStatsService);
  statistics = this.dashboardStatsService.dashboardStats;
  isDashboardStatsLoading = this.dashboardStatsService.isDashboardStatsLoading;
  statsCards: StatsCardData[] = [];
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  constructor() {
    this.dashboardStatsService.getDashboardStats();
    effect(() => {
      if (this.statistics()) {
        this.prepareStatsCards();
      }
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('DASHBOARD').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  private prepareStatsCards() {
    if (!this.statistics()) return;

    this.statsCards = [
      {
        title: 'TOTAL_JOB_OFFERS',
        value: this.statistics()!.jobOfferStatistics.totalJobOffers ?? 0,
        icon: 'pi pi-briefcase',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor:
          'bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800',
        trend: {
          value: calculateGrowthPercentage(
            this.statistics()!.jobOfferStatistics.newJobOffersThisMonth ?? 0,
            this.statistics()!.jobOfferStatistics.totalJobOffers ?? 0
          ),
          isPositive:
            (this.statistics()!.jobOfferStatistics.newJobOffersThisMonth ?? 0) >
            0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_APPLICATIONS',
        value:
          this.statistics()!.jobOfferApplicationStatistics.totalApplications ??
          0,
        icon: 'pi pi-file',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor:
          'bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800',
        trend: {
          value: calculateGrowthPercentage(
            this.statistics()!.jobOfferApplicationStatistics
              .newApplicationsThisMonth ?? 0,
            this.statistics()!.jobOfferApplicationStatistics
              .totalApplications ?? 0
          ),
          isPositive:
            (this.statistics()!.jobOfferApplicationStatistics
              .newApplicationsThisMonth ?? 0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_CANDIDATES',
        value: this.statistics()!.candidatesStatistics.totalCandidates ?? 0,
        icon: 'pi pi-users',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor:
          'bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-800',
        trend: {
          value: calculateGrowthPercentage(
            this.statistics()!.candidatesStatistics.newCandidatesThisMonth ?? 0,
            this.statistics()!.candidatesStatistics.totalCandidates ?? 0
          ),
          isPositive:
            (this.statistics()!.candidatesStatistics.newCandidatesThisMonth ??
              0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_INTERVIEWS',
        value: this.statistics()!.interviewStatistics.totalInterviews ?? 0,
        icon: 'pi pi-calendar',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        bgColor:
          'bg-yellow-100 dark:bg-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800',
        trend: {
          value: calculateGrowthPercentage(
            this.statistics()!.interviewStatistics.newInterviewsThisMonth ?? 0,
            this.statistics()!.interviewStatistics.totalInterviews ?? 0
          ),
          isPositive:
            (this.statistics()!.interviewStatistics.newInterviewsThisMonth ??
              0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_COMPANIES',
        value: this.statistics()!.companiesStatistics.totalCompanies ?? 0,
        icon: 'pi pi-building',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        bgColor:
          'bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800',
        trend: {
          value: calculateGrowthPercentage(
            this.statistics()!.companiesStatistics.newCompaniesThisMonth ?? 0,
            this.statistics()!.companiesStatistics.totalCompanies ?? 0
          ),
          isPositive:
            (this.statistics()!.companiesStatistics.newCompaniesThisMonth ??
              0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_PROFILES',
        value: this.statistics()!.candidatesStatistics.totalProfiles ?? 0,
        icon: 'pi pi-id-card',
        iconColor: 'text-pink-600 dark:text-pink-400',
        bgColor:
          'bg-pink-100 dark:bg-pink-900 group-hover:bg-pink-200 dark:group-hover:bg-pink-800',
        trend: {
          value: calculateGrowthPercentage(
            0, // No new profiles this month data available
            this.statistics()!.candidatesStatistics.totalProfiles ?? 0
          ),
          isPositive: true,
          period: 'FROM_LAST_MONTH',
        },
      },
    ];
  }
}
