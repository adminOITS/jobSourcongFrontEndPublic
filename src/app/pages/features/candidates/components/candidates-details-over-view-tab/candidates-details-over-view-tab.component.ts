import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CandidateResponse } from '../../../../../core/models/candidate.models';
import { CandidatesDetailsOverViewProfileComponent } from '../candidates-details-over-view-profile/candidates-details-over-view-profile.component';
import { CandidatesDetailsOverViewExperienceComponent } from '../candidates-details-over-view-experience/candidates-details-over-view-experience.component';
import { CandidatesDetailsOverViewSkillsComponent } from '../candidates-details-over-view-skills/candidates-details-over-view-skills.component';
import { CandidatesDetailsOverViewEducationComponent } from '../candidates-details-over-view-education/candidates-details-over-view-education.component';
import { CandidatesDetailsOverViewLanguagesComponent } from '../candidates-details-over-view-languages/candidates-details-over-view-languages.component';
import { CandidatesDetailsOverViewSocialLinksComponent } from '../candidates-details-over-view-social-links/candidates-details-over-view-social-links.component';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';

type TagSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

@Component({
  selector: 'app-candidates-details-over-view-tab',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    DividerModule,
    ButtonModule,
    CandidatesDetailsOverViewProfileComponent,
    CandidatesDetailsOverViewExperienceComponent,
    CandidatesDetailsOverViewSkillsComponent,
    CandidatesDetailsOverViewEducationComponent,
    CandidatesDetailsOverViewLanguagesComponent,
    CandidatesDetailsOverViewSocialLinksComponent,
  ],
  templateUrl: './candidates-details-over-view-tab.component.html',
  styles: [],
})
export class CandidatesDetailsOverViewTabComponent {}
