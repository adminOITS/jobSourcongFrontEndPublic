import { Component, effect, inject } from '@angular/core';
import { OfferDescriptionService } from '../../../../../core/services/offer/offer.description.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  OfferDescription,
  OfferNotes,
} from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { OfferNotesService } from '../../../../../core/services/offer/offer.notes.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-offer-job-notes-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DialogModule,
  ],
  templateUrl: './add-edit-offer-job-notes-dialog.component.html',
  styles: ``,
})
export class AddEditOfferJobNotesDialogComponent {
  offerNotesService = inject(OfferNotesService);
  isLoading = this.offerNotesService.isNoteLoading;
  offerNotesForm = new FormGroup({
    notes: new FormControl('', [Validators.required]),
  });
  route = inject(ActivatedRoute);
  offerId!: string;

  constructor(private fb: FormBuilder) {
    this.offerId = this.route.snapshot.params['id'];
    this.offerNotesForm = this.fb.group({
      notes: ['', Validators.required],
    });
    effect(() => {
      const selectedNote = this.offerNotesService.selectedNoteComputed();
      setTimeout(() => {
        if (selectedNote) {
          this.patchFormWithNoteData(selectedNote);
        } else {
          this.offerNotesForm.reset();
        }
      });
    });
  }
  get isEditMode() {
    return this.offerNotesService.selectedNoteComputed() !== undefined;
  }

  private patchFormWithNoteData(offerNote: OfferNotes) {
    this.offerNotesForm.patchValue({
      notes: offerNote.notes,
    });
  }

  onSave() {
    if (this.offerNotesForm.valid) {
      const notes = this.offerNotesForm.value.notes;
      if (this.isEditMode) {
        this.offerNotesService.updateNote({
          notes: notes || '',
        });
      }
    }
  }
  onHide() {
    this.offerNotesService.closeDialog();
  }
}
