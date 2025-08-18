import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import {
  OfferDescription,
  OfferJobDetails,
  OfferResponse,
} from '../../../../../core/models/offer.models';
import { AddEditOfferJobDescriptionDialogComponent } from '../add-edit-offer-job-description-dialog/add-edit-offer-job-description-dialog.component';
import { OfferOverViewTabLanguagesSectionComponent } from '../offer-over-view-tab-languages-section/offer-over-view-tab-languages-section.component';
import { OfferOverViewTabEducationSectionComponent } from '../offer-over-view-tab-education-section/offer-over-view-tab-education-section.component';
import { OfferOverViewTabExperiencesSectionComponent } from '../offer-over-view-tab-experiences-section/offer-over-view-tab-experiences-section.component';
import { OfferOverViewTabSkillsSectionComponent } from '../offer-over-view-tab-skills-section/offer-over-view-tab-skills-section.component';
import { AddEditOfferDetailsDialogComponent } from '../add-edit-offer-details-dialog/add-edit-offer-details-dialog.component';
import { OfferJobDetailsService } from '../../../../../core/services/offer/offer.jobDetails.service';
import { OfferDescriptionService } from '../../../../../core/services/offer/offer.description.service';
import { OfferOverViewTabBenefitsSectionComponent } from '../offer-over-view-tab-benefits-section/offer-over-view-tab-benefits-section.component';
import { OfferOverViewTabNotesSectionComponent } from '../offer-over-view-tab-notes-section/offer-over-view-tab-notes-section.component';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-details-overview-tab',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    DividerModule,
    ButtonModule,
    ChipModule,
    TooltipModule,
    TagModule,
    AddEditOfferJobDescriptionDialogComponent,
    OfferOverViewTabLanguagesSectionComponent,
    OfferOverViewTabEducationSectionComponent,
    OfferOverViewTabExperiencesSectionComponent,
    OfferOverViewTabSkillsSectionComponent,
    AddEditOfferDetailsDialogComponent,
    OfferOverViewTabBenefitsSectionComponent,
    OfferOverViewTabNotesSectionComponent,
    HasRoleDirective,
  ],
  templateUrl: './offer-details-overview-tab.component.html',
  styles: ``,
})
export class OfferDetailsOverviewTabComponent {
  @Output() edit = new EventEmitter<void>();
  offerService = inject(OfferService);
  offer = this.offerService.offerDetails;
  offerDescription = this.offerService.offerDescription;

  offerDescriptionService = inject(OfferDescriptionService);

  onEditDescription(): void {
    this.offerDescriptionService.openEditDialog({
      description: this.offer()!.description,
    } as OfferDescription);
  }

  offerJobDetailsService = inject(OfferJobDetailsService);

  onEditJobDetails(): void {
    this.offerJobDetailsService.openEditDialog(
      this.extractJobDetails(this.offer()!)
    );
  }

  private extractJobDetails(offer: OfferResponse): OfferJobDetails {
    const {
      title,
      category,
      employmentType,
      city,
      country,
      workMode,
      contractType,
      zipCode,
      currency,
      minRemuneration,
      maxRemuneration,
    } = offer;
    return {
      title,
      category,
      employmentType,
      city,
      country,
      workMode,
      contractType,
      zipCode,
      currency: currency,
      minRemuneration,
      maxRemuneration,
    };
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'HOLD':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'CLOSED':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-500 bg-gray-200 dark:text-gray-400 dark:bg-gray-800';
    }
  }
}
