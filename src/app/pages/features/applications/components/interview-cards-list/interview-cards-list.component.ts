import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  InterviewResponse,
  InterviewStatus,
  InterviewType,
} from '../../../../../core/models/interview.models';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { timeAgo } from '../../../../../core/utils';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../../routes';

@Component({
  selector: 'app-interview-cards-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './interview-cards-list.component.html',
  styleUrls: ['./interview-cards-list.component.css'],
})
export class InterviewCardsListComponent implements OnInit, OnDestroy {
  @Input() applicationId!: string;

  private interviewService = inject(InterviewService);
  private router = inject(Router);

  // Computed properties from service
  readonly interviews = computed(() => this.interviewService.interviews().data);
  readonly isLoading = computed(() =>
    this.interviewService.isInterviewsLoading()
  );
  readonly hasInterviews = computed(() => this.interviews().length > 0);

  ngOnInit() {
    if (this.applicationId) {
      this.loadInterviews();
    }
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  private loadInterviews() {
    this.interviewService.getInterviewsByApplicationId(this.applicationId);
  }

  getStatusIcon(status: InterviewStatus): string {
    switch (status) {
      case 'SCHEDULED':
        return 'pi pi-calendar';
      case 'IN_PROGRESS':
        return 'pi pi-clock';
      case 'COMPLETED':
        return 'pi pi-check-circle';
      case 'CANCELLED':
        return 'pi pi-times-circle';
      case 'RESCHEDULED':
        return 'pi pi-refresh';
      case 'NO_SHOW':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-question-circle';
    }
  }

  getStatusColor(status: InterviewStatus): string {
    switch (status) {
      case 'SCHEDULED':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'IN_PROGRESS':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'COMPLETED':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'CANCELLED':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'RESCHEDULED':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'NO_SHOW':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  }

  getTypeIcon(type: InterviewType): string {
    switch (type) {
      case 'TECHNICAL':
        return 'pi pi-code';
      case 'HR':
        return 'pi pi-users';
      default:
        return 'pi pi-comments';
    }
  }

  getTypeColor(type: InterviewType): string {
    switch (type) {
      case 'TECHNICAL':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20';
      case 'HR':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  }

  formatDateTime(dateTime: Date | string | undefined): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  }

  getTimeAgo(dateTime: Date | string | undefined): string {
    if (!dateTime) return '';
    return timeAgo(new Date(dateTime).toISOString());
  }

  openMeetingLink(meetingLink: string) {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  }

  viewInterview(interview: InterviewResponse) {
    const currentRoute = this.router.url;
    const url = currentRoute.split('/');
    this.router.navigate([
      `${url[1]}/${ROUTES.INTERVIEW.LIST}/${interview!.id}`,
    ]);
  }
}
