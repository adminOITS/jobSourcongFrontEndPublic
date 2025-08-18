import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RECENT_OFFERS_VIEWS_DOMAIN } from '../../utils/constants';
import {
  OfferViewRequest,
  OfferViewResponse,
} from '../../models/statistics.models';
import { take } from 'rxjs';
import { OfferService } from '../offer/offer.service';
import { RecentOffer } from '../../models/offer.models';

@Injectable({
  providedIn: 'root',
})
export class RecentOffersViewsService {
  private readonly baseUrl = environment.domain + RECENT_OFFERS_VIEWS_DOMAIN;
  private http = inject(HttpClient);

  private offerService = inject(OfferService);

  private recentOffersViewsSignal = signal<RecentOffer[]>([]);
  private isRecentOffersViewsLoadingSignal = signal(false);
  recentOffersViews = computed(() => this.recentOffersViewsSignal());
  isRecentOffersViewsLoading = computed(() =>
    this.isRecentOffersViewsLoadingSignal()
  );

  getRecentOffersViews() {
    this.isRecentOffersViewsLoadingSignal.set(true);
    return this.http
      .get<OfferViewResponse[]>(`${this.baseUrl}`)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.offerService
            .getJobOffersByIds(res.map((view) => view.offerId))

            .subscribe({
              next: (offers) => {
                this.recentOffersViewsSignal.set(
                  offers.map((offer) => ({
                    ...offer,
                    lastAccessed: res.find((view) => view.offerId === offer.id)
                      ?.viewedAt,
                  }))
                );
              },
            });
        },
      });
  }

  saveOfferView(offerViewRequest: OfferViewRequest) {
    return this.http
      .post<any>(`${this.baseUrl}`, offerViewRequest)
      .pipe(take(1))
      .subscribe();
  }
}
