import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MessageWrapperService {
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  success(messageKey: string, summaryKey: string = 'SUCCESS') {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(messageKey),
    });
  }

  error(messageKey: string, summaryKey: string = 'ERROR') {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(messageKey),
    });
  }
  warning(messageKey: string, summaryKey: string = 'WARNING') {
    this.messageService.add({
      severity: 'warn',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(messageKey),
    });
  }
}
