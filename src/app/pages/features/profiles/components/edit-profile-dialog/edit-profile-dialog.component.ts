import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import {
  ProfileRequest,
  ProfileResponse,
} from '../../../../../core/models/profile.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SkillService } from '../../../../../core/services/candidate/skill.service';
import { SelectModule } from 'primeng/select';
import { JOB_CATEGORIES } from '../../../../../core/utils/constants';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styles: ``,
})
export class EditProfileDialogComponent {
  profileForm: FormGroup;
  candidateService = inject(CandidateService);
  candidateSkills = this.candidateService.candidateSkills;
  profileService = inject(ProfileService);
  profile = this.profileService.selectedProfileShort;
  isLoading = this.profileService.isProfileLoading;
  skillsOptions: { name: string; value: string }[] = [];
  skillService = inject(SkillService);
  skillsByProfile = this.skillService.skillsByProfile;
  isSkillsByProfileLoading = this.skillService.isSkillsByProfileLoading;
  isDialogVisible = this.profileService.isEditProfileDialogVisible;
  jobCategories: typeof JOB_CATEGORIES = [];
  translateService = inject(TranslateService);
  appSettingsService = inject(AppSettingsService);
  setIsDialogVisible(val: boolean) {
    this.profileService.setIsEditProfileDialogVisible(val);
  }
  closeDialog() {
    this.setIsDialogVisible(false);
    this.profileForm.reset();
    this.skillService.setSkillsByProfile([]);
    this.profileService.setSelectedProfileShort(null);
  }

  constructor(private fb: FormBuilder) {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('CATEGORY').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
    this.jobCategories = JOB_CATEGORIES.map((item) => ({
      name: this.translateService.instant(item.name),
      value: item.value,
    }));
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
    effect(() => {
      if (this.candidateSkills()) {
        this.skillsOptions = this.candidateSkills().map((skill) => ({
          name: skill.name,
          value: skill.id,
        }));
      }
    });
    // Patch values if editing an existing profile
    effect(() => {
      if (
        this.skillsByProfile() &&
        this.profile() &&
        this.jobCategories.length > 0
      ) {
        this.patchValues(
          this.profile()!.profileTitle,
          this.profile()!.category,
          this.skillsByProfile().map((skill) => skill.id)
        );
      }
    });
    effect(() => {
      if (this.profile()) {
        this.skillService.getSkillsByProfileId(this.profile()!.id);
      }
    });
  }

  patchValues(title: string, category: string, skills: string[]) {
    setTimeout(() => {
      this.profileForm.patchValue({
        title: title,
        category: category,
        skills: skills,
      });
    }, 100);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileRequest: ProfileRequest = {
        profileTitle: this.profileForm.value.title,
        category: this.profileForm.value.category,
        skillIds: this.profileForm.value.skills,
      };

      this.profileService.updateProfile(
        this.candidateService.candidateDetails()!.id,
        this.profileService.selectedProfileShort()!.id,
        profileRequest
      );
    }
  }
}
