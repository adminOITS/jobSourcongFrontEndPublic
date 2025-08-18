import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Component, Input, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { StaffRequest } from '../../../../../core/models/staff.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-company-hr-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    TranslateModule,
    DialogModule,
    SelectModule,
  ],
  templateUrl: './edit-company-hr-dialog.component.html',
  styles: ``,
})
export class EditCompanyHrDialogComponent {
  private staffService = inject(StaffService);
  isEditHrDialogVisible = this.staffService.isEditHrDialogVisible;
  private route = inject(ActivatedRoute);
  companyStaffForm!: FormGroup;

  companyId!: string;
  constructor(private fb: FormBuilder) {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    this.initForm();

    effect(() => {
      const selectedStaff = this.staffService.addEditSelectedStaff();

      if (selectedStaff) {
        setTimeout(() => {
          this.companyStaffForm.patchValue({
            firstName: selectedStaff!.firstName,
            lastName: selectedStaff!.lastName,
            phone: selectedStaff!.phone,
            city: selectedStaff!.city,
            country: selectedStaff!.country,
            email: selectedStaff!.email,
          });
        }, 0);
      } else {
        this.companyStaffForm.reset();
      }
    });
  }

  setDialogVisible(visible: boolean) {
    this.staffService.setEditHrDialogVisible(visible);
  }
  isStaffRequestLoading = this.staffService.isStaffRequestLoading;

  private initForm() {
    this.companyStaffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)]],
      city: [''],
      country: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.companyStaffForm.valid) {
      const request = this.companyStaffForm.value;
      const staff: StaffRequest = {
        firstName: request.firstName,
        lastName: request.lastName,
        phone: request.phone,
        city: request.city,
        country: request.country,
        email: request.email,
      };

      this.staffService.editStaff(
        this.staffService.addEditSelectedStaff()!.id,
        staff,
        this.companyId
      );
    }
  }

  onHide() {
    if (!this.staffService.isStaffRequestLoading()) {
      this.companyStaffForm.reset();
      this.staffService.closeEditHrDialog();
    }
  }
}
