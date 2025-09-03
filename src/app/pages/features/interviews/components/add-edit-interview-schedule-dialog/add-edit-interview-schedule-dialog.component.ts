import { Component, inject, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InterviewResponse,
  InterviewType,
  InterviewRequest,
} from '../../../../../core/models/interview.models';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { DatePicker } from 'primeng/datepicker';
import { INTERVIEW_TYPE_OPTIONS } from '../../../../../core/utils/constants';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-edit-interview-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    DatePicker,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-interview-schedule-dialog.component.html',
})
export class AddEditInterviewScheduleDialogComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  interviewService = inject(InterviewService);
  interviewTypeOptions: { name: string; value: string }[] = [];
  private _interviewTypeOptions = INTERVIEW_TYPE_OPTIONS;
  interviewForm: FormGroup = this.fb.group({
    type: [null, [Validators.required]],
    interviewDuration: [null, [Validators.required]],
    scheduledDateTime: [null, [Validators.required]],
    meetingLink: [null, [Validators.pattern('https?://.+')]],
  });

  get isEditMode() {
    return !!this.interviewService.selectedInterviewComputed();
  }

  constructor() {
    this.initializeOptions();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeOptions();
      });

    effect(() => {
      const selectedInterview =
        this.interviewService.selectedInterviewComputed();
      if (selectedInterview) {
        this.patchFormWithInterviewData(selectedInterview);
      } else {
        this.interviewForm.reset();
      }
    });
  }

  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();

  private initializeOptions(): void {
    this.interviewTypeOptions = this._interviewTypeOptions.map((option) => ({
      name: this.translateService.instant(option.name),
      value: option.value,
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private patchFormWithInterviewData(interview: InterviewResponse) {
    this.interviewForm.patchValue({
      type: interview.type,
      interviewDuration: interview.interviewDuration,
      scheduledDateTime: new Date(interview.scheduledDateTime),
      meetingLink: interview.meetingLink,
    });
  }

  onHide() {
    this.interviewService.closeDialog();
    this.interviewForm.reset();
  }

  onSubmit() {
    if (this.interviewForm.valid) {
      const formValue = this.interviewForm.value;
      const selectedInterview =
        this.interviewService.selectedInterviewComputed();

      const interviewRequest: InterviewRequest = {
        type: formValue.type,
        interviewDuration: formValue.interviewDuration,
        scheduledDateTime: formValue.scheduledDateTime.toISOString(),
        meetingLink: formValue.meetingLink,
      };

      if (selectedInterview) {
        this.interviewService.updateInterview(
          selectedInterview.id,
          interviewRequest
        );
      } else {
        this.interviewService.createInterview(interviewRequest);
      }
    }
  }
}
