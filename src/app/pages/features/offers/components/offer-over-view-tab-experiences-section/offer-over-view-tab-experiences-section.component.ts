import { Component, inject, Input } from '@angular/core';
import { AddEditOfferExperienceDialogComponent } from '../add-edit-offer-experience-dialog/add-edit-offer-experience-dialog.component';
import { OfferExperienceCardComponent } from '../offer-experience-card/offer-experience-card.component';
import { OfferExperienceResponse } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { OfferExperienceService } from '../../../../../core/services/offer/offer.experience.service';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-over-view-tab-experiences-section',
  imports: [
    AddEditOfferExperienceDialogComponent,
    OfferExperienceCardComponent,
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
  templateUrl: './offer-over-view-tab-experiences-section.component.html',
  styles: ``,
})
export class OfferOverViewTabExperiencesSectionComponent {
  offerExperienceService = inject(OfferExperienceService);
  offerService = inject(OfferService);
  offerExperiences = this.offerService.offerExperiences;
  onAddExperience(): void {
    this.offerExperienceService.openAddDialog();
  }
}
