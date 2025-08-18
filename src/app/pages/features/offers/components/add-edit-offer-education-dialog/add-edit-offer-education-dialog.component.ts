import { Component, inject, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  OfferEducationRequest,
  OfferEducationResponse,
} from '../../../../../core/models/offer.models';
import { OfferEducationService } from '../../../../../core/services/offer/offer.education.service';
import { TextareaModule } from 'primeng/textarea';
import { REQUIREMENT_LEVEL_OPTIONS } from '../../../../../core/utils/constants';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../../../../core/services/offer/offer.service';
@Component({
  selector: 'app-add-edit-offer-education-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './add-edit-offer-education-dialog.component.html',
})
export class AddEditOfferEducationDialogComponent implements OnInit, OnDestroy {
  educationForm: FormGroup;

  private fb = inject(FormBuilder);
  offerEducationService = inject(OfferEducationService);
  isLoading = this.offerEducationService.isEducationLoading;

  route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);

  private _requirementLevelOptions = REQUIREMENT_LEVEL_OPTIONS;
  requirementLevelOptions: typeof REQUIREMENT_LEVEL_OPTIONS = [];
  private destroy$ = new Subject<void>();
  constructor() {
    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      field: ['', Validators.required],
      institution: ['', Validators.required],
      requirementLevel: ['', Validators.required],
      description: [''],
    });
    this.initOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.initOptions();
      });

    effect(() => {
      const selectedEducation =
        this.offerEducationService.selectedEducationComputed();
      setTimeout(() => {
        if (selectedEducation) {
          this.patchFormWithEducationData(selectedEducation);
        } else {
          this.educationForm.reset();
        }
      });
    });
  }

  initOptions() {
    this.requirementLevelOptions = this._requirementLevelOptions.map(
      (item) => ({
        ...item,
        name: this.translateService.instant(item.name),
      })
    ) as typeof REQUIREMENT_LEVEL_OPTIONS;
  }

  ngOnInit() {}

  get isEditMode() {
    return !!this.offerEducationService.selectedEducationComputed();
  }

  private patchFormWithEducationData(education: OfferEducationResponse) {
    this.educationForm.patchValue({
      degree: education.degree,
      field: education.field,
      institution: education.institution,
      requirementLevel: education.requirementLevel,
      description: education.description,
    });
  }

  onSave() {
    if (this.educationForm.valid) {
      const formValue = this.educationForm.value;
      const selectedEducation =
        this.offerEducationService.selectedEducationComputed();

      const education: OfferEducationRequest = {
        degree: formValue.degree,
        field: formValue.field,
        institution: formValue.institution,
        requirementLevel: formValue.requirementLevel,
        description: formValue.description,
      };

      if (selectedEducation) {
        this.offerEducationService.updateEducation(education);
      } else {
        this.offerEducationService.addEducation(education);
      }

      this.offerEducationService.closeDialog();
    }
  }

  onHide() {
    this.educationForm.reset();
    this.offerEducationService.closeDialog();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
