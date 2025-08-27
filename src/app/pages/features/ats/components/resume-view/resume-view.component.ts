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

    return profile.resumeAttachment?.url || '';
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
