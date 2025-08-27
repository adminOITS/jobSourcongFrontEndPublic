import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CandidatesDetailsProfilesTableComponent } from '../../../profiles/components/candidates-details-profiles-table/candidates-details-profiles-table.component';
import { AddEditCandidateProfileFormComponent } from '../../../profiles/components/add-edit-candidate-profile-form/add-edit-candidate-profile-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileFilterRequest } from '../../../../../core/models/profile.models';
import {
  DEFAULT_PROFILE_PAGE,
  DEFAULT_PROFILE_SIZE,
} from '../../../../../core/utils/constants';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { ProfilesFilterFormComponent } from '../../../profiles/components/profiles-filter-form/profiles-filter-form.component';
import { AddProfileDialogComponent } from '../../../profiles/components/add-profile-dialog/add-profile-dialog.component';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';

@Component({
  selector: 'app-candidates-details-profiles-tab',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CandidatesDetailsProfilesTableComponent,
    TranslateModule,
    ProfilesFilterFormComponent,
    AddProfileDialogComponent,
  ],
  templateUrl: './candidates-details-profiles-tab.component.html',
  styles: [],
})
export class CandidatesDetailsProfilesTabComponent {
  request = signal<ProfileFilterRequest>({
    page: DEFAULT_PROFILE_PAGE,
    size: DEFAULT_PROFILE_SIZE,
  });
  profileService = inject(ProfileService);
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  candidateService = inject(CandidateService);
  candidate = this.candidateService.candidateDetails;
  constructor() {
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
    effect(() => {
      const request = this.request();
      this.profileService.getProfilesByCandidateId(request);
    });
  }
}
