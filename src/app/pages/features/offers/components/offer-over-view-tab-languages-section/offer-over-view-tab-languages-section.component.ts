import { Component, inject, Input } from '@angular/core';
import { OfferLanguageCardComponent } from '../offer-language-card/offer-language-card.component';
import { OfferLanguageResponse } from '../../../../../core/models/offer.models';
import { AddEditOfferLanguageDialogComponent } from '../add-edit-offer-language-dialog/add-edit-offer-language-dialog.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { OfferLanguageService } from '../../../../../core/services/offer/offer.language.service';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-over-view-tab-languages-section',
  imports: [
    OfferLanguageCardComponent,
    AddEditOfferLanguageDialogComponent,
    ButtonModule,
    CommonModule,
    TranslateModule,
    CardModule,
    DividerModule,
    TagModule,
    ChipModule,
    TooltipModule,
    HasRoleDirective,
  ],
  templateUrl: './offer-over-view-tab-languages-section.component.html',
  styles: ``,
})
export class OfferOverViewTabLanguagesSectionComponent {
  offerLanguageService = inject(OfferLanguageService);
  offerService = inject(OfferService);
  offerLanguages = this.offerService.offerLanguages;
  onAddLanguage(): void {
    this.offerLanguageService.openAddDialog();
  }
}
