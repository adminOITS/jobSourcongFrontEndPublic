import { Component, inject, Input, ViewChild } from '@angular/core';
import { OfferSkillResponse } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OfferSkillService } from '../../../../../core/services/offer/offer.skill.service';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-skill-card',
  templateUrl: './offer-skill-card.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    ConfirmDialogModule,
    TranslateModule,
    HasRoleDirective,
  ],
  providers: [ConfirmationService],
})
export class OfferSkillCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() skill!: OfferSkillResponse;
  isExpanded = false;
  confirmationService = inject(ConfirmationService);

  menuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.onEditSkill(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.confirmDelete(),
    },
  ];
  offerSkillService = inject(OfferSkillService);
  onEditSkill() {
    this.offerSkillService.openEditDialog(this.skill);
  }
  confirmDelete() {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offerSkillService.setSelectedSkill(this.skill);
        this.offerSkillService.deleteSkill();
      },
    });
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
