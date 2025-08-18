import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CandidatesDetailsProfilesTableComponent } from '../../../profiles/components/candidates-details-profiles-table/candidates-details-profiles-table.component';
import { AddEditCandidateProfileFormComponent } from '../../../profiles/components/add-edit-candidate-profile-form/add-edit-candidate-profile-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileFilterRequest } from '../../../../../core/models/profile.models';
import {
  DEFAULT_PROFILE_PAGE,
  DEFAULT_PROFILE_SIZE,
} from '../../../../../core/utils/constants';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { ProfilesFilterFormComponent } from '../../../profiles/components/profiles-filter-form/profiles-filter-form.component';
import { AddProfileDialogComponent } from '../../../profiles/components/add-profile-dialog/add-profile-dialog.component';

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
  constructor() {
    effect(() => {
      const request = this.request();
      this.profileService.getProfilesByCandidateId(request);
    });
  }
}
