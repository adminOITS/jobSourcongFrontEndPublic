import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageWrapperService } from '../message-wrapper.service';
import { finalize } from 'rxjs';
import { ContactUsRequest } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  private readonly baseUrl = environment.domain;
  private http = inject(HttpClient);
  private messageWrapper = inject(MessageWrapperService);
  private _isContactUsLoading = signal<boolean>(false);

  readonly isContactUsLoading = computed(() => this._isContactUsLoading());

  sendContactUs(request: ContactUsRequest) {
    if (
      !request.name ||
      !request.email ||
      !request.phoneNumber ||
      !request.message ||
      !request.agreeToTerms
    ) {
      this.messageWrapper.error('PLEASE_FILL_ALL_FIELDS');
      return;
    }

    this._isContactUsLoading.set(true);
    this.http
      .post(`${this.baseUrl}/send-contact-us`, request)
      .pipe(finalize(() => this._isContactUsLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageWrapper.success('CONTACT_US_MESSAGE_SENT_SUCCESSFULLY');
        },
        error: () => {
          this.messageWrapper.error('CONTACT_US_MESSAGE_SEND_FAILED');
        },
      });
  }
}
