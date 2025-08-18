import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { H_R_Response } from '../../../../../core/models/hr.models';
import { Column, SearchRequest } from '../../../../../core/types';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-h-rs-table',
  imports: [TableModule, TranslateModule, CommonModule],
  templateUrl: './h-rs-table.component.html',
  styles: ``,
})
export class HRsTableComponent {
  @ViewChild('table') table: Table | undefined;
  selectedColumns: string[] = [];

  columns: Column[] = [];
  isLoading = false;
  request: SearchRequest = {
    direction: 'DESC',
    first: 0,
    rows: 25,
  };

  H_RsData: H_R_Response[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
      city: 'New York',
      country: 'USA',
      email: 'john.doe@example.com',
      isEnabled: true,
      staffRole: 'HR',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '987-654-3210',
      city: 'Los Angeles',
      country: 'USA',
      email: 'jane.smith@example.com',
      isEnabled: true,
      staffRole: 'HR',
    },
  ];
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.columns = [
      { field: 'firstName', header: 'FIRST_NAME', visible: true },
      { field: 'lastName', header: 'LAST_NAME', visible: true },
      { field: 'phone', header: 'PHONE', visible: true },
      { field: 'email', header: 'EMAIL', visible: true },
      { field: 'city', header: 'CITY', visible: true },
      { field: 'country', header: 'COUNTRY', visible: true },
      { field: 'status', header: 'STATUS', visible: true },
      { field: 'actions', header: 'ACTION', visible: true },
    ];
  }

  ngOnInit(): void {}

  loadH_RsDataLazy(event: TableLazyLoadEvent) {}
}
