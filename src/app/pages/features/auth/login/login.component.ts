import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoginRequest } from '../../../../core/models/user.models';
import { ButtonModule } from 'primeng/button';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  // Form
  loginForm: FormGroup;

  // UI state
  isLoading = this.authService.isLoading;
  showPassword = false;
  errorMessage = this.authService.loginError;

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('LOGIN_PAGE').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const loginRequest: LoginRequest = {
        userName: formValue.userName,
        password: formValue.password,
      };
      this.authService.login(loginRequest);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Mark all form controls as touched to trigger validation display
  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for form controls
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }
}
