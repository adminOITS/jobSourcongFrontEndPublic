import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import {
  DEFAULT_PROFILE_PAGE,
  DEFAULT_PROFILE_SIZE,
} from '../../../../../core/utils/constants';
import { ProfileFilterRequest } from '../../../../../core/models/profile.models';
import { OfferDetailsProfilesTableComponent } from '../../../profiles/components/offer-details-profiles-table/app-offer-details-profiles-table.component';
import { ProfilesFilterFormComponent } from '../../../profiles/components/profiles-filter-form/profiles-filter-form.component';

import { OfferAtsProfilesListComponent } from '../offer-ats-profiles-list';

@Component({
  selector: 'app-offer-details-profiles-tab',
  standalone: true,
  imports: [
    CommonModule,
    FloatLabelModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    OfferDetailsProfilesTableComponent,
    ProfilesFilterFormComponent,
    OfferAtsProfilesListComponent,
  ],
  templateUrl: './offer-details-profiles-tab.component.html',
  styles: ``,
})
export class OfferDetailsProfilesTabComponent implements OnInit {
  @Input() offerId!: string;

  activeTab: 'all' | 'ats' = 'all';

  request = signal<ProfileFilterRequest>({
    page: DEFAULT_PROFILE_PAGE,
    size: DEFAULT_PROFILE_SIZE,
  });
  profileService = inject(ProfileService);
  constructor() {
    effect(() => {
      const request = this.request();
      this.profileService.getProfiles(request);
    });
  }
  ngOnInit() {
    this.profileService.getProfiles(this.request());
  }
}
