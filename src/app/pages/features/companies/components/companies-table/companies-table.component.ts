import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  ViewChild,
  signal,
  computed,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  CompanySearchRequest,
  CompanyShortResponse,
} from '../../../../../core/models/company.models';
import { Column } from '../../../../../core/types';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService } from 'primeng/api';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { DEFAULT_COMPANY_PAGE } from '../../../../../core/utils/constants';
import { DEFAULT_COMPANY_SIZE } from '../../../../../core/utils/constants';
import { CompaniesActionsMenuComponent } from '../companies-actions-menu/companies-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-companies-table',
  imports: [
    ButtonModule,
    MenuModule,
    TableModule,
    TranslateModule,
    CommonModule,
    CompaniesActionsMenuComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './companies-table.component.html',
  styles: ``,
})
export class CompaniesTableComponent {
  @ViewChild('table') table: Table | undefined;
  @Input({ required: true }) request!: WritableSignal<CompanySearchRequest>;
  selectedColumns: string[] = [];
  companyService = inject(CompanyService);
  confirmationService = inject(ConfirmationService);
  companies = this.companyService.companies;
  rows = computed(
    () => this.companies().totalItems / this.companies().totalPages
  );

  isLoading = this.companyService.isCompaniesLoading;

  columns: Column[] = [];

  constructor() {
    this.columns = [
      { field: 'name', header: 'COMPANY_NAME', visible: true },
      { field: 'sector', header: 'SECTOR', visible: true },
      { field: 'location', header: 'LOCATION', visible: true },
      { field: 'country', header: 'COUNTRY', visible: true },
      { field: 'contact', header: 'CONTACT', visible: true },
      { field: 'email', header: 'EMAIL', visible: true },
      { field: 'website', header: 'WEBSITE', visible: true },
      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }

  @ViewChild('companiesMenu') menu!: CompaniesActionsMenuComponent;
  selectedCompany = signal<CompanyShortResponse | null>(null);

  selectRowId(event: Event, company: CompanyShortResponse) {
    this.selectedCompany.set(company);
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  deleteCompany(): void {
    this.confirmationService.confirm({
      accept: () => {
        this.companyService.deleteCompany(this.selectedCompany()!.id);
      },
    });
  }
  ngOnInit(): void {}

  loadCompaniesLazy(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_COMPANY_PAGE;
    const size = event.rows ? event.rows : DEFAULT_COMPANY_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }
}
