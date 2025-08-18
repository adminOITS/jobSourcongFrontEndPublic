import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { take, finalize } from 'rxjs';
import {
  AttachmentRequest,
  AttachmentType,
  UploadRequest,
} from '../../models/attachment.models';
import { detectContentType } from '../../utils';
import { AttachmentService } from '../attachment/attachment.service';
import { MessageWrapperService } from '../message-wrapper.service';
import { CandidateAiProcessingHistoryService } from './candidate-ai-processing-history.service';
import { ProcessingStatus } from '../../models/candidate.models';

@Injectable({
  providedIn: 'root',
})
export class CandidateAiService {
  private readonly baseUrl =
    environment.domain + CANDIDATE_SERVICE_DOMAIN + '/ai';
  private http = inject(HttpClient);
  private attachmentService = inject(AttachmentService);
  private candidateAiProcessingHistoryService = inject(
    CandidateAiProcessingHistoryService
  );
  candidateAiProcessingHistory =
    this.candidateAiProcessingHistoryService._candidateAiProcessingHistory;
  private messageWrapper = inject(MessageWrapperService);

  private _isLoading = signal<boolean>(false);
  readonly isLoading = computed(() => this._isLoading());

  private _isDialogVisible = signal<boolean>(false);
  readonly isDialogVisible = computed(() => this._isDialogVisible());
  showDialog() {
    this._isDialogVisible.set(true);
  }
  hideDialog() {
    this._isDialogVisible.set(false);
  }
  setDialogVisible(visible: boolean) {
    this._isDialogVisible.set(visible);
  }
  processResume(file: File) {
    this._isLoading.set(true);
    const fileContentType = detectContentType(file);
    if (!fileContentType) {
      this._isLoading.set(false);
      this.messageWrapper.error('INVALID_FILE_TYPE');
      return;
    }
    const uploadRequest: UploadRequest = {
      contentType: fileContentType,
      attachmentType: AttachmentType.DOCUMENT,
    };
    this.attachmentService
      .getPresignedUrl(uploadRequest)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (!response || !response.url) {
            this._isLoading.set(false);
            this.messageWrapper.error('ERROR_UPLOADING_FILE');
            return;
          }
          const fileName = file.name;
          const attachment: AttachmentRequest = {
            fileName,
            contentType: fileContentType,
            size: `${Math.round(file.size / 1024)}KB`,
            key: response.key,
          };

          this.attachmentService
            .uploadFileToS3(response.url, file)
            .pipe(take(1))
            .subscribe({
              next: (response) => {
                this.http
                  .post<void>(
                    `${this.baseUrl}/generate`,

                    attachment
                  )
                  .pipe(
                    take(1),
                    finalize(() => {
                      this._isLoading.set(false);
                    })
                  )
                  .subscribe({
                    next: () => {
                      this.hideDialog();
                      this.messageWrapper.success('FILE_UPLOADED_SUCCESSFULLY');
                    },
                    error: (error) => {
                      this.messageWrapper.error('ERROR_UPLOADING_FILE');
                    },
                  });
              },
              error: (error) => {
                this._isLoading.set(false);

                this.messageWrapper.error('ERROR_UPLOADING_FILE');
              },
            });
        },
        error: (error) => {
          this._isLoading.set(false);
          this.messageWrapper.error('ERROR_UPLOADING_FILE');
        },
      });
  }

  retryResumeProcessing(trackId: string) {
    return this.http
      .put<void>(`${this.baseUrl}/generate/retry/${trackId}`, {})
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.candidateAiProcessingHistoryService.updateProcessingHistory(
            trackId,
            ProcessingStatus.IN_PROGRESS
          );
        },
      });
  }
}
