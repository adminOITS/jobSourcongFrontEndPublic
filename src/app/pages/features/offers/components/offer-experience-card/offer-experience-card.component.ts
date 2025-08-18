import { Component, inject, Input, ViewChild } from '@angular/core';
import { OfferExperienceResponse } from '../../../../../core/models/offer.models';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { OfferExperienceService } from '../../../../../core/services/offer/offer.experience.service';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-experience-card',
  templateUrl: './offer-experience-card.component.html',
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
export class OfferExperienceCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() experience!: OfferExperienceResponse;
  confirmationService = inject(ConfirmationService);

  menuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.onEditExperience(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.confirmDelete(),
    },
  ];
  offerExperienceService = inject(OfferExperienceService);

  onEditExperience() {
    this.offerExperienceService.openEditDialog(this.experience);
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this experience?',
      header: 'Delete Experience',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offerExperienceService.setSelectedExperience(this.experience);
        this.offerExperienceService.deleteExperience();
      },
    });
  }
}
