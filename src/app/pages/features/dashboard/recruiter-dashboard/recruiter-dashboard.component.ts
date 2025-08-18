import { Component, effect, inject } from '@angular/core';
import { DashboardStatsService } from '../../../../core/services/stats/DahsboardStats.service';
import { StatsCardData } from '../../../../core/types';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RecentOffersListComponent } from '../components/recent-offers-list/recent-offers-list.component';
import { StatsCardComponent } from '../components/stats-card/stats-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { calculateGrowthPercentage } from '../../../../core/utils';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hr-dashboard',
  imports: [
    RecentOffersListComponent,
    StatsCardComponent,
    SkeletonModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styles: ``,
})
export class RecruiterDashboardComponent {
  private dashboardStatsService = inject(DashboardStatsService);
  statistics = this.dashboardStatsService.dashboardStatsByRecruiter;
  isDashboardStatsLoading = this.dashboardStatsService.isDashboardStatsLoading;
  statsCards: StatsCardData[] = [];
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  constructor() {
    this.dashboardStatsService.getDashboardStatsByRecruiter();
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
    const stats = this.statistics()!;
    this.statsCards = [
      {
        title: 'TOTAL_ASSIGNED_OFFERS',
        value: stats.activeOffersCount ?? 0,
        icon: 'pi pi-briefcase',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor:
          'bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800',
      },
      {
        title: 'TOTAL_APPLICATIONS',
        value: stats.applicationsStats.totalApplications ?? 0,
        icon: 'pi pi-file',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor:
          'bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800',
        trend: {
          value: calculateGrowthPercentage(
            stats.applicationsStats.newApplicationsThisMonth ?? 0,
            stats.applicationsStats.totalApplications ?? 0
          ),
          isPositive:
            (stats.applicationsStats.newApplicationsThisMonth ?? 0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_CANDIDATES',
        value: stats.candidatesStats.totalCandidates ?? 0,
        icon: 'pi pi-users',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor:
          'bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-800',
        trend: {
          value: calculateGrowthPercentage(
            stats.candidatesStats.newCandidatesThisMonth ?? 0,
            stats.candidatesStats.totalCandidates ?? 0
          ),
          isPositive: (stats.candidatesStats.newCandidatesThisMonth ?? 0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
      {
        title: 'TOTAL_INTERVIEWS',
        value: stats.interviewsStats.totalInterviews ?? 0,
        icon: 'pi pi-calendar',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        bgColor:
          'bg-yellow-100 dark:bg-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800',
        trend: {
          value: calculateGrowthPercentage(
            stats.interviewsStats.newInterviewsThisMonth ?? 0,
            stats.interviewsStats.totalInterviews ?? 0
          ),
          isPositive: (stats.interviewsStats.newInterviewsThisMonth ?? 0) > 0,
          period: 'FROM_LAST_MONTH',
        },
      },
    ];
  }
}
