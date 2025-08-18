import { Component, computed, inject, Input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { WindowResizeService } from '../../core/services/window-resize.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [
    ToolbarModule,
    InputTextModule,
    AvatarModule,
    ButtonModule,
    OverlayPanelModule,
    SelectButtonModule,
    MenuModule,
    OverlayBadgeModule,
    NgClass,
    TranslateModule,
    NgIf,
  ],

  templateUrl: './toolbar.component.html',
  styles: ``,
})
export class ToolbarComponent {
  @Input() landingPage: boolean = false;
  @Input() userMenu!: Menu;
  private appSettingsService = inject(AppSettingsService);
  private router = inject(Router);
  notificationVisible = false;
  languageItems: MenuItem[];
  userMenuItems: MenuItem[];

  private authService = inject(AuthService);
  userName: string | undefined;
  constructor() {
    const user = this.authService.getUser();
    if (user) {
      this.userName =
        user.firstName?.charAt(0).toUpperCase() +
        user.lastName?.charAt(0).toUpperCase();
    }

    this.userMenuItems = [
      {
        label: 'LOGOUT',
        icon: 'pi pi-sign-out text-red-500 dark:text-red-400',
        command: () => this.authService.logout(),
      },
    ];
    this.languageItems = [
      {
        label: 'English',
        icon: 'flag-icon flag-icon-gb text-blue-500',
        command: () => this.switchLanguage('en'),
      },
      {
        label: 'Français',
        icon: 'flag-icon flag-icon-fr text-blue-500',
        command: () => this.switchLanguage('fr'),
      },
    ];
  }

  switchLanguage(language: 'en' | 'fr') {
    this.appSettingsService.setLanguage(language);
  }

  private windowResizeService = inject(WindowResizeService);
  isLargeScreen = this.windowResizeService.isLargeScreen;
  logoUrl = computed(() =>
    this.appSettingsService.theme() === 'dark'
      ? 'assets/images/job-sourcing-logo-white.png'
      : 'assets/images/job-sourcing-logo-blue.png'
  );
  language = this.appSettingsService.language;

  modes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];
  selectedMode = 'light';

  theme = this.appSettingsService.theme;
  toggleDarkMode() {
    this.appSettingsService.toggleTheme();
  }
  toggleSidebar = this.appSettingsService.toggleSidebar;
  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
