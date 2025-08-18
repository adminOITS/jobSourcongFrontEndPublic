import { Component, effect, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../core/utils/constants';
import { ApplicationsFilterFormComponent } from '../components/applications-filter-form/applications-filter-form.component';
import { GlobalApplicationsTableComponent } from '../components/global-applications-table/global-applications-table.component';
import { ApplicationSearchRequest } from '../../../../core/models/application.models';
import { ApplicationService } from '../../../../core/services/applications/application.service';

@Component({
  selector: 'app-validator-pushed-applications-list',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    TranslateModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    ApplicationsFilterFormComponent,
    GlobalApplicationsTableComponent,
  ],
  templateUrl: './validator-pushed-applications-list.component.html',
  styles: ``,
})
export class ValidatorPushedApplicationsListComponent {
  home: MenuItem | undefined;
  request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  applicationService = inject(ApplicationService);
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService
        .get('VALIDATOR_PUSHED_APPLICATIONS_LIST')
        .subscribe((res) => {
          this.appSettingsService.setTitle(res);
        });
    });

    effect(() => {
      const request = this.request();
      this.applicationService.getApplicationsByValidator(request);
    });
  }
}
