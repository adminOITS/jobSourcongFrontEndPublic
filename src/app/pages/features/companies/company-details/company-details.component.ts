import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyDetailsTabsComponent } from '../components/company-details-tabs/company-details-tabs.component';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { effect, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CompanyService } from '../../../../core/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CompanyDetailsTabsComponent,
    MenuModule,
    ButtonModule,
    LoaderComponent,
    NgIf,
  ],
  templateUrl: './company-details.component.html',
})
export class CompanyDetailsComponent implements OnInit {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  companyService = inject(CompanyService);
  company = this.companyService.companyDetails;
  isCompanyLoading = this.companyService.isCompanyLoading;
  items: MenuItem[] = [];
  route = inject(ActivatedRoute);
  companyId!: string;
  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('COMPANY_DETAILS').subscribe((res) => {
        const title = this.company()?.name ? this.company()?.name : '...';
        this.appSettingsService.setTitle(res + ' : ' + title);
      });
    });
  }
  ngOnInit() {
    this.companyService.getCompanyById(this.companyId);
  }
}
