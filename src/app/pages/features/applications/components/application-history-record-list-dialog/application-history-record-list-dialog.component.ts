import { Component, effect, inject } from '@angular/core';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-application-history-record-list-dialog',
  imports: [CommonModule, DialogModule, TranslateModule, ProgressSpinnerModule],
  templateUrl: './application-history-record-list-dialog.component.html',
  styles: ``,
})
export class ApplicationHistoryRecordListDialogComponent {
  applicationService = inject(ApplicationService);
  isDialogVisible =
    this.applicationService.isApplicationHistoryRecordListDialogVisible;

  applicationId = this.applicationService.applicationId;
  setApplicationId = this.applicationService.setApplicationId;
  applicationHistoryRecords = this.applicationService.applicationHistoryRecords;
  isLoading = this.applicationService.isApplicationHistoryRecordListLoading;

  constructor() {
    effect(() => {
      if (this.applicationId()) {
        this.applicationService.getApplicationHistoryRecords(
          this.applicationId()!
        );
      }
    });
  }
  onHide() {
    this.applicationService.closeApplicationHistoryRecordListDialog();
  }

  setDialogVisible(value: boolean) {
    this.applicationService.setIsApplicationHistoryRecordListDialogVisible(
      value
    );
  }
}
