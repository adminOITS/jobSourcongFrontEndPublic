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
  selector: 'app-add-edit-company-staff-dialog',
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
  templateUrl: './add-edit-company-staff-dialog.component.html',
  styles: ``,
})
export class AddEditCompanyStaffDialogComponent {
  staffService = inject(StaffService);
  isAddEditStaffDialogVisible = this.staffService.isAddEditStaffDialogVisible;
  isEdit = signal<boolean>(false);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  companyStaffForm!: FormGroup;

  staffRoleOptions: { label: string; value: string }[] = [];
  companyId!: string;
  constructor(private fb: FormBuilder) {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    this.initForm();
    this.initStaffRoleOptions();
    this.translateService.onLangChange.subscribe((event) => {
      this.initStaffRoleOptions();
    });

    effect(() => {
      const selectedStaff = this.staffService.addEditSelectedStaff();

      if (selectedStaff) {
        this.isEdit.set(true);
        setTimeout(() => {
          this.companyStaffForm.patchValue({
            firstName: selectedStaff!.firstName,
            lastName: selectedStaff!.lastName,
            phone: selectedStaff!.phone,
            city: selectedStaff!.city,
            country: selectedStaff!.country,
            email: selectedStaff!.email,
            staffRole: selectedStaff!.role,
          });
        }, 0);
      } else {
        this.companyStaffForm.reset();
        this.isEdit.set(false);
      }
    });
  }

  private initStaffRoleOptions() {
    this.staffRoleOptions = [
      { label: this.translateService.instant('RECRUITER'), value: 'RECRUITER' },
      { label: this.translateService.instant('VALIDATOR'), value: 'VALIDATOR' },
    ];
  }

  private initForm() {
    this.companyStaffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)],
      ],
      city: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      staffRole: ['', Validators.required],
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
        email: this.isEdit()
          ? this.staffService.addEditSelectedStaff()?.email
          : request.email,
      };

      if (this.isEdit()) {
        this.staffService.editStaff(
          this.staffService.addEditSelectedStaff()!.id,
          staff,
          this.companyId
        );
      } else {
        this.staffService.addStaff(staff, request.staffRole, this.companyId);
      }
    }
  }

  onHide() {
    if (!this.staffService.isStaffRequestLoading()) {
      this.companyStaffForm.reset();
      this.staffService.closeDialog();
    }
  }
}
