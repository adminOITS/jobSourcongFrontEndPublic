import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  inject,
  ChangeDetectorRef,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { detectContentType } from '../../../../../core/utils';

@Component({
  selector: 'app-edit-logo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    TranslateModule,
  ],
  templateUrl: './edit-logo-dialog.component.html',
})
export class EditLogoDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  logoForm: FormGroup;
  dragging = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  private companyService = inject(CompanyService);
  company = this.companyService.companyDetails;
  isVisible = this.companyService.isCompanyLogoDialogVisible;

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  isLoading = this.companyService.isCompanyActionLoading;

  constructor() {
    this.logoForm = this.fb.group({
      // Remove form control for file input to avoid the error
    });
    effect(() => {
      const company = this.company();
      if (company?.logoAttachment?.url) {
        this.previewUrl = company.logoAttachment.url;
      }
    });
  }
  setIsVisible(event: boolean) {
    this.companyService.setIsCompanyLogoDialogVisible(event);
  }

  showDialog(): void {
    this.companyService.openLogoCompanyDialog();
    // Set current logo as preview if it exists
    if (this.company()?.logoAttachment?.url) {
      this.previewUrl = this.company()!.logoAttachment?.url!;
    }
  }

  hideDialog(): void {
    this.companyService.closeLogoCompanyDialog();
    this.resetForm();
  }

  private resetForm(): void {
    this.logoForm.reset();
    this.previewUrl = null;
    this.dragging = false;
    this.selectedFile = null;
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = e.target?.result as string;
        this.selectedFile = file;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  clearLogo(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (this.selectedFile && this.company()?.id) {
      this.companyService.updateCompanyLogo(
        this.company()?.id!,
        this.selectedFile
      );
    }
  }
}
