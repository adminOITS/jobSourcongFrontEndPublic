import { Component, Input, signal } from '@angular/core';
import { CompanyResponse } from '../../../../../core/models/company.models';
import { NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-company-card',
  imports: [NgStyle, TranslateModule, SkeletonModule, NgIf],
  templateUrl: './company-card.component.html',
  styles: ``,
})
export class CompanyCardComponent {
  @Input() company!: CompanyResponse;
  constructor(private router: Router) {}
  isImageLoading = signal(true);

  onImageLoaded() {
    this.isImageLoading.set(false);
  }

  onImageError() {
    this.isImageLoading.set(false);
  }

  viewMore() {
    const currentUrl = this.router.url; // Get the current route
    this.router.navigate([currentUrl, this.company.id]); // Append the ID to the route
  }
}
