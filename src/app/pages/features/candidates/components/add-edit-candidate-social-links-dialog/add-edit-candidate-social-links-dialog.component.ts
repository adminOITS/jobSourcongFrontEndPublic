import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CandidateSocialLinksService } from '../../../../../core/services/candidate/candidate.social-links.service';
import { SocialLinksResponse } from '../../../../../core/models/candidate.models';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-edit-candidate-social-links-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-candidate-social-links-dialog.component.html',
})
export class AddEditCandidateSocialLinksDialogComponent {
  private fb = inject(FormBuilder);
  socialLinksService = inject(CandidateSocialLinksService);
  isLoading = this.socialLinksService.isSocialLinksLoading;
  selectedLinks = this.socialLinksService.selectedLinksComputed;
  route = inject(ActivatedRoute);
  candidateId!: string;

  socialLinksForm: FormGroup = this.fb.group({
    githubUrl: ['', [Validators.pattern('https?://.+')]],
    linkedinUrl: ['', [Validators.pattern('https?://.+')]],
    portfolioUrl: ['', [Validators.pattern('https?://.+')]],
    otherUrl: ['', [Validators.pattern('https?://.+')]],
  });

  constructor() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });

    effect(() => {
      const selectedLinks = this.selectedLinks();
      setTimeout(() => {
        if (selectedLinks) {
          this.patchValue();
        } else {
          this.socialLinksForm.reset();
        }
      });
    });
  }

  get isEditMode(): boolean {
    return !!this.selectedLinks();
  }
  patchValue() {
    this.socialLinksForm.patchValue({
      githubUrl: this.selectedLinks()?.githubUrl,
      linkedinUrl: this.selectedLinks()?.linkedinUrl,
      portfolioUrl: this.selectedLinks()?.portfolioUrl,
      otherUrl: this.selectedLinks()?.otherUrl,
    });
  }

  onSave() {
    if (this.socialLinksForm.valid) {
      const formValue = this.socialLinksForm.value;
      const newLinkedinUrl =
        formValue.linkedinUrl == '' ? null : formValue.linkedinUrl;
      const newGithubUrl =
        formValue.githubUrl == '' ? null : formValue.githubUrl;
      const newPortfolioUrl =
        formValue.portfolioUrl == '' ? null : formValue.portfolioUrl;
      const newOtherUrl = formValue.otherUrl == '' ? null : formValue.otherUrl;
      const socialLinks: SocialLinksResponse = {
        linkedinUrl: newLinkedinUrl,
        githubUrl: newGithubUrl,
        portfolioUrl: newPortfolioUrl,
        otherUrl: newOtherUrl,
      };
      this.socialLinksService.updateLinks(socialLinks);
    }
  }

  onHide() {
    this.socialLinksService.closeDialog();
    this.socialLinksForm.reset();
  }
}
