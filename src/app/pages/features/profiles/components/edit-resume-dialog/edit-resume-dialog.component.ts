import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-edit-resume-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FileUploadModule,
  ],
  templateUrl: './edit-resume-dialog.component.html',
  styles: ``,
})
export class EditResumeDialogComponent {
  profileForm: FormGroup;
  candidateService = inject(CandidateService);
  profileService = inject(ProfileService);
  isLoading = this.profileService.isProfileLoading;
  selectedFile: File | null = null;
  dragActive = false;

  isDialogVisible = this.profileService.isEditProfileResumeDialogVisible;

  setIsDialogVisible(val: boolean) {
    this.profileService.setIsEditProfileResumeDialogVisible(val);
  }
  closeDialog() {
    this.profileService.closeEditProfileResumeDialog();
    this.profileForm.reset();
  }

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      resumeFile: [null],
    });
    // Patch values if editing an existing profile
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isValidFileType(file)) {
      this.selectedFile = file;
      this.profileForm.patchValue({ resumeFile: file });
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFileType(file)) {
        this.selectedFile = file;
        this.profileForm.patchValue({ resumeFile: file });
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.profileForm.patchValue({ resumeFile: null });
  }

  private isValidFileType(file: File): boolean {
    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return validTypes.includes(fileExtension);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      if (this.selectedFile) {
        this.profileService.updateProfileResume(
          this.candidateService.candidateDetails()!.id,
          this.profileService.selectedProfileShort()!.id,
          this.selectedFile
        );
      }
    }
  }
}
