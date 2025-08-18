import { Component, inject, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  OfferShortResponse,
  RecentOffer,
} from '../../../../../core/models/offer.models';
import { timeAgo } from '../../../../../core/utils';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { ROUTES } from '../../../../../routes';

@Component({
  selector: 'app-recent-offer-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './recent-offer-card.component.html',
  styles: [],
})
export class RecentOfferCardComponent {
  @Input() recentOffer!: RecentOffer;

  appSettingsService = inject(AppSettingsService);
  router = inject(Router);
  timeAgo(date: string): string {
    return timeAgo(date, this.appSettingsService.language());
  }
  viewOfferDetails() {
    const currentUrl = this.router.url;
    const url = currentUrl.split('/');
    this.router.navigate([
      `${url[1]}/${ROUTES.OFFER.LIST}/${this.recentOffer.id}`,
    ]);
  }
}
