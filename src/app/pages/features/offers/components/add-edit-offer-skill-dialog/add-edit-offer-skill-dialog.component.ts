import {
  Component,
  inject,
  effect,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import {
  OfferSkillRequest,
  OfferSkillResponse,
} from '../../../../../core/models/offer.models';
import { OfferSkillService } from '../../../../../core/services/offer/offer.skill.service';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import {
  REQUIREMENT_LEVEL_OPTIONS,
  SKILL_TYPES,
} from '../../../../../core/utils/constants';
import { PROFICIENCY_OPTIONS } from '../../../../../core/utils/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-offer-skill-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './add-edit-offer-skill-dialog.component.html',
})
export class AddEditOfferSkillDialogComponent implements OnInit, OnDestroy {
  skillForm: FormGroup;
  private translateService = inject(TranslateService);
  private _proficiencyOptions = PROFICIENCY_OPTIONS;
  private _requirementLevelOptions = REQUIREMENT_LEVEL_OPTIONS;
  private _skillTypeOptions = SKILL_TYPES;
  proficiencyOptions: typeof PROFICIENCY_OPTIONS = [];
  requirementLevelOptions: typeof REQUIREMENT_LEVEL_OPTIONS = [];
  skillTypeOptions: typeof SKILL_TYPES = [];
  private fb = inject(FormBuilder);
  offerSkillService = inject(OfferSkillService);
  isLoading = this.offerSkillService.isSkillLoading;
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  route = inject(ActivatedRoute);
  offerId!: string;

  constructor() {
    this.offerId = this.route.snapshot.params['id'];
    this.skillForm = this.fb.group({
      skillName: ['', Validators.required],
      proficiency: ['', Validators.required],
      requirementLevel: ['', Validators.required],
      description: [''],
      skillType: [null],
    });
    this.initOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.initOptions();
      });

    effect(() => {
      const selectedSkill = this.offerSkillService.selectedSkillComputed();
      setTimeout(() => {
        if (selectedSkill) {
          this.patchFormWithSkillData(selectedSkill);
        } else {
          this.skillForm.reset();
        }
      });
    });
  }

  initOptions() {
    this.proficiencyOptions = this._proficiencyOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof PROFICIENCY_OPTIONS;

    this.requirementLevelOptions = this._requirementLevelOptions.map(
      (item) => ({
        ...item,
        name: this.translateService.instant(item.name),
      })
    ) as typeof REQUIREMENT_LEVEL_OPTIONS;
    this.skillTypeOptions = this._skillTypeOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof SKILL_TYPES;
  }

  ngOnInit() {}

  get isEditMode() {
    return !!this.offerSkillService.selectedSkillComputed();
  }

  private patchFormWithSkillData(skill: OfferSkillResponse) {
    this.skillForm.patchValue({
      skillName: skill.skillName,
      proficiency: skill.proficiency,
      requirementLevel: skill.requirementLevel,
      description: skill.description,
      skillType: skill.skillType,
    });
  }

  onSave() {
    if (this.skillForm.valid) {
      const formValue = this.skillForm.value;
      const selectedSkill = this.offerSkillService.selectedSkillComputed();
      const skill: OfferSkillRequest = {
        skillName: formValue.skillName,
        proficiency: formValue.proficiency,
        requirementLevel: formValue.requirementLevel,
        description: formValue.description,
        skillType: formValue.skillType,
      };

      if (selectedSkill) {
        this.offerSkillService.updateSkill(skill);
      } else {
        this.offerSkillService.addSkill(skill);
      }

      this.offerSkillService.closeDialog();
    }
  }

  onHide() {
    this.skillForm.reset();
    this.offerSkillService.closeDialog();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
