import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ATTACHMENT_SERVICE_DOMAIN } from '../../utils/constants';
import {
  AttachmentRequest,
  AttachmentResponse,
  AttachmentUploadResponse,
  UploadRequest,
} from '../../models/attachment.models';
import { filter, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly baseUrl = environment.domain + ATTACHMENT_SERVICE_DOMAIN;
  private http = inject(HttpClient);

  addCompanyLogoMetaData(
    attachment: AttachmentRequest
  ): Observable<AttachmentResponse> {
    return this.http.post<AttachmentResponse>(
      `${this.baseUrl}/upload/logo`,
      attachment
    );
  }
  updateCompanyLogoMetaData(
    attachment: AttachmentRequest
  ): Observable<AttachmentResponse> {
    return this.http.put<AttachmentResponse>(
      `${this.baseUrl}/upload/logo`,
      attachment
    );
  }
  addDocumentMetaData(
    attachment: AttachmentRequest
  ): Observable<AttachmentResponse> {
    return this.http.post<AttachmentResponse>(
      `${this.baseUrl}/upload/document`,
      attachment
    );
  }
  updateDocumentMetaData(
    attachment: AttachmentRequest
  ): Observable<AttachmentResponse> {
    return this.http.put<AttachmentResponse>(
      `${this.baseUrl}/upload/document`,
      attachment
    );
  }

  uploadFileToS3(url: string, file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': file.type, // e.g., image/png
    });
    return this.http.put(url, file, { headers });
  }

  getPresignedUrl(
    uploadRequest: UploadRequest
  ): Observable<AttachmentUploadResponse> {
    return this.http
      .post<AttachmentUploadResponse>(
        `${this.baseUrl}/upload-url`,
        uploadRequest
      )
      .pipe(take(1));
  }
}
