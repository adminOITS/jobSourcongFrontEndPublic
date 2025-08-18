import { Injectable, signal, computed, inject } from '@angular/core';
import { SocialLinksResponse } from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { CandidateService } from './candidate.service';
@Injectable({
  providedIn: 'root',
})
export class CandidateSocialLinksService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private dialogVisible = signal<boolean>(false);
  private selectedLinks = signal<SocialLinksResponse | null>(null);
  private _isSocialLinksLoading = signal<boolean>(false);

  isDialogVisibleComputed = computed(() => this.dialogVisible());
  selectedLinksComputed = computed(() => this.selectedLinks());
  isSocialLinksLoading = computed(() => this._isSocialLinksLoading());

  messageWrapper = inject(MessageWrapperService);
  candidateService = inject(CandidateService);
  candidateSocialLinks = this.candidateService.candidateSocialLinks;

  openDialog(links: SocialLinksResponse) {
    this.selectedLinks.set(links);
    this.dialogVisible.set(true);
  }

  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedLinks.set(null);
  }

  setDialogVisible(visible: boolean) {
    this.dialogVisible.set(visible);
    if (!visible) {
      this.selectedLinks.set(null);
    }
  }

  updateLinks(links: SocialLinksResponse) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/social-links`;
    this._isSocialLinksLoading.set(true);
    return this.http
      .put<SocialLinksResponse>(url, links)
      .pipe(
        take(1),
        finalize(() => {
          this._isSocialLinksLoading.set(false);
          this.closeDialog();
        })
      )
      .subscribe({
        next: (links) => {
          this.messageWrapper.success('SOCIAL_LINKS_UPDATED_SUCCESSFULLY');
          this.candidateSocialLinks.set(links);
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_UPDATING_SOCIAL_LINKS');
        },
      });
  }
}
