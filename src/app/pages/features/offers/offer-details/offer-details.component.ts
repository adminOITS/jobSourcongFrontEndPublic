import { Component, effect, inject, OnInit } from '@angular/core';
import { OfferDetailsTabsComponent } from '../components/offer-details-tabs/offer-details-tabs.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { OfferService } from '../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { OfferDetailsOverviewTabComponent } from '../components/offer-details-overview-tab/offer-details-overview-tab.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { RecentOffersViewsService } from '../../../../core/services/stats/RecentOffersViews.service';
@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [
    OfferDetailsTabsComponent,
    TranslateModule,
    MenuModule,
    ButtonModule,
    HasRoleDirective,
    OfferDetailsOverviewTabComponent,
    LoaderComponent,
    NgIf,
  ],
  templateUrl: './offer-details.component.html',
})
export class OfferDetailsComponent implements OnInit {
  offerId!: string;

  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  offerService = inject(OfferService);
  route = inject(ActivatedRoute);

  isOfferLoading = this.offerService.isOfferLoading;
  offer = this.offerService.offerDetails;
  private recentOffersViewsService = inject(RecentOffersViewsService);

  constructor() {
    this.route.params.subscribe((params) => {
      this.offerId = params['offerId'];
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('OFFER_DETAILS').subscribe((res) => {
        const title = this.offer()?.title ? this.offer()?.title : '...';
        this.appSettingsService.setTitle(res + ' : ' + title);
      });
    });
  }

  ngOnInit() {
    if (this.offerId) {
      this.offerService.getOfferById(this.offerId);
      this.recentOffersViewsService.saveOfferView({
        offerId: this.offerId,
      });
    }
  }
}
