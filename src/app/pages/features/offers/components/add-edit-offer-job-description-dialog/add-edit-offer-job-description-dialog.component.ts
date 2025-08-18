import { Component, effect, inject } from '@angular/core';
import { OfferDescriptionService } from '../../../../../core/services/offer/offer.description.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferDescription } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-offer-job-description-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DialogModule,
  ],
  templateUrl: './add-edit-offer-job-description-dialog.component.html',
  styles: ``,
})
export class AddEditOfferJobDescriptionDialogComponent {
  offerDescriptionService = inject(OfferDescriptionService);
  isLoading = this.offerDescriptionService.isDescriptionLoading;
  private route = inject(ActivatedRoute);
  offerId!: string;

  offerDescriptionForm;

  constructor(private fb: FormBuilder) {
    this.offerId = this.route.snapshot.params['offerId'];
    this.offerDescriptionForm = this.fb.group({
      description: ['', Validators.required],
    });
    effect(() => {
      const selectedDescription =
        this.offerDescriptionService.selectedDescriptionComputed();
      setTimeout(() => {
        if (selectedDescription) {
          this.patchFormWithDescriptionData(selectedDescription);
        } else {
          this.offerDescriptionForm.reset();
        }
      });
    });
  }
  get isEditMode() {
    return (
      this.offerDescriptionService.selectedDescriptionComputed() !== undefined
    );
  }

  private patchFormWithDescriptionData(offerDescription: OfferDescription) {
    this.offerDescriptionForm.patchValue({
      description: offerDescription.description,
    });
  }

  onSave() {
    if (this.offerDescriptionForm.valid) {
      const description = this.offerDescriptionForm.value.description;
      const offerDescription: OfferDescription = {
        description: description || '',
      };
      this.offerDescriptionService.updateDescription(offerDescription);
    }
  }
  onHide() {
    this.offerDescriptionService.closeDialog();
  }
}
