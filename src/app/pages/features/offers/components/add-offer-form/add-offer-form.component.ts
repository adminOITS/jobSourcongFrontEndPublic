import {
  Component,
  OnInit,
  inject,
  effect,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyResponse } from '../../../../../core/models/company.models';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PopoverModule } from 'primeng/popover';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { OfferRequest } from '../../../../../core/models/offer.models';
import {
  CATEGORIES,
  SKILL_TYPES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  PROFICIENCY_OPTIONS,
  REQUIREMENT_LEVEL_OPTIONS,
  LANGUAGE_PROFICIENCY_OPTIONS,
  CURRENCIES,
  OFFER_STATUS_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  LANGUAGE_OPTIONS_EN,
  LANGUAGE_OPTIONS_FR,
  JOB_CATEGORIES,
} from '../../../../../core/utils/constants';
import { AppSettingsService } from '../../../../../core/services/app-settings.service';
import { Subject, takeUntil } from 'rxjs';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { ActivatedRoute } from '@angular/router';
import { MessageWrapperService } from '../../../../../core/services/message-wrapper.service';
type SkillFormGroup = {
  skillName: FormControl<string>;
  proficiency: FormControl<
    'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BEGINNER' | null
  >;
  requirementLevel: FormControl<'REQUIRED' | 'OPTIONAL' | 'PREFERRED' | null>;
  description: FormControl<string | null>;
  skillType: FormControl<'HARD_SKILL' | 'SOFT_SKILL' | null>;
};

type LanguageFormGroup = {
  language: FormControl<string | null>;
  proficiency: FormControl<
    'NATIVE' | 'FLUENT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC' | null
  >;
  requirementLevel: FormControl<'REQUIRED' | 'OPTIONAL' | 'PREFERRED' | null>;
  description: FormControl<string | null>;
};

type EducationFormGroup = {
  degree: FormControl<string>;
  field: FormControl<string>;
  institution: FormControl<string>;
  requirementLevel: FormControl<'REQUIRED' | 'OPTIONAL' | 'PREFERRED' | null>;
  description: FormControl<string | null>;
};

type ExperienceFormGroup = {
  title: FormControl<string | null>;
  companyName: FormControl<string | null>;
  description: FormControl<string | null>;
  yearsRequired: FormControl<number | null>;
  requirementLevel: FormControl<'REQUIRED' | 'OPTIONAL' | 'PREFERRED' | null>;
};

// type AdditionalInfoFormGroup = {
//   name: FormControl<string>;
//   description: FormControl<string | null>;
//   requirementLevel: FormControl<'REQUIRED' | 'OPTIONAL' | 'PREFERRED' | null>;
//   skillType: FormControl<'FUNCTIONAL_SKILL' | 'TECHNICAL_SKILL' | null>;
// };

@Component({
  selector: 'app-add-offer-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    FloatLabelModule,
    PopoverModule,
    TranslateModule,
    EditorModule,
    InputNumberModule,
    StepperModule,
    RadioButtonModule,
    CheckboxModule,
    TextareaModule,
    TagModule,
  ],
  templateUrl: './add-offer-form.component.html',
  styles: ``,
})
export class AddOfferFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private translateService = inject(TranslateService);
  private appSettingsService = inject(AppSettingsService);
  private offerService = inject(OfferService);
  isLoading = this.offerService.isOfferActionLoading;
  offerForm: FormGroup;
  showCustomCategory = false;
  value = signal(1);
  // Original arrays
  private _statusOptions = OFFER_STATUS_OPTIONS;
  private _skillTypes = SKILL_TYPES;
  private _employmentTypes = EMPLOYMENT_TYPES;
  private _workModes = WORK_MODES;
  private _proficiencyOptions = PROFICIENCY_OPTIONS;
  private _requirementLevelOptions = REQUIREMENT_LEVEL_OPTIONS;
  private _languageProficiencyOptions = LANGUAGE_PROFICIENCY_OPTIONS;
  private _contractTypeOptions = CONTRACT_TYPE_OPTIONS;
  languageOptions: any = [];

  // Translated arrays
  categories: typeof CATEGORIES = [];
  statusOptions: typeof OFFER_STATUS_OPTIONS = [];
  skillTypes: typeof SKILL_TYPES = [];
  employmentTypes: typeof EMPLOYMENT_TYPES = [];
  workModes: typeof WORK_MODES = [];
  proficiencyOptions: typeof PROFICIENCY_OPTIONS = [];
  requirementLevelOptions: typeof REQUIREMENT_LEVEL_OPTIONS = [];
  languageProficiencyOptions: typeof LANGUAGE_PROFICIENCY_OPTIONS = [];
  contractTypeOptions: typeof CONTRACT_TYPE_OPTIONS = [];
  currencies: typeof CURRENCIES = CURRENCIES;
  jobCategories: typeof JOB_CATEGORIES = [];
  companyId!: string;
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageWrapperService);
  constructor() {
    effect(() => {
      this.translateService.onLangChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang) => {
          this.appSettingsService.setTitle(
            this.translateService.instant('ADD_OFFER')
          );
        });
    });
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      employmentType: ['', Validators.required],
      workMode: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      category: [null, Validators.required],
      contractType: ['', Validators.required],
      minRemuneration: [0, [Validators.required, Validators.min(0)]],
      maxRemuneration: [0, [Validators.required, Validators.min(0)]],
      currency: [this.currencies[0], Validators.required],
      description: [''],
      benefits: [''],
      notes: [''],
      skills: this.fb.array<FormGroup<SkillFormGroup>>([]),
      languages: this.fb.array<FormGroup<LanguageFormGroup>>([]),
      education: this.fb.array<FormGroup<EducationFormGroup>>([]),
      experiences: this.fb.array<FormGroup<ExperienceFormGroup>>([]),
      // additionalInfos: this.fb.array<FormGroup<AdditionalInfoFormGroup>>([]),
    });

    // Watch for category changes
    // this.offerForm.get('category')?.valueChanges.subscribe((value) => {
    //   this.showCustomCategory = value?.value === 'Other';
    //   if (this.showCustomCategory) {
    //     this.offerForm
    //       .get('customCategory')
    //       ?.setValidators([Validators.required]);
    //   } else {
    //     this.offerForm.get('customCategory')?.clearValidators();
    //     this.offerForm.get('customCategory')?.setValue(null);
    //   }
    //   this.offerForm.get('customCategory')?.updateValueAndValidity();
    // });

    this.initializeOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.initializeOptions();
        this.languageOptions =
          lang.lang === 'en' ? LANGUAGE_OPTIONS_EN : LANGUAGE_OPTIONS_FR;
      });
  }
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Add cross-field validation for min/max remuneration
    this.offerForm.get('maxRemuneration')?.setValidators([
      Validators.required,
      Validators.min(0),
      (control) => {
        const minValue = this.offerForm.get('minRemuneration')?.value;
        if (minValue && control.value && control.value < minValue) {
          return { maxLessThanMin: true };
        }
        return null;
      },
    ]);
    this.offerForm.get('minRemuneration')?.setValidators([
      Validators.required,
      Validators.min(0),
      (control) => {
        const maxValue = this.offerForm.get('maxRemuneration')?.value;
        if (maxValue && control.value && control.value > maxValue) {
          return { minGreaterThanMax: true };
        }
        return null;
      },
    ]);

    // Update remuneration inputs when currency changes
    this.offerForm.get('currency')?.valueChanges.subscribe((currency) => {
      if (currency) {
        const minControl = this.offerForm.get('minRemuneration');
        const maxControl = this.offerForm.get('maxRemuneration');

        if (minControl?.value) {
          minControl.setValue(minControl.value);
        }
        if (maxControl?.value) {
          maxControl.setValue(maxControl.value);
        }
      }
    });
  }
  onSubmit() {
    if (this.offerForm.valid) {
      const formValue = this.offerForm.value;
      const offer: OfferRequest = {
        title: formValue.title,
        employmentType: formValue.employmentType,
        workMode: formValue.workMode,
        country: formValue.country,
        city: formValue.city,
        zipCode: formValue.zipCode,
        category: formValue.category,
        minRemuneration: formValue.minRemuneration,
        maxRemuneration: formValue.maxRemuneration,
        currency: formValue.currency.code,
        description: formValue.description,
        benefits: formValue.benefits,
        notes: formValue.notes,
        skills: formValue.skills.map((skill: any) => ({
          skillName: skill.skillName,
          proficiency: skill.proficiency.value,
          requirementLevel: skill.requirementLevel.value,
          description: skill.description,
          skillType: skill.skillType.value,
        })),
        languages: formValue.languages.map((language: any) => ({
          language: language.language,
          proficiency: language.proficiency.value,
          requirementLevel: language.requirementLevel.value,
          description: language.description,
        })),
        educations: formValue.education.map((education: any) => ({
          degree: education.degree,
          field: education.field,
          institution: education.institution,
          requirementLevel: education.requirementLevel.value,
          description: education.description,
        })),
        experiences: formValue.experiences.map((experience: any) => ({
          title: experience.title,
          companyName: experience.companyName,
          description: experience.description,
          yearsRequired: experience.yearsRequired,
          requirementLevel: experience.requirementLevel.value,
        })),
        // additionalInfos: formValue.additionalInfos.map(
        //   (additionalInfo: any) => ({
        //     name: additionalInfo.name,
        //     description: additionalInfo.description,
        //     requirementLevel: additionalInfo.requirementLevel.value,
        //     skillType: additionalInfo.skillType.value,
        //   })
        // ),
        additionalInfos: [],
        contractType: formValue.contractType,
      };
      this.offerService.createOffer(this.companyId, offer);
    } else {
      Object.keys(this.offerForm.controls).forEach((key) => {
        const control = this.offerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get skills() {
    return this.offerForm.get('skills') as FormArray<FormGroup<SkillFormGroup>>;
  }

  get languages() {
    return this.offerForm.get('languages') as FormArray<
      FormGroup<LanguageFormGroup>
    >;
  }

  get education() {
    return this.offerForm.get('education') as FormArray<
      FormGroup<EducationFormGroup>
    >;
  }

  get experiences() {
    return this.offerForm.get('experiences') as FormArray<
      FormGroup<ExperienceFormGroup>
    >;
  }

  // get additionalInfos() {
  //   return this.offerForm.get('additionalInfos') as FormArray<
  //     FormGroup<AdditionalInfoFormGroup>
  //   >;
  // }

  addSkill() {
    if (this.skills.controls.some((control) => control.invalid)) {
      const msg = this.translateService.instant(
        'PLEASE_FILL_IN_ALL_SKILL_FIELDS_BEFORE_ADDING_A_NEW_ONE'
      );
      this.messageService.error(msg);
      return;
    }
    this.skills.push(
      this.fb.group<SkillFormGroup>({
        skillName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        proficiency: new FormControl(null, {
          validators: [Validators.required],
        }),
        requirementLevel: new FormControl(null, {
          validators: [Validators.required],
        }),
        description: new FormControl('', {
          nonNullable: true,
        }),
        skillType: new FormControl(null, {
          validators: [Validators.required],
        }),
      })
    );
  }

  addLanguage() {
    if (this.languages.controls.some((control) => control.invalid)) {
      const msg = this.translateService.instant(
        'PLEASE_FILL_IN_ALL_LANGUAGE_FIELDS_BEFORE_ADDING_A_NEW_ONE'
      );
      this.messageService.error(msg);
      return;
    }
    this.languages.push(
      this.fb.group<LanguageFormGroup>({
        language: new FormControl(null, {
          validators: [Validators.required],
        }),
        proficiency: new FormControl(null, {
          validators: [Validators.required],
        }),
        requirementLevel: new FormControl(null, {
          validators: [Validators.required],
        }),
        description: new FormControl('', {
          nonNullable: true,
        }),
      })
    );
  }

  addEducation() {
    if (this.education.controls.some((control) => control.invalid)) {
      const msg = this.translateService.instant(
        'PLEASE_FILL_IN_ALL_EDUCATION_FIELDS_BEFORE_ADDING_A_NEW_ONE'
      );
      this.messageService.error(msg);
      return;
    }
    this.education.push(
      this.fb.group<EducationFormGroup>({
        degree: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        field: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        institution: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        requirementLevel: new FormControl(null, {
          validators: [Validators.required],
        }),
        description: new FormControl('', {
          nonNullable: true,
        }),
      })
    );
  }

  addExperience() {
    if (this.experiences.controls.some((control) => control.invalid)) {
      const msg = this.translateService.instant(
        'PLEASE_FILL_IN_ALL_EXPERIENCE_FIELDS_BEFORE_ADDING_A_NEW_ONE'
      );
      this.messageService.error(msg);
      return;
    }
    this.experiences.push(
      this.fb.group<ExperienceFormGroup>({
        title: new FormControl(null, {
          validators: [Validators.required],
        }),
        companyName: new FormControl(null, {}),
        description: new FormControl('', {}),
        yearsRequired: new FormControl(null, {
          validators: [Validators.required],
        }),
        requirementLevel: new FormControl(null, {
          validators: [Validators.required],
        }),
      })
    );
  }

  // addAdditionalInfo() {
  //   if (this.additionalInfos.controls.some((control) => control.invalid)) {
  //     const msg = this.translateService.instant(
  //       'PLEASE_FILL_IN_ALL_ADDITIONAL_INFO_FIELDS_BEFORE_ADDING_A_NEW_ONE'
  //     );
  //     this.messageService.error(msg);
  //     return;
  //   }
  //   this.additionalInfos.push(
  //     this.fb.group<AdditionalInfoFormGroup>({
  //       name: new FormControl('', {
  //         nonNullable: true,
  //         validators: [Validators.required],
  //       }),
  //       description: new FormControl('', {}),
  //       requirementLevel: new FormControl(null, {
  //         validators: [Validators.required],
  //       }),
  //       skillType: new FormControl(null, {
  //         validators: [Validators.required],
  //       }),
  //     })
  //   );
  // }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  removeExperience(index: number) {
    this.experiences.removeAt(index);
  }

  // removeAdditionalInfo(index: number) {
  //   this.additionalInfos.removeAt(index);
  // }

  private initializeOptions() {
    this.languageOptions =
      this.translateService.currentLang === 'en'
        ? LANGUAGE_OPTIONS_EN
        : LANGUAGE_OPTIONS_FR;
    this.employmentTypes = this._employmentTypes.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof EMPLOYMENT_TYPES;

    this.workModes = this._workModes.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof WORK_MODES;

    this.statusOptions = this._statusOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof OFFER_STATUS_OPTIONS;

    this.skillTypes = this._skillTypes.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof SKILL_TYPES;

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

    this.languageProficiencyOptions = this._languageProficiencyOptions.map(
      (item) => ({
        ...item,
        name: this.translateService.instant(item.name),
      })
    ) as typeof LANGUAGE_PROFICIENCY_OPTIONS;

    this.contractTypeOptions = this._contractTypeOptions.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    })) as typeof CONTRACT_TYPE_OPTIONS;

    this.jobCategories = JOB_CATEGORIES.map((item) => ({
      ...item,
      name: this.translateService.instant(item.name),
    }));
  }

  isSecondStepValid(): boolean {
    // Adjust the controls according to what your Step 2 contains
    const skillsValid = this.skills.valid;
    const languagesValid = this.languages.valid;
    const educationValid = this.education.valid;
    const experiencesValid = this.experiences.valid;
    // const additionalInfosValid = this.additionalInfos.valid;
    return (
      skillsValid && languagesValid && educationValid && experiencesValid
      // additionalInfosValid
    );
  }

  isFirstStepValid(): boolean {
    const titleValid = this.offerForm.get('title')?.valid ?? false;
    const employmentTypeValid =
      this.offerForm.get('employmentType')?.valid ?? false;
    const workModeValid = this.offerForm.get('workMode')?.valid ?? false;
    const countryValid = this.offerForm.get('country')?.valid ?? false;
    const cityValid = this.offerForm.get('city')?.valid ?? false;
    const zipCodeValid = this.offerForm.get('zipCode')?.valid ?? false;
    const categoryValid = this.offerForm.get('category')?.valid ?? false;
    const contractTypeValid =
      this.offerForm.get('contractType')?.valid ?? false;
    const minRemunerationValid =
      this.offerForm.get('minRemuneration')?.valid ?? false;
    const maxRemunerationValid =
      this.offerForm.get('maxRemuneration')?.valid ?? false;
    return (
      titleValid &&
      employmentTypeValid &&
      workModeValid &&
      countryValid &&
      cityValid &&
      zipCodeValid &&
      categoryValid &&
      contractTypeValid &&
      minRemunerationValid &&
      maxRemunerationValid
    );
  }

  onStepChange(value: number) {
    // If moving to step 2, validate step 1
    if (value === 2 && !this.isFirstStepValid()) {
      this.markStep1ControlsTouched();
      this.messageService.error(
        this.translateService.instant('PLEASE_COMPLETE_STEP_1')
      );
      return;
    }
    // If moving to step 3, validate step 2
    if (value === 3 && !this.isSecondStepValid()) {
      this.markStep2ControlsTouched();
      this.messageService.error(
        this.translateService.instant('PLEASE_COMPLETE_STEP_2')
      );
      return;
    }
    this.value.set(value);
  }

  markStep1ControlsTouched() {
    [
      'title',
      'employmentType',
      'workMode',
      'country',
      'city',
      'zipCode',
      'category',
      'contractType',
      'minRemuneration',
      'maxRemuneration',
      'currency',
    ].forEach((controlName) => {
      this.offerForm.get(controlName)?.markAsTouched();
    });
  }

  markStep2ControlsTouched() {
    this.skills.controls.forEach((control) => control.markAllAsTouched());
    this.languages.controls.forEach((control) => control.markAllAsTouched());
    this.education.controls.forEach((control) => control.markAllAsTouched());
    this.experiences.controls.forEach((control) => control.markAllAsTouched());
    // this.additionalInfos.controls.forEach((control) =>
    //   control.markAllAsTouched()
    // );
  }
}
