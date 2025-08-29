import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import {
  InterviewDataRequest,
  InterviewDataResponse,
} from '../../models/interview.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { INTERVIEW_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../routes';
@Injectable({
  providedIn: 'root',
})
export class InterviewDataService {
  private readonly baseUrl = environment.domain + INTERVIEW_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private _interviewData = signal<InterviewDataResponse | null>(null);
  private _interviewDataLoading = signal<boolean>(false);
  private _interviewDataActionLoading = signal<boolean>(false);

  readonly interviewData = computed(() => this._interviewData());
  readonly interviewDataLoading = computed(() => this._interviewDataLoading());
  readonly interviewDataActionLoading = computed(() =>
    this._interviewDataActionLoading()
  );
  private messageService = inject(MessageWrapperService);
  private router = inject(Router);
  constructor() {}
  emptyInterviewData() {
    this._interviewData.set(null);
  }

  getInterviewData(interviewDataId: string) {
    this.emptyInterviewData();
    const url = `${this.baseUrl}/${interviewDataId}/data`;
    this._interviewDataLoading.set(true);
    this.http
      .get<InterviewDataResponse>(url)
      .pipe(
        take(1),
        finalize(() => this._interviewDataLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this._interviewData.set(res);
        },
        error: (err) => {
          // this.router.navigate(
          //   ['/interviews/' + interviewDataId + '/not-found'],
          //   {
          //     state: { message: 'INTERVIEW_DATA_NOT_FOUND' },
          //   }
          // );
        },
      });
  }

  saveInterviewData(data: InterviewDataRequest, interviewId: string) {
    const url = `${this.baseUrl}/${interviewId}/data`;
    this._interviewDataActionLoading.set(true);
    this.http
      .post<InterviewDataResponse>(url, data)
      .pipe(
        take(1),
        finalize(() => this._interviewDataActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          const currentUrl = this.router.url;
          const url = currentUrl.split('/');
          this.router.navigate([
            `${url[1]}/${ROUTES.INTERVIEW.LIST}/${interviewId}`,
          ]);
          this.messageService.success('INTERVIEW_DATA_SAVE_SUCCESSFULLY');
        },
        error: (err) => {
          this.messageService.error('INTERVIEW_DATA_SAVE_FAILED');
        },
      });
  }
  updateInterviewData(
    data: InterviewDataRequest,
    interviewId: string,
    interviewDataId: string
  ) {
    const url = `${this.baseUrl}/${interviewId}/data/${interviewDataId}`;
    this._interviewDataActionLoading.set(true);
    this.http
      .put<InterviewDataResponse>(url, data)
      .pipe(
        take(1),
        finalize(() => this._interviewDataActionLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          const currentUrl = this.router.url;
          const url = currentUrl.split('/');
          this.router.navigate([
            `${url[1]}/${ROUTES.INTERVIEW.LIST}/${interviewId}`,
          ]);
          this.messageService.success('INTERVIEW_DATA_UPDATE_SUCCESSFULLY');
        },
        error: (err) => {
          this.messageService.error('INTERVIEW_DATA_UPDATE_FAILED');
        },
      });
  }

  deleteInterviewData(interviewDataId: string, interviewId: string) {
    const url = `${this.baseUrl}/${interviewDataId}/data`;
    this._interviewDataActionLoading.set(true);
    this.http
      .delete(url)
      .pipe(
        take(1),
        finalize(() => this._interviewDataActionLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.messageService.success('INTERVIEW_DATA_DELETED_SUCCESSFULLY');
          const currentUrl = this.router.url;
          const pageUrl = currentUrl.split('/');
          this.router.navigate([
            `${pageUrl[1]}/${ROUTES.INTERVIEW.LIST}/${interviewId}`,
          ]);
        },
        error: (err) => {
          this.messageService.error('INTERVIEW_DATA_DELETE_FAILED');
        },
      });
  }
}
