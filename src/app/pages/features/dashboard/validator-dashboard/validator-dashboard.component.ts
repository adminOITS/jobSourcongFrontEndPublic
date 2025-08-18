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
  selector: 'app-validator-dashboard',
  imports: [
    RecentOffersListComponent,
    StatsCardComponent,
    SkeletonModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './validator-dashboard.component.html',
  styles: ``,
})
export class ValidatorDashboardComponent {
  private dashboardStatsService = inject(DashboardStatsService);
  statistics = this.dashboardStatsService.dashboardStatsByValidator;
  isDashboardStatsLoading = this.dashboardStatsService.isDashboardStatsLoading;
  statsCards: StatsCardData[] = [];
  private authService = inject(AuthService);
  companyId = this.authService.currentUser()?.companyId;
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  constructor() {
    if (this.companyId) {
      this.dashboardStatsService.getDashboardStatsByValidator();
      effect(() => {
        if (this.statistics()) {
          this.prepareStatsCards();
        }
      });
    }
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
        value: this.statistics()!.assignedOffersCount ?? 0,
        icon: 'pi pi-briefcase',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor:
          'bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800',
      },
      {
        title: 'TOTAL_APPLICATIONS',
        value:
          this.statistics()!.assignedApplicationsStats.totalApplications ?? 0,
        icon: 'pi pi-file',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor:
          'bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800',
        // trend: {
        //   value: calculateGrowthPercentage(
        //     this.statistics()!.assignedApplicationsStats
        //       .newApplicationsThisMonth ?? 0,
        //     this.statistics()!.assignedApplicationsStats.totalApplications ?? 0
        //   ),
        //   isPositive:
        //     (this.statistics()!.assignedApplicationsStats
        //       .newApplicationsThisMonth ?? 0) > 0,
        //   period: 'FROM_LAST_MONTH',
        // },
      },

      {
        title: 'ACCEPTED_APPLICATIONS',
        value:
          this.statistics()!.assignedApplicationsStats
            .totalAcceptedApplications ?? 0,
        icon: 'pi pi-check',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor:
          'bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800',
      },
      {
        title: 'REJECTED_APPLICATIONS',
        value:
          this.statistics()!.assignedApplicationsStats
            .totalRejectedApplications ?? 0,
        icon: 'pi pi-times',
        iconColor: 'text-red-600 dark:text-red-400',
        bgColor:
          'bg-red-100 dark:bg-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-800',
      },
    ];
  }
}
