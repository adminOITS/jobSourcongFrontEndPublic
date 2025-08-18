import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import {
  ApplicationCommentAction,
  TransitionCommentRequest,
} from '../../../../../core/models/application.models';

@Component({
  selector: 'app-application-comment-action-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    TextareaModule,
    DialogModule,
  ],
  templateUrl: './application-comment-action-dialog.component.html',
  styles: ``,
})
export class ApplicationCommentActionDialogComponent {
  applicationsStatusForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });
  applicationService = inject(ApplicationService);
  isDialogVisible = this.applicationService.isApplicationCommentDialogVisible;
  isLoading = this.applicationService.isApplicationLoading;
  action = this.applicationService.applicationCommentAction;

  onSubmit() {
    const request: TransitionCommentRequest = {
      comment: this.applicationsStatusForm.value.comment ?? '',
    };
    this.action()?.actionFunction(request);
  }
  onHide() {
    this.applicationService.closeApplicationCommentDialog();
    this.applicationsStatusForm.reset();
  }
  setDialogVisible(value: any) {
    this.applicationService.setIsApplicationCommentDialogVisible(value);
  }
}
