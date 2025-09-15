import { Component, effect, inject, signal } from '@angular/core';
import { OfferDetailsApplicationsTabTableComponent } from '../../../applications/components/offer-details-applications-tab-table/offer-details-applications-tab-table.component';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditInterviewScheduleDialogComponent } from '../../../interviews/components/add-edit-interview-schedule-dialog/add-edit-interview-schedule-dialog.component';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsFilterFormComponent } from '../../../applications/components/applications-filter-form/applications-filter-form.component';
import {
  ApplicationSearchRequest,
  ApplicationResponse,
} from '../../../../../core/models/application.models';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../../core/utils/constants';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { TagModule } from 'primeng/tag';
import { ROUTES } from '../../../../../routes';

@Component({
  selector: 'app-offer-details-applications-tab',
  imports: [
    OfferDetailsApplicationsTabTableComponent,
    CommonModule,
    FloatLabelModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    AddEditInterviewScheduleDialogComponent,
    ApplicationsFilterFormComponent,
    HasRoleDirective,
    TagModule,
  ],
  templateUrl: './offer-details-applications-tab.component.html',
  styles: ``,
})
export class OfferDetailsApplicationsTabComponent {
  applicationService = inject(ApplicationService);
  route = inject(ActivatedRoute);
  request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  offerId: string = '';
  activeTab: 'company_applications' | 'jobSourcing_suggestions' =
    'company_applications';

  constructor() {
    this.route.params.subscribe((params) => {
      this.offerId = params['offerId'];
    });
    effect(() => {
      const filters = this.request();
      if (this.activeTab === 'company_applications') {
        this.applicationService.getApplicationsByJobOfferId(
          this.offerId,
          filters
        );
      } else if (this.activeTab === 'jobSourcing_suggestions') {
        this.loadClientPushedApplications();
      }
    });
  }

  ngOnInit() {
    this.applicationService.getApplicationsByJobOfferId(this.offerId);
  }

  loadClientPushedApplications() {
    this.applicationService.getClientPushedApplicationsByJobOfferId(
      this.offerId
    );
  }

  getApplicationStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'PUSHED_TO_CLIENT':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
      case 'ACCEPTED_BY_VALIDATOR':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'REJECTED_BY_VALIDATOR':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  }

  getApplicationStatusDisplayText(status: string): string {
    switch (status) {
      case 'PUSHED_TO_CLIENT':
        return 'JOB_SOURCING_SUGGESTION';
      case 'VALIDATED_BY_CLIENT':
        return 'VALIDATED';
      case 'REJECTED_BY_CLIENT':
        return 'REJECTED';

      default:
        return status;
    }
  }

  trackByApplicationId(
    index: number,
    application: ApplicationResponse
  ): string {
    return application.id;
  }

  private router = inject(Router);
  viewApplicationDetails(application: ApplicationResponse): void {
    this.router.navigate(['/hr/applications/suggestion', application.id]);
  }
}
