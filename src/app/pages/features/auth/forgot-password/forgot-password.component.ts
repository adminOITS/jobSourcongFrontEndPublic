import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TranslateModule],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  forgotPasswordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  authService = inject(AuthService);
  isLoading = this.authService.isLoading;
  forgotPasswordError = this.authService.forgotPasswordError;
  forgotPasswordSuccess = this.authService.forgotPasswordSuccess;

  constructor() {
    this.authService.emptyForgotPasswordSignals();
    this.forgotPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  get password() {
    return this.forgotPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword');
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const token = this.route.snapshot.params['token'];
    const formData = this.forgotPasswordForm.value;
    const forgotPasswordData = {
      password: formData.password,
      passwordConfirmation: formData.confirmPassword,
      token: token,
    };

    this.authService.forgotPassword(forgotPasswordData);
  }
}
