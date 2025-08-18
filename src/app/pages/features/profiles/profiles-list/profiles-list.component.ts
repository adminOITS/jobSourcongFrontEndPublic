import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { ProfileService } from '../../../../core/services/candidate/profile.service';
import { ProfileFilterRequest } from '../../../../core/models/profile.models';
import {
  DEFAULT_PROFILE_PAGE,
  DEFAULT_PROFILE_SIZE,
} from '../../../../core/utils/constants';
@Component({
  selector: 'app-profiles-list',
  imports: [TranslateModule],
  templateUrl: './profiles-list.component.html',
  styles: ``,
})
export class ProfilesListComponent {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  profileService = inject(ProfileService);
  request = signal<ProfileFilterRequest>({
    page: DEFAULT_PROFILE_PAGE,
    size: DEFAULT_PROFILE_SIZE,
  });

  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('PROFILES_LIST').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
    // effect(() => {
    //   const request = this.request();
    //   this.profileService.getProfiles(request);
    // });
  }
}
