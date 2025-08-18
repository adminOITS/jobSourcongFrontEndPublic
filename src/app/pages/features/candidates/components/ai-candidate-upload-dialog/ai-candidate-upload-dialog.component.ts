import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateAiService } from '../../../../../core/services/candidate/candidate-ai.service';

@Component({
  selector: 'app-ai-candidate-upload-dialog',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './ai-candidate-upload-dialog.component.html',
  styles: ``,
})
export class AiCandidateUploadDialogComponent {
  uploadForm: FormGroup = new FormGroup({
    file: new FormControl<File | null>(null),
  });
  get file() {
    return this.uploadForm.get('file');
  }
  selectedFile: File | null = null;
  dragActive = false;
  private candidateAiService = inject(CandidateAiService);
  isDialogVisible = this.candidateAiService.isDialogVisible;
  setDialogVisible(visible: boolean) {
    this.candidateAiService.setDialogVisible(visible);
  }

  onHide() {
    this.candidateAiService.hideDialog();
    this.selectedFile = null;
    this.dragActive = false;
    this.uploadForm.reset();
  }
  isLoading = this.candidateAiService.isLoading;

  onHowItWorks() {
    // Show info dialog or tooltip
    alert(
      'This feature allows you to generate a candidate profile by uploading a resume.'
    );
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onGenerate() {
    if (this.selectedFile) {
      this.candidateAiService.processResume(this.selectedFile);
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
  }
}
