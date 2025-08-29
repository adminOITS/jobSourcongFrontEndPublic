import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { StaffRequest } from '../../../../../core/models/staff.models';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './profile-settings.component.html',
})
export class ProfileSettingsComponent {
  private staffService = inject(StaffService);
  private staffDetails = this.staffService.staffDetails;
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
    });
    effect(() => {
      setTimeout(() => {
        if (this.staffDetails()) {
          this.profileForm = this.fb.group({
            firstName: [this.staffDetails()?.firstName],
            lastName: [this.staffDetails()?.lastName],
            phone: [this.staffDetails()?.phone],
          });
        }
      }, 100);
    });
  }

  onSubmit() {
    const formData = this.profileForm.value;
    const staffRequest: StaffRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      city: this.staffDetails()?.city || '',
      country: this.staffDetails()?.country || '',
      email: this.staffDetails()?.appUser?.email!,
    };

    this.staffService.editStaff(
      this.staffDetails()?.id!,
      staffRequest,
      this.staffDetails()?.appUser?.companyId!
    );
  }

  updateEmail() {}
}
