import { Component, inject, Input, ViewChild } from '@angular/core';
import { OfferLanguageResponse } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OfferLanguageService } from '../../../../../core/services/offer/offer.language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-language-card',
  templateUrl: './offer-language-card.component.html',
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
export class OfferLanguageCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() language!: OfferLanguageResponse;
  isExpanded = false;
  confirmationService = inject(ConfirmationService);

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  menuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.onEditLanguage(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.confirmDelete(),
    },
  ];
  offerLanguageService = inject(OfferLanguageService);

  onEditLanguage() {
    this.offerLanguageService.openEditDialog(this.language);
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this experience?',
      header: 'Delete Experience',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offerLanguageService.setSelectedLanguage(this.language);
        this.offerLanguageService.deleteLanguage();
      },
    });
  }
}
