import { Component, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExperienceService } from '../../../../../core/services/candidate/experience.service';
import {
  ExperienceRequest,
  ExperienceResponse,
} from '../../../../../core/models/candidate.models';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { isValidDate } from '../../../../../core/utils';
@Component({
  selector: 'app-add-edit-candidate-experience-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DatePickerModule,
    CheckboxModule,
    TextareaModule,

    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-candidate-experience-dialog.component.html',
  providers: [DatePipe],
})
export class AddEditCandidateExperienceDialogComponent {
  private fb = inject(FormBuilder);
  experienceService = inject(ExperienceService);
  isLoading = this.experienceService.isExperienceLoading;
  datePipe = inject(DatePipe);
  experienceForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    description: ['', [Validators.required]],
    startDate: [null, [Validators.required]],
    endDate: [null],
    current: [false],
    location: ['', [Validators.required]],
  });

  get current() {
    return this.experienceForm.get('current')?.value;
  }

  get isEditMode() {
    return !!this.experienceService.selectedExperienceComputed();
  }

  constructor() {
    effect(() => {
      const selectedExperience =
        this.experienceService.selectedExperienceComputed();
      setTimeout(() => {
        if (selectedExperience) {
          this.patchFormWithExperienceData(selectedExperience);
        } else {
          this.experienceForm.reset();
        }
      });
    });

    // Watch for isCurrent changes to update endDate validation
    this.experienceForm.get('current')?.valueChanges.subscribe((current) => {
      const endDateControl = this.experienceForm.get('endDate');
      if (current) {
        endDateControl?.clearValidators();
      } else {
        endDateControl?.setValidators([Validators.required]);
      }
      endDateControl?.updateValueAndValidity();
    });
  }

  patchFormWithExperienceData(experience: ExperienceResponse) {
    const endDate = isValidDate(experience.endDate)
      ? new Date(experience.endDate!)
      : null;
    const startDate = isValidDate(experience.startDate)
      ? new Date(experience.startDate!)
      : null;
    this.experienceForm.patchValue({
      title: experience.jobTitle,
      company: experience.company,
      description: experience.description,
      startDate: startDate,
      endDate: endDate,
      current: experience.current || false,
      location: experience.location,
    });
  }

  onHide() {
    this.experienceForm.reset();
    this.experienceService.closeDialog();
  }

  onSubmit() {
    if (this.experienceForm.valid) {
      const formValue = this.experienceForm.value;
      const selectedExperience =
        this.experienceService.selectedExperienceComputed();

      const startDate = formValue.startDate
        ? this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd')
        : null;
      const endDate = formValue.endDate
        ? this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd')
        : null;
      const experienceData: ExperienceRequest = {
        jobTitle: formValue.title,
        company: formValue.company,
        description: formValue.description,
        startDate: startDate,
        endDate: endDate,
        current: formValue.current || false,
        location: formValue.location,
      };
      if (selectedExperience) {
        this.experienceService.updateExperience(experienceData);
      } else {
        this.experienceService.addExperience(experienceData);
      }
    }
  }
}
