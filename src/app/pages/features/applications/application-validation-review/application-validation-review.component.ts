import { Component, computed, effect, inject } from '@angular/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationValidationReviewTabsComponent } from '../components/application-validation-review-tabs/application-validation-review-tabs.component';
import { ApplicationService } from '../../../../core/services/applications/application.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf, DatePipe } from '@angular/common';
import { ApplicationStatusEnum } from '../../../../core/models/application.models';
import { ApplicationCommentActionDialogComponent } from '../components/application-comment-action-dialog/application-comment-action-dialog.component';

@Component({
  selector: 'app-application-validation-review',
  imports: [
    ApplicationValidationReviewTabsComponent,
    NgIf,
    DatePipe,
    TranslateModule,
    LoaderComponent,
    ApplicationCommentActionDialogComponent,
  ],
  templateUrl: './application-validation-review.component.html',
  styles: ``,
})
export class ApplicationValidationReviewComponent {
  appSettingsService = inject(AppSettingsService);
  route = inject(ActivatedRoute);
  translateService = inject(TranslateService);
  applicationService = inject(ApplicationService);
  application = this.applicationService.applicationDetails;
  isApplicationLoading = this.applicationService.isApplicationLoading;
  applicationId!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.applicationId = params['applicationId'];
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService
        .get('APPLICATION_VALIDATION_REVIEW')
        .subscribe((res) => {
          this.appSettingsService.setTitle(res);
        });
    });
  }

  ngOnInit() {
    if (this.applicationId) {
      this.applicationService.getApplicationById(this.applicationId);
    }
  }

  viewResume() {
    const resumeAttachment = this.application()?.profile?.resumeAttachment;
    if (resumeAttachment?.url) {
      window.open(resumeAttachment.url, '_blank');
    }
  }
  disabledActionsButton = computed(() => {
    return (
      this.application()?.status !== ApplicationStatusEnum.PUSHED_TO_VALIDATOR
    );
  });

  validateApplication() {
    if (this.applicationId) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'ACCEPTED_BY_VALIDATOR_Action',
        commentRequired: true,
        actionFunction: (request) => {
          this.applicationService.acceptByValidator(
            this.applicationId,
            request
          );
        },
      });
    }
  }

  rejectApplication() {
    if (this.applicationId) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'REJECTED_BY_VALIDATOR_Action',
        commentRequired: true,
        actionFunction: (request) => {
          this.applicationService.rejectByValidator(
            this.applicationId,
            request
          );
        },
      });
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
      case ApplicationStatusEnum.NEW:
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
}
