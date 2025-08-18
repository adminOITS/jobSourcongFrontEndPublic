import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CandidateEmailService } from '../../../../../core/services/candidate/candidate-email.service';
import { EditorModule } from 'primeng/editor';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-candidates-send-generic-email-dialog',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    EditorModule,
    CommonModule,
    InputTextModule,
  ],
  templateUrl: './candidates-send-generic-email-dialog.component.html',
  styles: ``,
})
export class CandidatesSendGenericEmailDialogComponent {
  private readonly candidateEmailService = inject(CandidateEmailService);
  isLoading = this.candidateEmailService.isCandidateEmailLoading;
  isVisible = this.candidateEmailService.isDialogVisible;
  emailForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
  });
  private readonly route = inject(ActivatedRoute);
  private candidateId!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });
  }

  onHide() {
    this.candidateEmailService.setDialogVisible(false);
  }
  setDialogVisible(value: boolean) {
    this.candidateEmailService.setDialogVisible(value);
  }

  onSave() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.candidateEmailService.sendCandidateGeneralEmail(this.candidateId, {
      message: this.emailForm.value.message as string,
      subject: this.emailForm.value.subject as string,
    });
  }
}
