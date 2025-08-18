import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { OfferJobDetailsService } from '../../../../../core/services/offer/offer.jobDetails.service';
import { OfferJobDetails } from '../../../../../core/models/offer.models';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Currency } from '../../../../../core/types';
import {
  CONTRACT_TYPE_OPTIONS,
  CURRENCIES,
  CURRENCIES_FR,
  EMPLOYMENT_TYPES,
  JOB_CATEGORIES,
  WORK_MODES,
} from '../../../../../core/utils/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-offer-details-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    SelectModule,
  ],
  templateUrl: './add-edit-offer-details-dialog.component.html',
  styles: ``,
})
export class AddEditOfferDetailsDialogComponent {
  offerJobDetailsForm: FormGroup;
  offerJobDetailsService = inject(OfferJobDetailsService);
  isLoading = this.offerJobDetailsService.isJobDetailsLoading;
  private fb = inject(FormBuilder);

  currencies: Currency[] = CURRENCIES;
  offerId!: string;
  route = inject(ActivatedRoute);
  translateService = inject(TranslateService);

  employmentTypesOptions: { name: string; value: string }[] = [];
  workModesOptions: { name: string; value: string }[] = [];
  contractTypesOptions: { name: string; value: string }[] = [];
  jobCategories: { name: string; value: string }[] = [];
  constructor() {
    this.offerId = this.route.snapshot.params['offerId'];
    this.initOptions();
    this.offerJobDetailsForm = this.fb.group({
      title: ['', Validators.required],
      employmentType: ['', Validators.required],
      workMode: ['', Validators.required],
      contractType: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
      minRemuneration: [0],
      maxRemuneration: [0],
      currency: [this.currencies[0], Validators.required],
      category: [null, Validators.required],
    });
    this.translateService.onLangChange.subscribe(({ lang }) => {
      if (lang === 'fr') {
        this.currencies = CURRENCIES_FR;
      } else {
        this.currencies = CURRENCIES;
      }
      this.initOptions();
    });

    effect(() => {
      const selectedEducation =
        this.offerJobDetailsService.selectedOfferJobDetailsComputed();
      setTimeout(() => {
        if (selectedEducation) {
          this.patchFormWithEducationData(selectedEducation);
        } else {
          this.offerJobDetailsForm.reset({
            minRemuneration: 0,
            maxRemuneration: 0,
            currency: this.currencies[0],
          });
        }
      });
    });
  }

  private validateRemunerationRange(form: FormGroup) {
    const min = form.get('minRemuneration')?.value;
    const max = form.get('maxRemuneration')?.value;

    if (min && max && max < min) {
      form.get('maxRemuneration')?.setErrors({ maxLessThanMin: true });
    } else {
      form.get('maxRemuneration')?.setErrors(null);
    }

    return null;
  }
  initOptions() {
    this.employmentTypesOptions = EMPLOYMENT_TYPES.map((type) => ({
      name: this.translateService.instant(type.name),
      value: type.value,
    }));

    this.workModesOptions = WORK_MODES.map((mode) => ({
      name: this.translateService.instant(mode.name),
      value: mode.value,
    }));

    this.contractTypesOptions = CONTRACT_TYPE_OPTIONS.map((type) => ({
      name: this.translateService.instant(type.name),
      value: type.value,
    }));
    this.jobCategories = JOB_CATEGORIES.map((item) => ({
      name: this.translateService.instant(item.name),
      value: item.value,
    }));
  }

  private patchFormWithEducationData(offerJobDetails: OfferJobDetails) {
    const selectedCurrency =
      this.currencies.find((c) => c.code === offerJobDetails.currency) ||
      this.currencies[0];

    this.offerJobDetailsForm.patchValue({
      city: offerJobDetails.city,
      country: offerJobDetails.country,
      workMode: offerJobDetails.workMode,
      contractType: offerJobDetails.contractType,
      zipCode: offerJobDetails.zipCode,
      minRemuneration: offerJobDetails.minRemuneration || 0,
      maxRemuneration: offerJobDetails.maxRemuneration || 0,
      title: offerJobDetails.title,
      employmentType: offerJobDetails.employmentType,
      currency: selectedCurrency,
      category: offerJobDetails.category,
    });
  }

  get isEditMode() {
    return (
      this.offerJobDetailsService.selectedOfferJobDetailsComputed() !== null
    );
  }

  onSave() {
    if (this.offerJobDetailsForm.valid) {
      const offerJobDetails = this.offerJobDetailsForm.value;
      const offerJobDetailsRequest: OfferJobDetails = {
        title: offerJobDetails.title,
        category: offerJobDetails.category,
        employmentType: offerJobDetails.employmentType,
        workMode: offerJobDetails.workMode,
        city: offerJobDetails.city,
        country: offerJobDetails.country,
        contractType: offerJobDetails.contractType,
        zipCode: offerJobDetails.zipCode,
        minRemuneration: offerJobDetails.minRemuneration,
        maxRemuneration: offerJobDetails.maxRemuneration,
        currency: offerJobDetails.currency.code,
      };
      this.offerJobDetailsService.updateOfferJobDetails(offerJobDetailsRequest);
    }
  }

  onHide() {
    this.offerJobDetailsService.closeDialog();
    this.offerJobDetailsForm.reset();
  }

  get selectedCurrencyLocale(): string {
    const selectedCurrency = this.offerJobDetailsForm.get('currency')?.value;
    const currency = this.currencies.find((c) => c.code === selectedCurrency);
    return currency?.locale || 'en-US';
  }
}
