import { Component, inject, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateResponse } from '../../../../../core/models/candidate.models';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditCandidatePersonalInfoDialogComponent } from '../add-edit-candidate-personal-info-dialog/add-edit-candidate-personal-info-dialog.component';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { CandidateDetailsProfileCardComponent } from '../candidate-details-profile-card/candidate-details-profile-card.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-candidates-details-over-view-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    AddEditCandidatePersonalInfoDialogComponent,
    CandidateDetailsProfileCardComponent,
    ToastModule,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-profile.component.html',
})
export class CandidatesDetailsOverViewProfileComponent {
  candidateService = inject(CandidateService);
  candidate = this.candidateService.candidateDetails;
  get fullName(): string {
    return `${this.candidate()?.firstName} ${this.candidate()?.lastName}`;
  }

  get location(): string {
    if (!this.candidate()?.address) return '';
    return `${this.candidate()?.address.city}, ${
      this.candidate()?.address.country
    }`;
  }

  get currentExperience() {
    return this.candidate()?.experiences.find((exp) => exp.current);
  }

  get hasAnyContactInfo(): boolean {
    return !!(
      this.candidate()?.email ||
      this.candidate()?.phone ||
      this.location ||
      this.candidate()?.address?.addressLine1 ||
      this.candidate()?.address?.addressLine2 ||
      this.candidate()?.address?.zipCode
    );
  }

  // copySuccessToastVisible: boolean = false;

  messageService = inject(MessageService);
  showConfirm(summary: string) {
    // if (!this.copySuccessToastVisible) {
    this.messageService.add({
      key: 'confirm',
      severity: 'custom',
      summary: summary,
    });
    // this.copySuccessToastVisible = true;
    // }
  }

  openEditDialog() {
    this.candidateService.openEditDialog(this.candidate()!);
  }

  onReject() {
    this.messageService.clear('confirm');
    // this.copySuccessToastVisible = false;
  }
}
