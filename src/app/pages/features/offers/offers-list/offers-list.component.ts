import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { OfferCardsViewComponent } from '../components/offer-cards-view/offer-cards-view.component';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OffersFilterFormComponent } from '../components/offers-filter-form/offers-filter-form.component';
import { FormsModule } from '@angular/forms';
import { OffersTableComponent } from '../components/offers-table/offers-table.component';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { CompanyOffersTableComponent } from '../components/company-offers-table/company-offers-table.component';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { OfferService } from '../../../../core/services/offer/offer.service';
import { JobOfferFilterRequest } from '../../../../core/models/offer.models';
import { DEFAULT_JOB_OFFER_SIZE } from '../../../../core/utils/constants';
import { DEFAULT_JOB_OFFER_PAGE } from '../../../../core/utils/constants';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OffersFilterFormComponent,
    OffersTableComponent,
    OfferCardsViewComponent,
    BreadcrumbModule,
    ButtonModule,
    TranslateModule,
    SelectButtonModule,
    CardModule,
    DividerModule,
    ChipModule,
    TooltipModule,
    TagModule,
    CompanyOffersTableComponent,
    HasRoleDirective,
  ],
  templateUrl: './offers-list.component.html',
  styles: ``,
})
export class OffersListComponent implements OnDestroy {
  isTableView: boolean = true;
  selectedView: string = 'table';
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  private router: Router = inject(Router);
  offerService = inject(OfferService);
  offers = this.offerService.offers;
  request = signal<JobOfferFilterRequest>({
    page: DEFAULT_JOB_OFFER_PAGE,
    size: DEFAULT_JOB_OFFER_SIZE,
  });
  private authService: AuthService = inject(AuthService);
  companyId = this.authService.currentUser()?.companyId;
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('OFFERS_LIST').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });

    effect(() => {
      const filteredRequest = this.request();
      this.offerService.getOffers(filteredRequest);
    });
  }

  ChangeView(view: string): void {
    this.selectedView = view;
    this.isTableView = view === 'table';
  }
  navigateToAddOffer() {
    const currentUrl = this.router.url;
    this.router.navigate([
      `${currentUrl.split('/')[1]}/${this.companyId}/offers/add`,
    ]);
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
  ngOnDestroy(): void {
    this.offerService.emptyOffers();
  }
}
