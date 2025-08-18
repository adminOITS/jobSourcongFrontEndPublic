import { Component, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import {
  OfferExperienceRequest,
  OfferExperienceResponse,
} from '../../../../../core/models/offer.models';
import { OfferExperienceService } from '../../../../../core/services/offer/offer.experience.service';
import { TranslateService } from '@ngx-translate/core';
import { REQUIREMENT_LEVEL_OPTIONS } from '../../../../../core/utils/constants';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-offer-experience-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
  ],
  templateUrl: './add-edit-offer-experience-dialog.component.html',
})
export class AddEditOfferExperienceDialogComponent implements OnDestroy {
  experienceForm: FormGroup;

  private fb = inject(FormBuilder);
  offerExperienceService = inject(OfferExperienceService);
  isLoading = this.offerExperienceService.isExperienceLoading;
  private translateService = inject(TranslateService);
  private _requirementLevelOptions = REQUIREMENT_LEVEL_OPTIONS;
  requirementLevelOptions: typeof REQUIREMENT_LEVEL_OPTIONS = [];
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  offerId!: string;
  constructor() {
    this.offerId = this.route.snapshot.params['id'];
    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      yearsRequired: [0, [Validators.required, Validators.min(0)]],
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
      const selectedExperience =
        this.offerExperienceService.selectedExperienceComputed();
      setTimeout(() => {
        if (selectedExperience) {
          this.patchFormWithExperienceData(selectedExperience);
        } else {
          this.experienceForm.reset();
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
  get isEditMode() {
    return !!this.offerExperienceService.selectedExperienceComputed();
  }

  private patchFormWithExperienceData(experience: OfferExperienceResponse) {
    this.experienceForm.patchValue({
      title: experience.title,
      companyName: experience.companyName,
      yearsRequired: experience.yearsRequired,
      requirementLevel: experience.requirementLevel,
      description: experience.description,
    });
  }

  onSave() {
    if (this.experienceForm.valid) {
      const formValue = this.experienceForm.value;
      const selectedExperience =
        this.offerExperienceService.selectedExperienceComputed();
      const experience: OfferExperienceRequest = {
        title: formValue.title,
        companyName: formValue.company,
        yearsRequired: formValue.yearsRequired,
        requirementLevel: formValue.requirementLevel,
        description: formValue.description,
      };

      if (selectedExperience) {
        this.offerExperienceService.updateExperience(experience);
      } else {
        this.offerExperienceService.addExperience(experience);
      }

      this.offerExperienceService.closeDialog();
    }
  }

  onHide() {
    this.experienceForm.reset();
    this.offerExperienceService.closeDialog();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
