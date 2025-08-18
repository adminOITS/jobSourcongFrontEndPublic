import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RecentOfferCardComponent } from '../recent-offer-card';
import { RecentOffer } from '../../../../../core/models/offer.models';
import { RecentOffersViewsService } from '../../../../../core/services/stats/RecentOffersViews.service';

@Component({
  selector: 'app-recent-offers-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, RecentOfferCardComponent],
  templateUrl: './recent-offers-list.component.html',
  styles: [],
})
export class RecentOffersListComponent {
  @Input() showViewAll: boolean = true;

  private recentOffersViewsService = inject(RecentOffersViewsService);
  isRecentOffersViewsLoading =
    this.recentOffersViewsService.isRecentOffersViewsLoading;
  recentOffersViews = this.recentOffersViewsService.recentOffersViews;

  ngOnInit() {
    this.recentOffersViewsService.getRecentOffersViews();
  }

  onViewAll() {
    console.log('View all offers clicked');
  }
}
