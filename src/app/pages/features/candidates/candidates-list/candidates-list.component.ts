import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CandidatesTableComponent } from '../components/candidates-table/candidates-table.component';
import { CandidatesFilterFormComponent } from '../components/candidates-filter-form/candidates-filter-form.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddEditCandidatePersonalInfoDialogComponent } from '../components/add-edit-candidate-personal-info-dialog/add-edit-candidate-personal-info-dialog.component';
import { CandidateService } from '../../../../core/services/candidate/candidate.service';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { AiCandidateUploadDialogComponent } from '../components/ai-candidate-upload-dialog/ai-candidate-upload-dialog.component';
import { CandidateSearchRequest } from '../../../../core/models/candidate.models';
import {
  DEFAULT_CANDIDATE_PAGE,
  DEFAULT_CANDIDATE_SIZE,
} from '../../../../core/utils/constants';
import { CandidateAiService } from '../../../../core/services/candidate/candidate-ai.service';
@Component({
  selector: 'app-candidates-list',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    TranslateModule,
    CandidatesTableComponent,
    CandidatesFilterFormComponent,
    AddEditCandidatePersonalInfoDialogComponent,
    AiCandidateUploadDialogComponent,
  ],
  templateUrl: './candidates-list.component.html',
  styles: ``,
})
export class CandidatesListComponent {
  candidateService = inject(CandidateService);
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  candidateAiService = inject(CandidateAiService);
  candidates = this.candidateService.candidatesComputed;
  request = signal<CandidateSearchRequest>({
    page: DEFAULT_CANDIDATE_PAGE,
    size: DEFAULT_CANDIDATE_SIZE,
  });

  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('CANDIDATES_LIST').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
    effect(() => {
      const request = this.request();
      this.candidateService.getCandidates(request);
    });
  }

  onGenerateCandidate() {
    this.candidateAiService.showDialog();
  }
}
