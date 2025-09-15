import { Component, computed, effect, inject } from '@angular/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../core/services/applications/application.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { ApplicationStatusEnum } from '../../../../core/models/application.models';
import { ApplicationCommentActionDialogComponent } from '../components/application-comment-action-dialog/application-comment-action-dialog.component';
import { ApplicationPushedToClientValidationReviewTabsComponent } from '../components/application-pushed-to-client-validation-review-tabs/application-pushed-to-client-validation-review-tabs.component';

@Component({
  selector: 'app-application-pushed-to-client-validation-review',
  imports: [
    ApplicationPushedToClientValidationReviewTabsComponent,
    NgIf,
    TranslateModule,
    LoaderComponent,
    ApplicationCommentActionDialogComponent,
  ],
  templateUrl:
    './application-pushed-to-client-validation-review.component.html',
  styles: ``,
})
export class ApplicationPushedToClientValidationReviewComponent {
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
      this.applicationService.getApplicationByIdPublic(this.applicationId);
    }
  }

  disabledValidateButton = computed(() => {
    return (
      this.application()?.status !== ApplicationStatusEnum.PUSHED_TO_CLIENT &&
      this.application()?.status !== ApplicationStatusEnum.REJECTED_BY_CLIENT
    );
  });
  disabledRejectButton = computed(() => {
    return (
      this.application()?.status !== ApplicationStatusEnum.PUSHED_TO_CLIENT &&
      this.application()?.status !== ApplicationStatusEnum.VALIDATED_BY_CLIENT
    );
  });

  validateApplication() {
    if (this.applicationId) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'VALIDATED_BY_CLIENT_Action',
        commentRequired: true,
        actionFunction: (request) => {
          this.applicationService.validateByClient(this.applicationId, request);
        },
      });
    }
  }

  rejectApplication() {
    if (this.applicationId) {
      this.applicationService.openApplicationCommentDialog({
        actionLabel: 'REJECTED_BY_CLIENT_Action',
        commentRequired: true,
        actionFunction: (request) => {
          this.applicationService.rejectByClient(this.applicationId, request);
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
      case ApplicationStatusEnum.PUSHED_TO_CLIENT:
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
      case ApplicationStatusEnum.VALIDATED_BY_CLIENT:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ApplicationStatusEnum.REJECTED_BY_CLIENT:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ApplicationStatusEnum.INVALIDATED_BY_CLIENT:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case ApplicationStatusEnum.UNPUSHED_BY_CLIENT:
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case ApplicationStatusEnum.NEW:
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
}
