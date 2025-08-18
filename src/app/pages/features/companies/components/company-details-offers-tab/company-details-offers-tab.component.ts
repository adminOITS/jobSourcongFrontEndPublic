import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyOffersTableComponent } from '../../../offers/components/company-offers-table/company-offers-table.component';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { JobOfferFilterRequest } from '../../../../../core/models/offer.models';
import {
  DEFAULT_JOB_OFFER_PAGE,
  DEFAULT_JOB_OFFER_SIZE,
} from '../../../../../core/utils/constants';
import { OffersFilterFormComponent } from '../../../offers/components/offers-filter-form/offers-filter-form.component';
@Component({
  selector: 'app-company-details-offers-tab',
  imports: [
    ButtonModule,
    TranslateModule,
    FloatLabelModule,
    InputTextModule,
    CompanyOffersTableComponent,
    OffersFilterFormComponent,
  ],
  templateUrl: './company-details-offers-tab.component.html',
  styles: ``,
})
export class CompanyDetailsOffersTabComponent {
  private router: Router = inject(Router);

  offerService: OfferService = inject(OfferService);
  offers = this.offerService.offers;
  companyId!: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  request = signal<JobOfferFilterRequest>({
    page: DEFAULT_JOB_OFFER_PAGE,
    size: DEFAULT_JOB_OFFER_SIZE,
  });
  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    effect(() => {
      this.offerService.getOffersByCompanyId(this.companyId, this.request());
    });
  }

  navigateToAddOffer() {
    const currentUrl = this.router.url;
    this.router.navigate([`${currentUrl}/offers/add`]);
  }
}
