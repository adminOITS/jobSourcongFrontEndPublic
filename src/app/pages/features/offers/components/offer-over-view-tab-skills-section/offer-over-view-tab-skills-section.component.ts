import { Component, inject, Input } from '@angular/core';
import { OfferSkillCardComponent } from '../offer-skill-card/offer-skill-card.component';
import { AddEditOfferSkillDialogComponent } from '../add-edit-offer-skill-dialog/add-edit-offer-skill-dialog.component';
import { OfferSkillResponse } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { OfferSkillService } from '../../../../../core/services/offer/offer.skill.service';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-over-view-tab-skills-section',
  imports: [
    OfferSkillCardComponent,
    AddEditOfferSkillDialogComponent,
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
  templateUrl: './offer-over-view-tab-skills-section.component.html',
  styles: ``,
})
export class OfferOverViewTabSkillsSectionComponent {
  offerSkillService = inject(OfferSkillService);
  offerService = inject(OfferService);
  offerSkills = this.offerService.offerSkills;
  onAddSkill(): void {
    this.offerSkillService.openAddDialog();
  }
}
