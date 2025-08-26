import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { MatchingResultService } from '../../../../../core/services/ats/matching-result.service';
import { ProfileShortResponseDto } from '../../../../../core/models/ats.models';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-offer-ats-profiles-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    TagModule,
  ],
  templateUrl: './offer-ats-profiles-list.component.html',
  styles: [
    `
      .profile-card {
        transition: all 0.2s ease-in-out;
      }

      .profile-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .score-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
    `,
  ],
})
export class OfferAtsProfilesListComponent implements OnInit {
  @Input() offerId!: string;

  private matchingResultService = inject(MatchingResultService);
  private router = inject(Router);

  // Pagination state
  currentLimit = signal<number>(10);
  availableLimits = [10, 25, 50];

  // Computed properties from service
  readonly profiles = this.matchingResultService.topMatches;
  readonly isLoading = computed(() =>
    this.matchingResultService.isTopMatchesLoading()
  );
  readonly hasNext = computed(() => this.profiles()?.hasNext || false);

  ngOnInit(): void {
    if (this.offerId) {
      this.loadProfiles();
    }
  }

  /**
   * Load profiles with current filters and limit
   */
  loadProfiles(): void {
    if (!this.offerId) return;

    this.matchingResultService.getTopByTotalMatchAdvanced(this.offerId, {
      limit: this.currentLimit(),
    });
  }

  /**
   * Load more profiles (pagination)
   */
  loadMore(): void {
    if (!this.offerId || !this.hasNext()) return;

    this.matchingResultService.loadMoreTopMatches(this.offerId);
  }

  /**
   * Change the limit and reload profiles
   */
  changeLimit(event: Event): void {
    const newLimit = Number((event.target as HTMLSelectElement).value);
    this.currentLimit.set(newLimit);
    this.matchingResultService.clearTopMatches();
    this.loadProfiles();
  }

  /**
   * Get score color based on score value
   */
  getScoreColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  /**
   * Get severity level based on score value
   * Returns PrimeNG severity values: 'success', 'info', 'warn', 'danger'
   * Note: 'info' severity has poor contrast in dark mode, so we use 'success' for high scores
   */
  getSeverity(score: number): 'success' | 'warn' | 'danger' {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warn';
    return 'danger';
  }

  /**
   * Get score background color for progress bar
   */
  getScoreBgColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  /**
   * Format candidate name
   */
  getCandidateName(profile: ProfileShortResponseDto): string {
    return (
      `${profile.candidate?.firstName || ''} ${
        profile.candidate?.lastName || ''
      }`.trim() || 'Unknown Candidate'
    );
  }

  /**
   * Get profile skills as tags
   */
  getProfileSkills(profile: ProfileShortResponseDto): string[] {
    // This would need to be implemented based on your profile data structure
    // For now, returning a placeholder
    return ['Java', 'Spring Boot', 'AWS'];
  }

  /**
   * Track profiles by ID for ngFor optimization
   */
  trackByProfileId(index: number, profile: ProfileShortResponseDto): string {
    return profile.id;
  }

  /**
   * Navigate to profile details page
   */
  viewProfileDetails(profile: ProfileShortResponseDto): void {
    const currentUrl = this.router.url;
    this.router.navigate([
      `${currentUrl.split('/')[1]}/ats/offers/${this.offerId}/candidates/${
        profile.candidate.id
      }/profiles/${profile.id}`,
    ]);
  }
}
