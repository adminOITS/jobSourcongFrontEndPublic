import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { LanguageService } from '../../../../../core/services/candidate/language.service';
import { AddEditCandidateLanguageDialogComponent } from '../add-edit-candidate-language-dialog/add-edit-candidate-language-dialog.component';
import { LanguageCardComponent } from '../language-card/language-card.component';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-candidates-details-over-view-languages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    AddEditCandidateLanguageDialogComponent,
    LanguageCardComponent,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-languages.component.html',
})
export class CandidatesDetailsOverViewLanguagesComponent {
  @Input() isApplicationReview: boolean = false;
  @Input() isEditAllowed: boolean = false;

  languageService = inject(LanguageService);
  candidateService = inject(CandidateService);
  languages = this.candidateService.candidateLanguages;

  menuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (event: any) => {
        const language = event.item.language;
        this.languageService.openEditDialog(language);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (event: any) => {
        const language = event.item.language;
        this.onDeleteLanguage(language.id);
      },
    },
  ];

  getProficiencyWidth(proficiency: string): string {
    switch (proficiency) {
      case 'Native':
        return '100%';
      case 'Fluent':
        return '80%';
      case 'Intermediate':
        return '60%';
      case 'Basic':
        return '40%';
      default:
        return '0%';
    }
  }

  onDeleteLanguage(id: string) {
    this.languageService.deleteLanguage();
  }
}
