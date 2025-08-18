import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationResponse } from '../../../../../../../core/models/application.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './application-card.component.html',
})
export class ApplicationCardComponent {
  @Input() application!: ApplicationResponse;

  getStatusClass(): string {
    switch (this.application.status) {
      case 'NEW':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'WITHDRAWN_BY_CANDIDATE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'ACCEPTED_BY_VALIDATOR':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED_BY_VALIDATOR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PUSHED_TO_VALIDATOR':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CANCELLED_BY_RECRUITER':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CANCELLED_BY_HR':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'INVALIDATED_BY_HR':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'SUBMITTED_TO_HR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'REJECTED_BY_HR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
}
