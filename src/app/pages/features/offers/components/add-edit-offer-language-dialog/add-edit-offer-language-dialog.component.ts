import { Component, inject, effect, OnDestroy } from '@angular/core';
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
  OfferLanguageRequest,
  OfferLanguageResponse,
} from '../../../../../core/models/offer.models';
import { OfferLanguageService } from '../../../../../core/services/offer/offer.language.service';
import {
  LANGUAGE_OPTIONS_EN,
  LANGUAGE_OPTIONS_FR,
  LANGUAGE_PROFICIENCY_OPTIONS,
  REQUIREMENT_LEVEL_OPTIONS,
} from '../../../../../core/utils/constants';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-offer-language-dialog',
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
  templateUrl: './add-edit-offer-language-dialog.component.html',
})
export class AddEditOfferLanguageDialogComponent implements OnDestroy {
  languageForm: FormGroup;

  private _requirementLevelOptions = REQUIREMENT_LEVEL_OPTIONS;
  private _languageProficiencyOptions = LANGUAGE_PROFICIENCY_OPTIONS;

  requirementLevelOptions: typeof REQUIREMENT_LEVEL_OPTIONS = [];
  languageProficiencyOptions: typeof LANGUAGE_PROFICIENCY_OPTIONS = [];
  private fb = inject(FormBuilder);
  offerLanguageService = inject(OfferLanguageService);
  isLoading = this.offerLanguageService.isLanguageLoading;
  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  offerId!: string;
  languageOptions: any = [];

  constructor() {
    this.offerId = this.route.snapshot.params['id'];
    this.languageForm = this.fb.group({
      language: [null, Validators.required],
      proficiency: [null, Validators.required],
      requirementLevel: [null, Validators.required],
      description: [''],
    });
    this.initOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.initOptions();
        this.languageOptions =
          lang.lang === 'en' ? LANGUAGE_OPTIONS_EN : LANGUAGE_OPTIONS_FR;
      });
    effect(() => {
      const selectedLanguage =
        this.offerLanguageService.selectedLanguageComputed();
      setTimeout(() => {
        if (selectedLanguage) {
          this.patchFormWithLanguageData(selectedLanguage);
        } else {
          this.languageForm.reset();
        }
      });
    });
  }

  initOptions() {
    this.languageOptions =
      this.translateService.currentLang === 'en'
        ? LANGUAGE_OPTIONS_EN
        : LANGUAGE_OPTIONS_FR;
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
  }

  get isEditMode() {
    return !!this.offerLanguageService.selectedLanguageComputed();
  }

  private patchFormWithLanguageData(language: OfferLanguageResponse) {
    this.languageForm.patchValue({
      language: language.language,
      proficiency: language.proficiency,
      requirementLevel: language.requirementLevel,
      description: language.description,
    });
  }

  onSave() {
    if (this.languageForm.valid) {
      const formValue = this.languageForm.value;
      const selectedLanguage =
        this.offerLanguageService.selectedLanguageComputed();
      const language: OfferLanguageRequest = {
        language: formValue.language,
        proficiency: formValue.proficiency,
        requirementLevel: formValue.requirementLevel,
        description: formValue.description,
      };

      if (selectedLanguage) {
        this.offerLanguageService.updateLanguage(language);
      } else {
        this.offerLanguageService.addLanguage(language);
      }

      this.offerLanguageService.closeDialog();
    }
  }

  onHide() {
    this.languageForm.reset();
    this.offerLanguageService.closeDialog();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
