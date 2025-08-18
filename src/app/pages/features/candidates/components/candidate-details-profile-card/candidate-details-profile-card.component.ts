import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-candidate-details-profile-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, TranslateModule],
  templateUrl: './candidate-details-profile-card.component.html',
})
export class CandidateDetailsProfileCardComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() text: string | null | undefined = null;
  @Input() showCopy: boolean = true;
  @Input() copyTooltip: string = 'COPY';
  @Input() fallbackText: string = 'NOT_PROVIDED';
  @Input() canCopy: boolean = true;

  @Output() onCopySuccess = new EventEmitter<void>();

  isCopied: boolean = false;

  showConfirm() {
    this.onCopySuccess.emit();
  }

  get displayText(): string {
    return this.text || this.fallbackText;
  }

  get shouldShow(): boolean {
    return true; // We'll always show the card now, with either the text or fallback
  }

  getCanCopy(): boolean {
    return this.showCopy && !!this.text && this.canCopy;
  }

  async onCopyClick() {
    if (!this.text) return;

    try {
      await navigator.clipboard.writeText(this.text);
      this.isCopied = true;
      this.onCopySuccess.emit();

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }
}
