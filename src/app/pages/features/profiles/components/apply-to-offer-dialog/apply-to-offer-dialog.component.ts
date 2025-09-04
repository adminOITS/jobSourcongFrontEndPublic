import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-apply-to-offer-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './apply-to-offer-dialog.component.html',
  styles: ``,
})
export class ApplyToOfferDialogComponent {
  @Input() isVisible = signal<boolean>(false);
  @Input() candidateId: string = '';
  @Input() profileId: string = '';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() applyWithEmail = new EventEmitter<{
    candidateId: string;
    profileId: string;
  }>();
  @Output() applyWithoutEmail = new EventEmitter<{
    candidateId: string;
    profileId: string;
  }>();

  onVisibleChange(visible: boolean) {
    this.visibleChange.emit(visible);
  }

  onApplyWithEmail() {
    this.applyWithEmail.emit({
      candidateId: this.candidateId,
      profileId: this.profileId,
    });
  }

  onApplyWithoutEmail() {
    this.applyWithoutEmail.emit({
      candidateId: this.candidateId,
      profileId: this.profileId,
    });
  }

  onHide() {
    this.visibleChange.emit(false);
  }
}
