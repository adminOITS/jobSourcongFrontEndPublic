import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AppSettingsService } from '../../../../core/services/app-settings.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private router = inject(Router);
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  // Get message from router state or use default
  get message(): string {
    return (
      this.router.getCurrentNavigation()?.extras.state?.['message'] ||
      'PAGE_NOT_FOUND'
    );
  }

  goBack() {
    this.router.navigate(['/']);
  }
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('NOT_FOUND_PAGE').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }
}
