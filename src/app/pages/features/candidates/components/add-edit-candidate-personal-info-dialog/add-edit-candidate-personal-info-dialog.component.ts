import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import {
  CandidateRequest,
  CandidateResponse,
} from '../../../../../core/models/candidate.models';

@Component({
  selector: 'app-add-edit-candidate-personal-info-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    TranslateModule,
  ],
  templateUrl: './add-edit-candidate-personal-info-dialog.component.html',
  styles: ` `,
})
export class AddEditCandidatePersonalInfoDialogComponent {
  candidateForm!: FormGroup;
  candidateService = inject(CandidateService);
  isCandidateLoading = this.candidateService.isCandidateLoading;
  today = new Date();
  minDate = new Date(
    this.today.getFullYear() - 70,
    this.today.getMonth(),
    this.today.getDate()
  );
  maxDate = new Date(
    this.today.getFullYear() - 16,
    this.today.getMonth(),
    this.today.getDate()
  );
  constructor(private fb: FormBuilder) {
    this.candidateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],

      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });

    effect(() => {
      const selectedCandidate = this.candidateService.CandidatePersonalInfo();
      setTimeout(() => {
        if (selectedCandidate) {
          this.patchFormWithCandidateData(selectedCandidate);
        } else {
          this.candidateForm.reset();
        }
      });
    });
  }

  patchFormWithCandidateData(candidate: CandidateResponse) {
    this.candidateForm.patchValue({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      phone: candidate.phone,
      email: candidate.email,
      address: {
        addressLine1: candidate.address?.addressLine1 || '',
        addressLine2: candidate.address?.addressLine2 || '',
        city: candidate.address?.city || '',
        zipCode: candidate.address?.zipCode || '',
        country: candidate.address?.country || '',
      },
    });
  }

  onSubmit() {
    if (this.candidateForm.valid) {
      const candidateData = this.candidateForm.value;
      const selectedCandidate = this.candidateService.candidateDetails();
      const candidateRequest: CandidateRequest = {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        phone: candidateData.phone,
        email: candidateData.email,
        address: {
          addressLine1: candidateData.address.addressLine1,
          addressLine2: candidateData.address.addressLine2,
          city: candidateData.address.city,
          zipCode: candidateData.address.zipCode,
          country: candidateData.address.country,
        },
      };

      if (selectedCandidate) {
        this.candidateService.updateCandidate(candidateRequest);
      } else {
        this.candidateService.addCandidate(candidateRequest);
      }
    }
  }

  onHide() {
    this.candidateForm.reset();
    this.candidateService.closeDialog();
  }
}
