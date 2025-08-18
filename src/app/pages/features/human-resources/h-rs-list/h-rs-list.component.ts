import { Component } from '@angular/core';
import { HRsTableComponent } from '../components/h-rs-table/h-rs-table.component';
import { HRFilterFormComponent } from '../components/h-r-filter-form/h-r-filter-form.component';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-h-rs-list',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    HRsTableComponent,
    HRFilterFormComponent,
    TranslateModule,
  ],
  templateUrl: './h-rs-list.component.html',
  styles: ``,
})
export class HRsListComponent {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'HUMAN_RESOURCES' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
