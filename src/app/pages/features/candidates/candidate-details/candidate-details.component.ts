import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { CandidateService } from '../../../../core/services/candidate/candidate.service';
import { CandidatesDetailsTabsComponent } from '../components/candidates-details-tabs/candidates-details-tabs.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { CandidatesSendGenericEmailDialogComponent } from '../components/candidates-send-generic-email-dialog/candidates-send-generic-email-dialog.component';
import { CandidateEmailService } from '../../../../core/services/candidate/candidate-email.service';
import { ButtonModule } from 'primeng/button';
@Component({
  imports: [
    BreadcrumbModule,
    CandidatesDetailsTabsComponent,
    TranslateModule,
    LoaderComponent,
    NgIf,
    CandidatesSendGenericEmailDialogComponent,
    ButtonModule,
  ],
  templateUrl: './candidate-details.component.html',
  styles: ``,
})
export class CandidateDetailsComponent {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  candidateService = inject(CandidateService);
  route = inject(ActivatedRoute);
  candidateEmailService = inject(CandidateEmailService);

  candidateId!: string;

  candidate = this.candidateService.candidateDetails;
  isCandidateLoading = this.candidateService.isCandidateLoading;
  constructor() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('CANDIDATE_DETAILS').subscribe((res) => {
        const title =
          this.candidate()?.firstName && this.candidate()?.lastName
            ? this.candidate()?.firstName + ' ' + this.candidate()?.lastName
            : '...';
        this.appSettingsService.setTitle(res + ' : ' + title);
      });
    });
  }
  ngOnInit() {
    this.candidateService.getCandidateById(this.candidateId);
  }
  showSendEmailDialog() {
    this.candidateEmailService.setDialogVisible(true);
  }
}
