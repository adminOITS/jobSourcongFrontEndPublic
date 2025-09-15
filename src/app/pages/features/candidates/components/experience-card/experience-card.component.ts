import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ExperienceService } from '../../../../../core/services/candidate/experience.service';
import { ExperienceResponse } from '../../../../../core/models/candidate.models';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { formatDateSafely } from '../../../../../core/utils';
@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    HasRoleDirective,
  ],
  templateUrl: './experience-card.component.html',
  providers: [ConfirmationService],
})
export class ExperienceCardComponent {
  @Input() isEditAllowed: boolean = false;
  @ViewChild('menu') menu!: Menu;
  @Input() experience!: ExperienceResponse;
  @Input() isApplicationReview: boolean = false;
  experienceService = inject(ExperienceService);
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
        command: () => this.experienceService.openEditDialog(this.experience),
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
      message: 'Are you sure you want to delete this experience?',
      header: 'Delete Experience',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.experienceService.setSelectedExperience(this.experience);
        this.experienceService.deleteExperience();
      },
    });
  }
}
