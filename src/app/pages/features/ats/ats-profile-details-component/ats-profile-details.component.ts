import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { ResumeViewComponent } from '../components/resume-view/resume-view.component';
import { DescriptionViewComponent } from '../components/description-view/description-view.component';
import { AtsModalComponent } from '../components/ats-modal/ats-modal.component';
import { MatchingResultService } from '../../../../core/services/ats/matching-result.service';
import { LoaderComponent } from '../../../../shared/loader/loader.component';

@Component({
  selector: 'app-ats-profile-details',
  standalone: true,
  imports: [
    CommonModule,
    ResumeViewComponent,
    DescriptionViewComponent,
    AtsModalComponent,
    LoaderComponent,
    TranslateModule,
  ],
  templateUrl: './ats-profile-details.component.html',
  styles: ``,
})
export class AtsProfileDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private matchingResultService = inject(MatchingResultService);

  // URL Parameters
  private offerId = signal<string>('');
  private candidateId = signal<string>('');
  private profileId = signal<string>('');

  // Data states
  profile = computed(() => this.matchingResultService.currentProfile());
  isLoading = computed(() => this.matchingResultService.isProfileLoading());

  // Modal state
  showModal = signal<boolean>(false);

  ngOnInit(): void {
    this.extractUrlParams();
    this.fetchProfileData();
  }

  ngOnDestroy(): void {
    this.matchingResultService.clearCurrentProfile();
  }

  private extractUrlParams(): void {
    this.route.params.subscribe((params) => {
      const offerId = params['offerId'];
      const candidateId = params['candidateId'];
      const profileId = params['profileId'];

      if (!offerId || !candidateId || !profileId) {
        console.error('Missing required URL parameters');
        this.router.navigate(['/dashboard']);
        return;
      }

      this.offerId.set(offerId);
      this.candidateId.set(candidateId);
      this.profileId.set(profileId);
    });
  }

  private fetchProfileData(): void {
    const offerId = this.offerId();
    const candidateId = this.candidateId();
    const profileId = this.profileId();

    if (offerId && candidateId && profileId) {
      this.matchingResultService.getByOfferIdAndProfileId(
        offerId,
        profileId,
        candidateId
      );
    }
  }

  // Modal methods
  openFullScreen(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onFullScreenRequested(): void {
    this.openFullScreen();
  }
}
