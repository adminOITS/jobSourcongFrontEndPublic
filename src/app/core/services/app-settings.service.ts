import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AppSettings } from '../types';

import { WindowResizeService } from './window-resize.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

const savedSettings = localStorage.getItem('appSettings');
const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  #settings = signal<AppSettings>({
    theme: parsedSettings.theme
      ? parsedSettings.theme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    language: parsedSettings.language ? parsedSettings.language : 'en', // Default to 'en'
  });

  settings = computed(this.#settings);

  theme = computed(() => this.#settings().theme);
  language = computed(() => this.#settings().language);

  constructor() {
    this.applySetting();
    effect(() => {
      if (!this.windowResizeService.isLargeScreen()) {
        this.closeDesktopSidebar();
      }
    });
  }

  title = inject(Title);
  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.#settings.update((current) => ({ ...current, theme }));
    this.applySetting();
  }

  toggleTheme(): void {
    const newTheme = this.#settings().theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  // language ###########################
  private translationService = inject(TranslateService);

  setLanguage(language: 'en' | 'fr'): void {
    this.#settings.update((current) => ({ ...current, language }));
    this.applySetting();
  }
  //global #################
  private applySetting(): void {
    document.documentElement.classList.toggle(
      'dark',
      this.#settings().theme === 'dark'
    );
    this.translationService.use(this.#settings().language);

    this.saveSettings();
  }

  private saveSettings(): void {
    localStorage.setItem('appSettings', JSON.stringify(this.#settings()));
  }

  // desktop sidebar ###########################

  windowResizeService = inject(WindowResizeService);
  #isExpanded = signal<boolean>(false);
  isExpanded = computed(this.#isExpanded);

  sidebarWidth = computed(() => (this.isExpanded() ? '16.5rem' : '5rem'));
  marginLeft = computed(() => {
    if (!this.windowResizeService.isLargeScreen()) return 'ml-0';
    return this.#isExpanded() ? 'ml-[16.5rem]' : 'ml-[5rem]';
  });

  toggleDesktopSidebar = () => this.#isExpanded.set(!this.#isExpanded());
  closeDesktopSidebar = () => this.#isExpanded.set(false);

  // mobile sidebar ###########################

  #mobileSidebarVisible = signal<boolean>(false);
  mobileSidebarVisible = computed(this.#mobileSidebarVisible);
  toggleMobileSidebar = () =>
    this.#mobileSidebarVisible.set(!this.#mobileSidebarVisible());

  toggleSidebar = () => {
    if (this.windowResizeService.isLargeScreen()) this.toggleDesktopSidebar();
    else this.toggleMobileSidebar();
  };

  #globalLoading = signal<boolean>(false);
  globalLoading = computed(this.#globalLoading);
  setGlobalLoading(loading: boolean) {
    this.#globalLoading.set(loading);
  }
}
