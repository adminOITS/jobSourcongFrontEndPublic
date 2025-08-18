import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { EducationResponse } from '../../../../../core/models/candidate.models';
import { EducationService } from '../../../../../core/services/candidate/education.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { formatDateSafely } from '../../../../../core/utils';
@Component({
  selector: 'app-education-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    HasRoleDirective,
  ],
  templateUrl: './education-card.component.html',
  providers: [ConfirmationService],
})
export class EducationCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() education!: EducationResponse;
  educationService = inject(EducationService);
  confirmationService = inject(ConfirmationService);

  menuItems: MenuItem[] | undefined = [];
  translateService = inject(TranslateService);
  formatDateSafely = formatDateSafely;
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
        command: () => this.educationService.openEditDialog(this.education),
      },
      {
        label: this.translateService.instant('DELETE'),
        icon: 'pi pi-trash',
        command: () => this.confirmDelete(),
      },
    ];
  }

  confirmDelete() {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.educationService.setSelectedEducation(this.education);
        this.educationService.deleteEducation();
      },
    });
  }
}
