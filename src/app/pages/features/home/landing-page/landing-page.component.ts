import {
  Component,
  effect,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { ToolbarComponent } from '../../../../shared/toolbar/toolbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { ContactUsService } from '../../../../core/services/home/contact-us.service';
import { ContactUsRequest } from '../../../../core/types';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import AOS from 'aos';

@Component({
  selector: 'app-landing-page',
  imports: [
    ToolbarComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './landing-page.component.html',
  styles: ``,
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private appSettingsService = inject(AppSettingsService);
  private translateService = inject(TranslateService);
  private contactUsService = inject(ContactUsService);
  private fb = inject(FormBuilder);

  // Expose theme for template access
  theme = this.appSettingsService.theme;

  // Contact form using reactive forms
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    message: ['', [Validators.required]],
    agreeToTerms: [false, [Validators.requiredTrue]],
  });

  // Loading state
  isLoading = this.contactUsService.isContactUsLoading;

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

  // Scroll to contact form
  scrollToContact() {
    const contactElement = document.getElementById('contact-form');
    if (contactElement) {
      contactElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  // Handle contact form submission
  onSubmitContactForm() {
    if (this.contactForm.valid) {
      const formData: ContactUsRequest = this.contactForm.value;

      // Subscribe to handle success callback to reset form
      this.contactUsService.sendContactUs(formData);
    } else {
      // Mark all fields as touched to show validation errors
      this.contactForm.markAllAsTouched();
    }
  }
}
