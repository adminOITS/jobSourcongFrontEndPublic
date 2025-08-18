import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  effect,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import {
  EducationRequest,
  EducationResponse,
} from '../../../../../core/models/candidate.models';
import { EducationService } from '../../../../../core/services/candidate/education.service';
import { dateRangeValidator, isValidDate } from '../../../../../core/utils';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-candidate-education-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    DialogModule,
  ],
  providers: [DatePipe],
  templateUrl: './add-edit-candidate-education-dialog.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AddEditCandidateEducationDialogComponent implements OnInit {
  educationService = inject(EducationService);

  isLoading = this.educationService.isEducationLoading;
  educationForm: FormGroup;
  current: boolean = false;
  isEditMode: boolean = false;
  candidateId!: string;
  route = inject(ActivatedRoute);
  datePipe = inject(DatePipe);
  constructor(private fb: FormBuilder) {
    this.candidateId = this.route.snapshot.params['candidateId'];
    this.educationForm = this.fb.group(
      {
        degree: ['', Validators.required],
        institution: ['', Validators.required],
        field: ['', Validators.required],
        startDate: [null, Validators.required],
        endDate: [null],
        current: [false],
        location: ['', Validators.required],
      },
      { validators: dateRangeValidator }
    );

    // Watch for selected education changes
    effect(() => {
      const education = this.educationService.selectedEducationComputed();
      setTimeout(() => {
        if (education) {
          this.isEditMode = true;
          this.patchFormWithEducationData(education);
        } else {
          this.isEditMode = false;
          this.educationForm.reset();
          this.current = false;
        }
      });
    });
  }

  ngOnInit() {
    // Handle isCurrent checkbox changes
    this.educationForm.get('current')?.valueChanges.subscribe((value) => {
      this.current = value;
      if (value) {
        this.educationForm.get('endDate')?.clearValidators();
        this.educationForm.get('endDate')?.setValue(null);
      } else {
        this.educationForm.get('endDate')?.setValidators([Validators.required]);
        // If we're editing and the education has an end date, set it back
        const selectedEducation =
          this.educationService.selectedEducationComputed();
        if (selectedEducation && selectedEducation.endDate) {
          this.educationForm
            .get('endDate')
            ?.setValue(new Date(selectedEducation.endDate));
        }
      }
      this.educationForm.get('endDate')?.updateValueAndValidity();
    });
  }

  private patchFormWithEducationData(education: EducationResponse) {
    const endDate = isValidDate(education.endDate)
      ? new Date(education.endDate!)
      : null;
    const startDate = isValidDate(education.startDate)
      ? new Date(education.startDate!)
      : null;
    this.educationForm.patchValue({
      degree: education.degree,
      institution: education.institution,
      field: education.field,
      startDate: startDate,
      endDate: endDate,
      current: education.current || false,
      location: education.location,
    });

    this.current = education.current;
  }

  onHide() {
    this.educationForm.reset();
    this.current = false;
    this.educationService.closeDialog();
  }

  onSubmit() {
    if (this.educationForm.valid) {
      const formValue = this.educationForm.value;
      const startDate = formValue.startDate
        ? this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd')
        : null;
      const endDate = formValue.endDate
        ? this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd')
        : null;

      const educationData: EducationRequest = {
        startDate: startDate || '',
        endDate: endDate,
        degree: formValue.degree,
        field: formValue.field,
        institution: formValue.institution,
        current: formValue.current || false,
        location: formValue.location,
      };
      if (this.isEditMode) {
        this.educationService.updateEducation(educationData);
      } else {
        this.educationService.addEducation(educationData);
      }
    }
  }
}
