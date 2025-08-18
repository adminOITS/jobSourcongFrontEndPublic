import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import {
  ProfileRequest,
  ProfileResponse,
} from '../../../../../core/models/profile.models';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { detectContentType } from '../../../../../core/utils';
import { JOB_CATEGORIES } from '../../../../../core/utils/constants';

@Component({
  selector: 'app-add-edit-candidate-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    CardModule,
    SelectModule,
    TranslateModule,
  ],
  templateUrl: './add-edit-candidate-profile-form.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class AddEditCandidateProfileFormComponent {
  profileForm: FormGroup;
  candidateService = inject(CandidateService);
  candidateSkills = this.candidateService.candidateSkills;
  profileService = inject(ProfileService);
  translateService = inject(TranslateService);
  isLoading = this.profileService.isProfileLoading;
  skillsOptions: { name: string; value: string }[] = [];
  jobCategories: typeof JOB_CATEGORIES = [];
  // File upload properties
  selectedFile: File | null = null;
  dragActive = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: [null, Validators.required],
      skills: [[], Validators.required],
      resumeFile: [null],
    });
    this.skillsOptions = this.candidateSkills().map((skill) => ({
      name: skill.name,
      value: skill.id,
    }));
    this.jobCategories = JOB_CATEGORIES.map((item) => ({
      name: this.translateService.instant(item.name),
      value: item.value,
    }));
  }

  // File upload methods
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
      const profileRequest: ProfileRequest = {
        profileTitle: this.profileForm.value.title,
        category: this.profileForm.value.category,
        skillIds: this.profileForm.value.skills,
      };
      if (this.selectedFile) {
        profileRequest.resumeUploadRequest = {
          contentType: detectContentType(this.selectedFile),
        };
        this.profileService.addProfile(
          this.candidateService.candidateDetails()!.id,
          profileRequest,
          this.selectedFile
        );
      } else {
        this.profileService.addProfile(
          this.candidateService.candidateDetails()!.id,
          profileRequest
        );
      }
    }
  }
}
