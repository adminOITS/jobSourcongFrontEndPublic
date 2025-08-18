import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { ResetPasswordRequest } from '../../../../../core/models/user.models';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './security-settings.component.html',
})
export class SecuritySettingsComponent {
  passwordForm: FormGroup;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  private authService = inject(AuthService);
  isLoading = this.authService.isLoading;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Password visibility toggle methods
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Getter methods for form controls
  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  // Validation helper methods
  getCurrentPasswordError(): string {
    if (this.currentPassword?.hasError('required')) {
      return 'CURRENT_PASSWORD_REQUIRED';
    }

    return '';
  }

  getNewPasswordError(): string {
    if (this.newPassword?.hasError('required')) {
      return 'NEW_PASSWORD_REQUIRED';
    }
    if (this.newPassword?.hasError('minlength')) {
      return 'PASSWORD_MIN_LENGTH_8';
    }
    if (this.newPassword?.hasError('pattern')) {
      return 'PASSWORD_STRENGTH_REQUIREMENTS';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmPassword?.hasError('required')) {
      return 'CONFIRM_PASSWORD_REQUIRED';
    }
    if (this.passwordForm?.hasError('passwordMismatch')) {
      return 'PASSWORDS_DO_NOT_MATCH';
    }
    return '';
  }

  // Check password strength
  getPasswordStrength(): {
    strength: string;
    color: string;
    percentage: number;
  } {
    const password = this.newPassword?.value || '';
    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[@$!%*?&]/.test(password)) score += 25;

    if (score >= 100)
      return { strength: 'STRONG', color: 'text-green-600', percentage: 100 };
    if (score >= 75)
      return { strength: 'GOOD', color: 'text-blue-600', percentage: 75 };
    if (score >= 50)
      return { strength: 'FAIR', color: 'text-yellow-600', percentage: 50 };
    if (score >= 25)
      return { strength: 'WEAK', color: 'text-red-600', percentage: 25 };
    return { strength: 'VERY_WEAK', color: 'text-red-600', percentage: 0 };
  }

  // Password requirement check methods
  hasMinLength(): boolean {
    return (this.newPassword?.value?.length || 0) >= 8;
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword?.value || '');
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword?.value || '');
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword?.value || '');
  }

  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.newPassword?.value || '');
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
      const formData = this.passwordForm.value;
      const resetPassword: ResetPasswordRequest = {
        currentPassword: formData.currentPassword,
        password: formData.newPassword,
        passwordConfirmation: formData.confirmPassword,
      };
      this.authService.resetPassword(resetPassword);
    } else {
      Object.keys(this.passwordForm.controls).forEach((key) => {
        const control = this.passwordForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
