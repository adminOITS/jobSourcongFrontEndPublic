import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './unauthorized.component.html',
  styles: '',
})
export class UnauthorizedComponent {
  private router = inject(Router);
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('UNAUTHORIZED').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
