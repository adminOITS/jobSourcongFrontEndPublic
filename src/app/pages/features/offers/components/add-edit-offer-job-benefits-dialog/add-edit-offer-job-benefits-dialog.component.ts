import { Component, effect, inject } from '@angular/core';
import { OfferDescriptionService } from '../../../../../core/services/offer/offer.description.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferBenefits } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { OfferBenefitsService } from '../../../../../core/services/offer/offer.benefits.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-offer-job-benefits-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DialogModule,
  ],
  templateUrl: './add-edit-offer-job-benefits-dialog.component.html',
  styles: ``,
})
export class AddEditOfferJobBenefitsDialogComponent {
  offerBenefitsService = inject(OfferBenefitsService);
  isLoading = this.offerBenefitsService.isBenefitLoading;

  offerBenefitsForm = new FormGroup({
    benefits: new FormControl('', [Validators.required]),
  });

  route = inject(ActivatedRoute);
  offerId!: string;
  constructor(private fb: FormBuilder) {
    this.offerId = this.route.snapshot.params['id'];
    this.offerBenefitsForm = this.fb.group({
      benefits: ['', Validators.required],
    });
    effect(() => {
      const selectedBenefits =
        this.offerBenefitsService.selectedBenefitComputed();
      setTimeout(() => {
        if (selectedBenefits) {
          this.patchFormWithBenefitsData(selectedBenefits);
        } else {
          this.offerBenefitsForm.reset();
        }
      });
    });
  }
  get isEditMode() {
    return this.offerBenefitsService.selectedBenefitComputed() !== undefined;
  }

  private patchFormWithBenefitsData(offerBenefits: OfferBenefits) {
    this.offerBenefitsForm.patchValue({
      benefits: offerBenefits.benefits,
    });
  }
  patchFormWithData() {}

  onSave() {
    if (this.offerBenefitsForm.valid) {
      const benefits = this.offerBenefitsForm.value.benefits;
      const benefit: OfferBenefits = {
        benefits: benefits || '',
      };
      if (this.isEditMode) {
        this.offerBenefitsService.updateBenefit(benefit);
      }
    }
  }
  onHide() {
    this.offerBenefitsService.closeDialog();
  }
}
