import { Component, effect, inject } from '@angular/core';
import { CompanyDetailsMembersTabComponent } from '../components/company-details-members-tab/company-details-members-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-members',
  imports: [CompanyDetailsMembersTabComponent, TranslateModule],
  templateUrl: './company-members.component.html',
  styles: ``,
})
export class CompanyMembersComponent {
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService
        .get('COMPANY_MEMBERS_MANAGEMENT')
        .subscribe((res) => {
          this.appSettingsService.setTitle(res);
        });
    });
  }
}
