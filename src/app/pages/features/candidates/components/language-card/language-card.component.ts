import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LanguageResponse } from '../../../../../core/models/candidate.models';
import { LanguageService } from '../../../../../core/services/candidate/language.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-language-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    HasRoleDirective,
  ],
  templateUrl: './language-card.component.html',
  providers: [ConfirmationService],
})
export class LanguageCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() language!: LanguageResponse;
  @Output() delete = new EventEmitter<string>();

  languageService = inject(LanguageService);
  confirmationService = inject(ConfirmationService);

  menuItems: MenuItem[] | undefined = [];
  translateService = inject(TranslateService);
  constructor() {
    this.initMenuItems();
    this.translateService.onLangChange.subscribe(() => {
      this.initMenuItems();
    });
  }

  initMenuItems() {
    this.menuItems = [
      {
        label: this.translateService.instant('EDIT') as string,
        icon: 'pi pi-pencil',
        command: () => this.languageService.openEditDialog(this.language),
      },
      {
        label: this.translateService.instant('DELETE'),
        icon: 'pi pi-trash',
        command: () => this.confirmDelete(),
      },
    ];
  }
  getProficiencyWidth(proficiency: string): string {
    switch (proficiency) {
      case 'NATIVE':
        return '100%';
      case 'ADVANCED':
        return '80%';
      case 'INTERMEDIATE':
        return '60%';
      case 'BEGINNER':
        return '40%';
      default:
        return '0%';
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this language?',
      header: 'Delete Language',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.languageService.setSelectedLanguage(this.language);
        this.languageService.deleteLanguage();
      },
    });
  }
}
