import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SkillCardComponent } from '../skill-card/skill-card.component';
import { AddEditCandidateSkillDialogComponent } from '../add-edit-candidate-skill-dialog/add-edit-candidate-skill-dialog.component';
import { SkillService } from '../../../../../core/services/candidate/skill.service';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-candidates-details-over-view-skills',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    SkillCardComponent,
    AddEditCandidateSkillDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-skills.component.html',
})
export class CandidatesDetailsOverViewSkillsComponent {
  skillService = inject(SkillService);
  candidateService = inject(CandidateService);
  skills = this.candidateService.candidateSkills;
}
