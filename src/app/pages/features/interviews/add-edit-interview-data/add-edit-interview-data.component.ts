import { Component, effect, inject } from '@angular/core';
import { AddEditInterviewDataFormComponent } from '../components/add-edit-interview-data-form/add-edit-interview-data-form.component';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { InterviewDataService } from '../../../../core/services/interview/interview-data.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-add-edit-interview-data',
  imports: [AddEditInterviewDataFormComponent, LoaderComponent, NgIf],
  templateUrl: './add-edit-interview-data.component.html',
  styles: ``,
})
export class AddEditInterviewDataComponent {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  interviewDataService = inject(InterviewDataService);
  interviewData = this.interviewDataService.interviewData;
  interviewDataLoading = this.interviewDataService.interviewDataLoading;
  route = inject(ActivatedRoute);
  interviewId!: string;
  constructor() {
    this.route.params.subscribe((params) => {
      this.interviewId = params['interviewId'];
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('INTERVIEW_DATA').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }
  ngOnInit() {
    this.interviewDataService.emptyInterviewData();
    this.interviewDataService.getInterviewData(this.interviewId);
  }
}
