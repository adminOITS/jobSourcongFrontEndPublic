import { Component, inject, Input } from '@angular/core';
import { OfferBenefitsService } from '../../../../../core/services/offer/offer.benefits.service';
import { AddEditOfferJobBenefitsDialogComponent } from '../add-edit-offer-job-benefits-dialog/add-edit-offer-job-benefits-dialog.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-offer-over-view-tab-benefits-section',
  imports: [
    AddEditOfferJobBenefitsDialogComponent,
    CommonModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    HasRoleDirective,
  ],
  templateUrl: './offer-over-view-tab-benefits-section.component.html',
  styles: ``,
})
export class OfferOverViewTabBenefitsSectionComponent {
  offerService = inject(OfferService);
  offerBenefits = this.offerService.offerBenefits;
  offerBenefitsService = inject(OfferBenefitsService);
  showBenefitsContent = true;

  onEditBenefits() {
    this.showBenefitsContent = true;
    this.offerBenefitsService.openEditDialog({
      benefits: this.offerBenefits() || '',
    });
  }

  toggleBenefitsContent() {
    this.showBenefitsContent = !this.showBenefitsContent;
  }
}
