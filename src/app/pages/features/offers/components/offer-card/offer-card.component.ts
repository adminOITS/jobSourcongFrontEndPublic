import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OfferResponse,
  OfferShortResponse,
} from '../../../../../core/models/offer.models';
import { Router, RouterLink } from '@angular/router';
import { timeAgo } from '../../../../../core/utils';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './offer-card.component.html',
})
export class OfferCardComponent {
  @Input() offer!: OfferShortResponse;
  constructor(private router: Router) {}

  getStatusColor(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'text-green-600 bg-green-100';
      case 'HOLD':
        return 'text-yellow-600 bg-yellow-100';
      case 'CLOSE':
        return 'text-red-600 bg-red-100';

      default:
        return 'text-gray-500 bg-gray-200';
    }
  }

  appSettingsService = inject(AppSettingsService);
  timeAgo(): string {
    return timeAgo(this.offer.createdAt!, this.appSettingsService.language());
  }
  viewMore() {
    const currentUrl = this.router.url; // Get the current route
    this.router.navigate([currentUrl, this.offer.id]); // Append the ID to the route
  }
}
