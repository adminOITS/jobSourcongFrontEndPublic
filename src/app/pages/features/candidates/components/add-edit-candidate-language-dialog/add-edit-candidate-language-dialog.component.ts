import { Component, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LanguageService } from '../../../../../core/services/candidate/language.service';
import {
  LanguageRequest,
  LanguageResponse,
} from '../../../../../core/models/candidate.models';
import {
  LANGUAGE_OPTIONS_EN,
  LANGUAGE_OPTIONS_FR,
  LANGUAGE_PROFICIENCY_OPTIONS,
} from '../../../../../core/utils/constants';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-add-edit-candidate-language-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-candidate-language-dialog.component.html',
})
export class AddEditCandidateLanguageDialogComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  languageService = inject(LanguageService);
  isLoading = this.languageService.isLanguageLoading;

  languageForm: FormGroup = this.fb.group({
    languageName: ['', [Validators.required]],
    proficiency: ['', [Validators.required]],
  });

  languageOptions: any = [];
  private _languageProficiencyOptions = LANGUAGE_PROFICIENCY_OPTIONS;

  proficiencyLevels: { label: string; value: string }[] = [];

  constructor() {
    this.updateTranslations();

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.updateTranslations();
        this.languageOptions =
          lang.lang === 'en' ? LANGUAGE_OPTIONS_EN : LANGUAGE_OPTIONS_FR;
      });
    effect(() => {
      const selectedLanguage = this.languageService.selectedLanguageComputed();
      setTimeout(() => {
        if (selectedLanguage) {
          this.patchFormWithLanguageData(selectedLanguage);
        } else {
          this.languageForm.reset();
        }
      });
    });
  }

  patchFormWithLanguageData(language: LanguageResponse) {
    this.languageForm.patchValue({
      languageName: language.language,
      proficiency: language.proficiencyLevel,
    });
  }

  translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();

  updateTranslations() {
    this.proficiencyLevels = this._languageProficiencyOptions.map((option) => ({
      label: this.translateService.instant(option.name),
      value: option.name,
    }));
    this.languageOptions =
      this.translateService.currentLang === 'en'
        ? LANGUAGE_OPTIONS_EN
        : LANGUAGE_OPTIONS_FR;
  }

  onHide() {
    this.languageForm.reset();
    this.languageService.closeDialog();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.languageForm.valid) {
      const formValue = this.languageForm.value;
      const selectedLanguage = this.languageService.selectedLanguageComputed();

      const languageData: LanguageRequest = {
        language: formValue.languageName,
        proficiencyLevel: formValue.proficiency,
      };

      if (selectedLanguage) {
        this.languageService.updateLanguage(languageData);
      } else {
        this.languageService.addLanguage(languageData);
      }
    }
  }

  findLanguageOption(language: string) {
    return this.languageOptions.find((option: any) => option.name === language);
  }
}
