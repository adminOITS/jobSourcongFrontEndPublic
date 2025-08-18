import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CANDIDATE_SERVICE_DOMAIN,
  INTERVIEW_SERVICE_DOMAIN,
} from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidateEmailService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private _isCandidateEmailLoading = signal<boolean>(false);
  private _isDialogVisible = signal<boolean>(false);

  readonly isCandidateEmailLoading = computed(() =>
    this._isCandidateEmailLoading()
  );

  readonly isDialogVisible = computed(() => this._isDialogVisible());

  setDialogVisible(value: boolean) {
    this._isDialogVisible.set(value);
  }

  sendCandidateGeneralEmail(
    candidateId: string,
    { message, subject }: { message: string; subject: string }
  ) {
    if (!candidateId || !message || !subject) {
      this.messageWrapper.error('PLEASE_FILL_ALL_FIELDS');
      return;
    }
    this._isCandidateEmailLoading.set(true);
    this.http
      .post(`${this.baseUrl}/${candidateId}/mailings/generic-message`, {
        message,
        subject,
      })
      .pipe(finalize(() => this._isCandidateEmailLoading.set(false)))
      .subscribe({
        next: () => {
          this.setDialogVisible(false);
          this.messageWrapper.success('EMAIL_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('EMAIL_SENT_FAILED');
        },
      });
  }
}
