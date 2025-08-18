import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';

@Component({
  selector: 'app-generic-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './generic-settings.component.html',
})
export class GenericSettingsComponent {
  languages: { label: string; value: 'en' | 'fr' }[] = [
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
  ];
  themes: { label: string; value: 'light' | 'dark' }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];
  private appSettingsService = inject(AppSettingsService);
  theme = this.appSettingsService.theme;
  language = this.appSettingsService.language;

  switchLanguage(language: 'en' | 'fr') {
    this.appSettingsService.setLanguage(language);
  }

  switchTheme(theme: 'light' | 'dark') {
    this.appSettingsService.setTheme(theme);
  }
}
