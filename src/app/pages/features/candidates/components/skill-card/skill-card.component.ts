import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { SkillService } from '../../../../../core/services/candidate/skill.service';
import { SkillResponse } from '../../../../../core/models/candidate.models';
import { Component, ViewChild } from '@angular/core';
import { inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    HasRoleDirective,
  ],
  templateUrl: './skill-card.component.html',
  providers: [ConfirmationService],
})
export class SkillCardComponent {
  @ViewChild('menu') menu!: Menu;
  @Input() skill!: SkillResponse;
  skillService = inject(SkillService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  menuItems: MenuItem[] | undefined = [];
  translateService = inject(TranslateService);
  candidateId!: string;
  constructor() {
    this.candidateId = this.route.snapshot.params['id'];
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
        command: () => this.skillService.openEditDialog(this.skill),
      },
      {
        label: this.translateService.instant('DELETE'),
        icon: 'pi pi-trash',
        command: () => this.confirmDelete(),
      },
    ];
  }

  getProficiencyWidth(proficiencyLevel: string): string {
    switch (proficiencyLevel) {
      case 'EXPERT':
        return '100%';
      case 'ADVANCED':
        return '75%';
      case 'INTERMEDIATE':
        return '50%';
      case 'BEGINNER':
        return '25%';
      default:
        return '0%';
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      header: '{{ "DELETE_SKILL" | translate }}',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.skillService.setSelectedSkill(this.skill);
        this.skillService.deleteSkill();
      },
    });
  }
}
