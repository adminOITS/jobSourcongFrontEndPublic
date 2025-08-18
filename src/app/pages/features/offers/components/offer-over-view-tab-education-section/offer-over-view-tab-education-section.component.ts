import { Component, inject, Input } from '@angular/core';
import { OfferEducationCardComponent } from '../offer-education-card/offer-education-card.component';
import { OfferEducationResponse } from '../../../../../core/models/offer.models';
import { AddEditOfferEducationDialogComponent } from '../add-edit-offer-education-dialog/add-edit-offer-education-dialog.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { OfferEducationService } from '../../../../../core/services/offer/offer.education.service';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-over-view-tab-education-section',
  imports: [
    OfferEducationCardComponent,
    AddEditOfferEducationDialogComponent,
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
  templateUrl: './offer-over-view-tab-education-section.component.html',
  styles: ``,
})
export class OfferOverViewTabEducationSectionComponent {
  offerEducationService = inject(OfferEducationService);
  offerService = inject(OfferService);
  offerEducations = this.offerService.offerEducations;

  onAddEducation(): void {
    this.offerEducationService.openAddDialog();
  }
}
