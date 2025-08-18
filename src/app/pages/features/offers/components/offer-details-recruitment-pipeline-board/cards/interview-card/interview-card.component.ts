import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewResponse } from '../../../../../../../core/models/interview.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-interview-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './interview-card.component.html',
})
export class InterviewCardComponent {
  @Input() interview!: InterviewResponse;

  getStatusClass(): string {
    switch (this.interview.status) {
      case 'SCHEDULED':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'RESCHEDULED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getTypeClass(): string {
    return this.interview.type === 'TECHNICAL'
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
  }
}
