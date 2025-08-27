import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatchingResultService } from '../../../../../core/services/ats/matching-result.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgxExtendedPdfViewerModule],
  templateUrl: './resume-view.component.html',
})
export class ResumeViewComponent implements OnDestroy {
  private matchingResultService = inject(MatchingResultService);

  // Get data from service
  profile = computed(() => this.matchingResultService.currentProfile());

  // Computed properties
  pdfUrl = computed(() => {
    const profile = this.profile();
    if (!profile) return '';

  //  return profile.resumeAttachment?.url || '';
    return 'https://job-sourcing-private-bucket-test-env.s3.eu-west-1.amazonaws.com/document/04d0a8ba-e78d-466c-a8c7-217c6f1b534a?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCWV1LXdlc3QtMSJHMEUCIG5%2FEqXU%2Fg6j5BbgsCtoSSUFUZLxShTmrkFR5Kow8wRrAiEAkN6aX5NJYBHFeiltqAT1%2BiVUOpKvbqiHIp9nY724b%2BsqoAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgwzODE5MjI5MTI1MzIiDJFK%2FOIH%2B8cUcvHv%2Fir0A37%2BT7D25%2FATzr3Z3L2SV%2FUgyuR3QPAbni8eMx6qASq57YC3Yy7J3IjkLvlOgTT%2Bs9GlVOP4mp%2BMTgrI%2BW%2B2PKYDk4MG5%2Fs9ttXg12syG74LlaDXMO%2Fj6CFer0TTW%2BixCoPatr9808qOQMBsZy950%2FgauHNRTcRTUj8FOnRoHaGSvVwGxAxCX%2FWPd1qXxDYWON3%2FfOYTP59W9vrtF%2F5cC4kfPjqvvaowGiFibGJI1t17BzBu5EHaTeFUPe%2BJI23fEE9a6Rn88oMKT%2BVv%2FeY61VL6TrgPOEOOhj79PKNl50RB5IdAgov6%2B5U9MZvV1WZXvNCSdlIdYpMADlkGMIO05ILG6bNbZnLRfcwoRaHDl6N2kdDGHKJ7Hmn9FIy0jsWHlIPV65k%2BPm0zTmTqgdodyEVipJAG1d3gvkPuFWmvKANexViAD0vE5FmdXVFBe%2BaMV99Y5MJF3TNJMSRJseUfLDP3tJBxEw73exJywfxyUTj%2BVh42iWPPlFCoVkWXCqqSif2PGbsDM%2BcCpaW4e7wl%2FfNgEsPMswpsZiFJhhzol28%2BishfvkSLXTQ0a3POWW7D3r%2F45f64Cfv8seCPvfu60DlVrZFKaMnCr26%2BlFXQTHwlDNJn2UbzN2faMJGbOK0hD%2BnuAFhyIK96ffGAlv3VnO%2FyUNsbMPPBu8UGOqYB7gpLVC8kU9joem%2Bo5szzR%2B1%2FzSM6TUBiRIUWAEuthnaD4c3fU1L45H0M1z9Ha6mKaumiCejTKdfR7%2F5YBmga3FuRMLcAGDunVMLyOr8ITGfTaCGY4cma9AHZo4P18dx%2FWdExnxB4XmdGmFxnN9WY07OI4qpgXy%2FgtQZ%2B0Aho4VdvYADvwAtwz90q6%2Fc9C%2FaQnj47NfI4Z5RUVZsCpLw18K37QAejBQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250827T144050Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAVR3DBFEKNOUN6P7X%2F20250827%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Expires=28800&X-Amz-Signature=37b0f7251686f47c03bc8fad39d8f395f39f95b992044bd27bd0aac86bd6d900'
  });

  candidateName = computed(
    () =>
      this.profile()?.candidate?.firstName +
        ' ' +
        this.profile()?.candidate?.lastName || 'Candidate Name'
  );
  profileTitle = computed(
    () => this.profile()?.profileTitle || 'Profile Title'
  );
  showToolbar = true;
  height = '100vh';
  width = '100%';

  // State management
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  safeUrl = signal<SafeResourceUrl | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  // ngOnInit(): void {
  //   if (this.pdfUrl()) {
  //     this.loadPdf();
  //   } else {
  //     this.hasError.set(true);
  //     this.errorMessage.set('No PDF URL provided');
  //     this.isLoading.set(false);
  //   }
  // }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private loadPdf(): void {
    try {
      this.isLoading.set(true);
      this.hasError.set(false);
    } catch (error) {
      this.hasError.set(true);
      this.errorMessage.set('Failed to load PDF');
      this.isLoading.set(false);
    }
  }

  onPdfLoad(): void {
    this.isLoading.set(false);
    this.hasError.set(false);
  }

  onPdfError(): void {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.errorMessage.set('Failed to load PDF document');
  }

  retryLoad(): void {
    this.loadPdf();
  }

  openInNewTab(): void {
    const url = this.pdfUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  downloadPdf(): void {
    const url = this.pdfUrl();
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.candidateName() || 'resume'}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getFileName(): string {
    const url = this.pdfUrl();
    if (!url) return 'resume.pdf';

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop();
      return filename || 'resume.pdf';
    } catch {
      return 'resume.pdf';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Zoom controls for PDF viewer
  zoomLevel = signal<number>(100);

  zoomIn(): void {
    const current = this.zoomLevel();
    if (current < 200) {
      this.zoomLevel.set(current + 25);
    }
  }

  zoomOut(): void {
    const current = this.zoomLevel();
    if (current > 50) {
      this.zoomLevel.set(current - 25);
    }
  }

  resetZoom(): void {
    this.zoomLevel.set(100);
  }

  fitToWidth(): void {
    this.zoomLevel.set(100);
  }
}
