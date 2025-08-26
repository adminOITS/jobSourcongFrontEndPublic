import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { signal, computed } from '@angular/core';
import { MatchingResultService } from '../../../../../core/services/ats/matching-result.service';
import { OpenAiMatchDetailsResponseDto } from '../../../../../core/models/ats.models';

@Component({
  selector: 'app-description-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './description-view.component.html',
})
export class DescriptionViewComponent implements OnInit {
  @Output() fullScreenRequested = new EventEmitter<void>();

  private matchingResultService = inject(MatchingResultService);

  // Get data from service
  profile = computed(() => this.matchingResultService.currentProfile());
  candidateName = computed(
    () =>
      this.profile()?.candidate?.firstName +
        ' ' +
        this.profile()?.candidate?.lastName || 'Candidate Name'
  );
  profileTitle = computed(
    () => this.profile()?.profileTitle || 'Profile Title'
  );
  atsScore = computed(() => this.profile()?.score || 0);
  estimatedSeniority = computed(() => {
    const profile = this.profile();
    if (profile?.matchingResultDetails?.matchDetails?.estimated_seniority) {
      return profile.matchingResultDetails.matchDetails.estimated_seniority;
    }
    return 'N/A';
  });
  isInFullScreenMode = false;

  matchDetails = computed(() => {
    const profile = this.profile();
    if (profile?.matchingResultDetails?.matchDetails) {
      return profile.matchingResultDetails.matchDetails;
    }
    return null;
  });

  ngOnInit(): void {
    // Component is ready
  }

  openFullScreen(): void {
    this.fullScreenRequested.emit();
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  getScoreBgColor(score: number): string {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  }

  getProgressBarColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getRedFlagsArray(): Array<{ key: string; value: string }> {
    const redFlags = this.matchDetails()?.red_flags;
    if (!redFlags) return [];
    return Object.entries(redFlags).map(([key, value]) => ({
      key,
      value: value as string,
    }));
  }

  formatText(text: string): string[] {
    return text.split('\n').filter((line) => line.trim().length > 0);
  }

  getMatchIcon(score: number): string {
    if (score >= 80) return 'pi pi-check-circle';
    if (score >= 60) return 'pi pi-exclamation-triangle';
    return 'pi pi-times-circle';
  }

  getMatchIconColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }
}
