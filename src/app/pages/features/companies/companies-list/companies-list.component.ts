import { Component, effect, inject, signal } from '@angular/core';
import { CompaniesFilterFormComponent } from '../components/companies-filter-form/companies-filter-form.component';
import { CompaniesTableComponent } from '../components/companies-table/companies-table.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompaniesCardsViewComponent } from '../components/companies-cards-view/companies-cards-view.component';
import { CommonModule } from '@angular/common';
import { CompanySearchRequest } from '../../../../core/models/company.models';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AddCompanyDialogComponent } from '../components/add-company-dialog/add-company-dialog.component';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import {
  DEFAULT_COMPANY_PAGE,
  DEFAULT_COMPANY_SIZE,
} from '../../../../core/utils/constants';

@Component({
  selector: 'app-companies-list',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    TranslateModule,
    CompaniesFilterFormComponent,
    CompaniesTableComponent,
    CompaniesCardsViewComponent,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    AddCompanyDialogComponent,
  ],
  templateUrl: './companies-list.component.html',
  styles: ``,
})
export class CompaniesListComponent {
  home: MenuItem | undefined;
  isTableView: boolean = true;
  selectedView: string = 'table';
  request = signal<CompanySearchRequest>({
    page: DEFAULT_COMPANY_PAGE,
    size: DEFAULT_COMPANY_SIZE,
  });
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  companyService = inject(CompanyService);
  companies = this.companyService.companies;
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('COMPANIES_LIST').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });

    effect(() => {
      const request = this.request();
      this.companyService.getAllCompanies(request);
    });
  }

  ChangeView(view: string): void {
    this.selectedView = view;
    this.isTableView = view === 'table';
  }
  viewOptions = [
    {
      icon: 'pi pi-th-large',
      value: 'table',
    },
    {
      icon: 'pi pi-list',
      value: 'list',
    },
  ];

  showAddEditCompanyDialog() {
    this.companyService.openAddCompanyDialog();
  }
}
