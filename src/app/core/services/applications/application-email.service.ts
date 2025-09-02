import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APPLICATION_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationEmailService {
  private readonly baseUrl = environment.domain + APPLICATION_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private _isApplicationEmailLoading = signal<boolean>(false);

  readonly isApplicationEmailLoading = computed(() =>
    this._isApplicationEmailLoading()
  );

  sendRefusalEmail(applicationId: string) {
    this._isApplicationEmailLoading.set(true);
    this.http
      .post(
        `${this.baseUrl}/${applicationId}/mailings/send-refusal-message`,
        {}
      )
      .pipe(finalize(() => this._isApplicationEmailLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageWrapper.success('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('EMAIL_SENT_FAILED');
        },
      });
  }

  sendAcceptanceEmail(applicationId: string) {
    this._isApplicationEmailLoading.set(true);
    this.http
      .post(
        `${this.baseUrl}/${applicationId}/mailings/send-congratulations`,
        {}
      )
      .pipe(finalize(() => this._isApplicationEmailLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageWrapper.success('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('EMAIL_SENT_FAILED');
        },
      });
  }

  sendApplicationEmail(applicationId: string) {
    this._isApplicationEmailLoading.set(true);
    this.http
      .post(
        `${this.baseUrl}/${applicationId}/mailings/send-application-email`,
        {}
      )
      .pipe(finalize(() => this._isApplicationEmailLoading.set(false)))
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
