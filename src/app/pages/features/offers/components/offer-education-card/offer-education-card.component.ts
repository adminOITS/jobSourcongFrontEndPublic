import { Component, inject, Input, ViewChild } from '@angular/core';
import { OfferEducationResponse } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { OfferEducationService } from '../../../../../core/services/offer/offer.education.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-education-card',
  templateUrl: './offer-education-card.component.html',
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
export class OfferEducationCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() education!: OfferEducationResponse;
  confirmationService = inject(ConfirmationService);
  offerEducationService = inject(OfferEducationService);
  offerId!: string;
  route = inject(ActivatedRoute);
  translateService = inject(TranslateService);
  constructor() {
    this.offerId = this.route.snapshot.params['id'];
  }

  menuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.onEditEducation(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.confirmDelete(),
    },
  ];
  onEditEducation(): void {
    console.log('Edit education');
    this.offerEducationService.openEditDialog(this.education);
  }
  confirmDelete() {
    this.confirmationService.confirm({
      message: this.translateService.instant('DELETE_EDUCATION_CONFIRMATION'),
      header: this.translateService.instant('DELETE_EDUCATION_HEADER'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offerEducationService.setSelectedEducation(this.education);
        this.offerEducationService.deleteEducation();
      },
    });
  }
}
