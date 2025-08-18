import { Component, inject, Input } from '@angular/core';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { NgForOf } from '@angular/common';
import { OfferShortResponse } from '../../../../../core/models/offer.models';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { OfferService } from '../../../../../core/services/offer/offer.service';
@Component({
  selector: 'app-offer-cards-view',
  standalone: true,
  imports: [OfferCardComponent, NgForOf],
  templateUrl: './offer-cards-view.component.html',
})
export class OfferCardsViewComponent {
  offerService = inject(OfferService);
  offers = this.offerService.offers;
}
