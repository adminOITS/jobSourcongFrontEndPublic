import { Component, Input, Signal } from '@angular/core';
import { CompanyResponse } from '../../../../../core/models/company.models';
import { CompanyCardComponent } from '../company-card/company-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-companies-cards-view',
  imports: [CompanyCardComponent, NgForOf, NgIf, TranslateModule],
  templateUrl: './companies-cards-view.component.html',
  styles: ``,
})
export class CompaniesCardsViewComponent {
  @Input() companies!: Signal<PaginatedResponse<CompanyResponse>>;
}
