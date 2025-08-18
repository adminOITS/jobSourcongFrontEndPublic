import { Component, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkillService } from '../../../../../core/services/candidate/skill.service';
import {
  SkillRequest,
  SkillResponse,
} from '../../../../../core/models/candidate.models';
import { SelectModule } from 'primeng/select';
import { PROFICIENCY_OPTIONS } from '../../../../../core/utils/constants';
import { Subject, takeUntil } from 'rxjs';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-candidate-skill-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './add-edit-candidate-skill-dialog.component.html',
})
export class AddEditCandidateSkillDialogComponent implements OnDestroy {
  skillForm: FormGroup;
  private _skillProficiencyOptions = PROFICIENCY_OPTIONS;
  proficiencyLevels: typeof PROFICIENCY_OPTIONS = [];
  translateService = inject(TranslateService);
  candidateId!: string;
  route = inject(ActivatedRoute);
  skillService = inject(SkillService);
  isLoading = this.skillService.isSkillLoading;
  constructor(private fb: FormBuilder) {
    this.candidateId = this.route.snapshot.params['candidateId'];
    this.skillForm = this.fb.group({
      skillName: ['', Validators.required],
      proficiency: ['', Validators.required],
    });
    this.updateTranslations();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.updateTranslations();
      });

    effect(() => {
      const selectedSkill = this.skillService.selectedSkillComputed();
      setTimeout(() => {
        if (selectedSkill) {
          this.patchFormWithSkillData(selectedSkill);
        } else {
          this.skillForm.reset();
        }
      });
    });
  }

  get isEditMode() {
    return !!this.skillService.selectedSkillComputed();
  }

  private destroy$ = new Subject<void>();

  updateTranslations() {
    this.proficiencyLevels = this._skillProficiencyOptions.map((option) => ({
      name: this.translateService.instant(option.name),
      value: option.name,
    }));
  }

  private patchFormWithSkillData(skill: SkillResponse) {
    this.skillForm.patchValue({
      skillName: skill.name,
      proficiency: skill.proficiencyLevel,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.skillForm.valid) {
      const formValue = this.skillForm.value;
      const selectedSkill = this.skillService.selectedSkillComputed();
      const skillData: SkillRequest = {
        name: formValue.skillName,
        proficiencyLevel: formValue.proficiency,
      };

      if (selectedSkill) {
        this.skillService.updateSkill(skillData);
      } else {
        this.skillService.addSkill(skillData);
      }
    }
  }

  onHide() {
    this.skillService.closeDialog();
    this.skillForm.reset();
  }
}
