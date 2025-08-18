import {
  Component,
  effect,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ToolbarComponent } from '../../../../shared/toolbar/toolbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import AOS from 'aos';

@Component({
  selector: 'app-landing-page',
  imports: [ToolbarComponent, TranslateModule],
  templateUrl: './landing-page.component.html',
  styles: ``,
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  // Expose theme for template access
  theme = this.appSettingsService.theme;

  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('LANDING_PAGE').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  ngOnInit() {
    // Initialize AOS when component initializes
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: false,
      offset: 50,
      delay: 0,
      disable: 'mobile', // Disable on mobile for better performance
    });
  }

  ngAfterViewInit() {
    // Refresh AOS after view is initialized
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }

  ngOnDestroy() {
    // Clean up AOS when component is destroyed
    AOS.refresh();
  }
}
