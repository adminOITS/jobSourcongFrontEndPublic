import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password-email',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TranslateModule],
  templateUrl: './forgot-password-email.component.html',
  styles: ``,
})
export class ForgotPasswordEmailComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  private authService = inject(AuthService);
  // Form
  forgotPasswordForm: FormGroup;

  // UI state
  isLoading = this.authService.isLoading;
  forgotPasswordError = this.authService.forgotPasswordError;
  forgotPasswordSuccess = this.authService.forgotPasswordSuccess;

  constructor() {
    this.authService.emptyForgotPasswordSignals();
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('FORGOT_PASSWORD_PAGE').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPasswordEmail(this.forgotPasswordForm.value.email);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Mark all form controls as touched to trigger validation display
  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Navigate back to login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Reset form and try again
  tryAgain() {
    this.authService.emptyForgotPasswordSignals();
    this.forgotPasswordForm.reset();
  }

  // Getter methods for form controls
  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
