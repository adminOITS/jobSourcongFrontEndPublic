import { Component, inject, Input } from '@angular/core';
import { AddEditOfferJobNotesDialogComponent } from '../add-edit-offer-job-notes-dialog/add-edit-offer-job-notes-dialog.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OfferNotesService } from '../../../../../core/services/offer/offer.notes.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-offer-over-view-tab-notes-section',
  imports: [
    AddEditOfferJobNotesDialogComponent,
    CommonModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    HasRoleDirective,
  ],
  templateUrl: './offer-over-view-tab-notes-section.component.html',
  styles: ``,
})
export class OfferOverViewTabNotesSectionComponent {
  offerService = inject(OfferService);
  offerNotes = this.offerService.offerNotes;
  offerNotesService = inject(OfferNotesService);
  showNotesContent = true;

  onEditNotes() {
    this.showNotesContent = true;
    this.offerNotesService.openEditDialog({
      notes: this.offerNotes() || '',
    });
  }

  toggleNotesContent() {
    this.showNotesContent = !this.showNotesContent;
  }
}
