import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { INTERVIEW_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterviewEmailService {
  private readonly baseUrl = environment.domain + INTERVIEW_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private _isInterviewEmailLoading = signal<boolean>(false);

  readonly isInterviewEmailLoading = computed(() =>
    this._isInterviewEmailLoading()
  );

  sendInterviewReminderEmail(interviewId: string) {
    this._isInterviewEmailLoading.set(true);
    this.http
      .post(`${this.baseUrl}/${interviewId}/mailings/send-reminder`, {})
      .pipe(finalize(() => this._isInterviewEmailLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageWrapper.success('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('EMAIL_SENT_FAILED');
        },
      });
  }

  sendInerviewConfirmationEmail(interviewId: string) {
    this._isInterviewEmailLoading.set(true);
    this.http
      .post(
        `${this.baseUrl}/${interviewId}/mailings/send-interview-confirmation`,
        {}
      )
      .pipe(finalize(() => this._isInterviewEmailLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageWrapper.success('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('EMAIL_SENT_FAILED');
        },
      });
  }
}
