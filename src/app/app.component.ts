import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppSettingsService } from './core/services/app-settings.service';
import { TranslationInitService } from './core/services/translation-init.service';
import { NgIf } from '@angular/common';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, NgIf, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'job-sourcing';
  translationsLoading = signal(true);

  constructor(private translationInitService: TranslationInitService) {}

  ngOnInit() {
    this.translationInitService.initializeTranslations().subscribe({
      next: () => {
        this.translationsLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load translations:', error);
      },
    });
  }
}
