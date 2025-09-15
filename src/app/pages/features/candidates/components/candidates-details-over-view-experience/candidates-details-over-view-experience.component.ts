import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ExperienceCardComponent } from '../experience-card/experience-card.component';
import { AddEditCandidateExperienceDialogComponent } from '../add-edit-candidate-experience-dialog/add-edit-candidate-experience-dialog.component';
import { ExperienceService } from '../../../../../core/services/candidate/experience.service';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-candidates-details-over-view-experience',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    ExperienceCardComponent,
    AddEditCandidateExperienceDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-experience.component.html',
})
export class CandidatesDetailsOverViewExperienceComponent implements OnInit {
  @Input() isApplicationReview: boolean = false;
  @Input() isEditAllowed: boolean = false;
  experienceService = inject(ExperienceService);
  private candidateService = inject(CandidateService);
  experiences = this.candidateService.candidateExperiences;
  constructor() {}

  ngOnInit(): void {
    // TODO: Load experiences from service
  }
}
