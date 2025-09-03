import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DescriptionViewComponent } from '../description-view/description-view.component';
import { MatchingResultService } from '../../../../../core/services/ats/matching-result.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-ats-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    DescriptionViewComponent,
  ],
  templateUrl: './ats-modal.component.html',
  styles: [
    `
      @media (width >= 40rem) {
        .dialog-fullscreen .p-dialog {
          height: auto !important;
          max-height: 100vh !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AtsModalComponent {
  @Input() visible: boolean = false;

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
  matchDetails = computed(
    () => this.profile()?.matchingResultDetails?.matchDetails || null
  );

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose.emit();
  }

  onMaximize(): void {}

  onRestore(): void {}
}
