import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateSocialLinksService } from '../../../../../core/services/candidate/candidate.social-links.service';
import { AddEditCandidateSocialLinksDialogComponent } from '../add-edit-candidate-social-links-dialog/add-edit-candidate-social-links-dialog.component';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-candidates-details-over-view-social-links',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    AddEditCandidateSocialLinksDialogComponent,
    HasRoleDirective,
  ],
  templateUrl: './candidates-details-over-view-social-links.component.html',
})
export class CandidatesDetailsOverViewSocialLinksComponent {
  socialLinksService = inject(CandidateSocialLinksService);
  candidateService = inject(CandidateService);
  socialLinks = this.candidateService.candidateSocialLinks;
  protected readonly window = window;

  private getIconForLinkType(type: string): string {
    const icons: Record<string, string> = {
      GITHUB: 'pi-github',
      LINKEDIN: 'pi-linkedin',
      PORTFOLIO: 'pi-globe',
      OTHER: 'pi-link',
    };
    return icons[type.toUpperCase().slice(0, -3)] || 'pi-link';
  }

  getSocialLinks(): {
    icon: string;
    label: string;
    url: string;
    type: string;
  }[] {
    if (!this.socialLinks()) {
      return [];
    }
    return Object.entries(this.socialLinks()!).map(([type, url]) => ({
      icon: this.getIconForLinkType(type),
      label: type,
      url: url as string,
      type: type,
    }));
  }

  onEditClick(): void {
    this.socialLinksService.openDialog(this.socialLinks()!);
  }
}
