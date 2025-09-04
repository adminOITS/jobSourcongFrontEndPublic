import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../core/services/applications/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf, DatePipe } from '@angular/common';
import { ApplicationStatusEnum } from '../../../../core/models/application.models';

@Component({
  selector: 'app-candidate-action',
  imports: [NgIf, TranslateModule, LoaderComponent],
  templateUrl: './candidate-action.component.html',
  styles: ``,
})
export class CandidateActionComponent implements OnInit {
  appSettingsService = inject(AppSettingsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  translateService = inject(TranslateService);
  applicationService = inject(ApplicationService);
  application = this.applicationService.applicationDetails;
  isApplicationLoading = this.applicationService.isApplicationLoading;
  applicationId!: string;
  actionStatus!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.applicationId = params['applicationId'];
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.actionStatus = queryParams['action'];
    });

    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('CANDIDATE_ACTION').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  ngOnInit() {
    if (this.applicationId) {
      // Validate action parameter
      if (!this.isValidAction(this.actionStatus)) {
        this.router.navigate(['/not-found']);
        return;
      }

      this.applicationService.getApplicationByIdPublic(this.applicationId);

      // Execute the action after loading
      if (this.actionStatus) {
        this.executeAction();
      }
    }
  }

  private isValidAction(action: string): boolean {
    const validActions = ['withdraw', 'interested', 'more-info'];
    return validActions.includes(action);
  }

  private executeAction() {
    switch (this.actionStatus) {
      case 'withdraw':
        this.withdrawApplication();
        break;
      case 'interested':
        this.markAsInterested();
        break;
      case 'more-info':
        this.requestMoreInfo();
        break;
      default:
        console.warn('Unknown action status:', this.actionStatus);
    }
  }

  withdrawApplication() {
    if (this.applicationId) {
      this.applicationService.withdrawByCandidate(this.applicationId);
    }
  }

  markAsInterested() {
    if (this.applicationId) {
      this.applicationService.interestedByCandidate(this.applicationId);
    }
  }

  requestMoreInfo() {
    if (this.applicationId) {
      this.applicationService.moreInfoRequestedByCandidate(this.applicationId);
    }
  }

  getStatusBadgeClasses(): string {
    const status = this.application()?.status;

    switch (status) {
      case ApplicationStatusEnum.ACCEPTED_BY_VALIDATOR:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ApplicationStatusEnum.REJECTED_BY_VALIDATOR:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ApplicationStatusEnum.PUSHED_TO_VALIDATOR:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ApplicationStatusEnum.SUBMITTED_TO_HR:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ApplicationStatusEnum.REJECTED_BY_HR:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ApplicationStatusEnum.CANCELLED_BY_HR:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case ApplicationStatusEnum.INVALIDATED_BY_HR:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case ApplicationStatusEnum.CANCELLED_BY_RECRUITER:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case ApplicationStatusEnum.WITHDRAWN_BY_CANDIDATE:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case ApplicationStatusEnum.INTERESTED_BY_CANDIDATE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ApplicationStatusEnum.MORE_INFO_REQUESTED_BY_CANDIDATE:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ApplicationStatusEnum.NEW:
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getActionButtonConfig(actionType: string) {
    switch (actionType) {
      case 'withdraw':
        return {
          label: 'WITHDRAWN_BY_CANDIDATE_Action',
          icon: 'pi-times-circle',
          class:
            'bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 border-red-200 dark:border-red-600',
          iconClass: 'text-red-600 dark:text-red-400',
        };
      case 'interested':
        return {
          label: 'INTERESTED_BY_CANDIDATE',
          icon: 'pi-heart',
          class:
            'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-600',
          iconClass: 'text-blue-600 dark:text-blue-400',
        };
      case 'more-info':
        return {
          label: 'MORE_INFO_REQUESTED_BY_CANDIDATE',
          icon: 'pi-info-circle',
          class:
            'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-200 border-yellow-200 dark:border-yellow-600',
          iconClass: 'text-yellow-600 dark:text-yellow-400',
        };
      default:
        return {
          label: 'ACTION',
          icon: 'pi-cog',
          class:
            'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600',
          iconClass: 'text-gray-600 dark:text-gray-400',
        };
    }
  }
}
