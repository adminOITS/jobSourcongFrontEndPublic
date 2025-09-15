import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AddEditCandidateEducationDialogComponent } from '../add-edit-candidate-education-dialog/add-edit-candidate-education-dialog.component';
import { EducationService } from '../../../../../core/services/candidate/education.service';
import { EducationCardComponent } from '../education-card/education-card.component';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-candidates-details-over-view-education',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    AddEditCandidateEducationDialogComponent,
    EducationCardComponent,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-education.component.html',
})
export class CandidatesDetailsOverViewEducationComponent {
  @Input() isApplicationReview: boolean = false;
  @Input() isEditAllowed: boolean = false;

  educationService = inject(EducationService);
  candidateService = inject(CandidateService);
  educations = this.candidateService.candidateEducation;

  // Use computed values from service

  openAddDialog() {
    this.educationService.openAddDialog();
  }
}
