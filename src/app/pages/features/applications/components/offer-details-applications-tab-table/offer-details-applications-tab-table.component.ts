import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Column } from '../../../../../core/types';
import {
  ApplicationResponse,
  ApplicationSearchRequest,
} from '../../../../../core/models/application.models';
import { getApplicationStatusClasses } from '../../../../../core/utils';

import { Subject } from 'rxjs';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ApplicationActionsMenuComponent } from '../application-actions-menu/application-actions-menu.component';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../../core/utils/constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApplicationHistoryRecordListDialogComponent } from '../application-history-record-list-dialog/application-history-record-list-dialog.component';
@Component({
  selector: 'app-offer-details-applications-tab-table',
  imports: [
    CommonModule,
    TableModule,
    MenuModule,
    ButtonModule,
    TranslateModule,
    ApplicationActionsMenuComponent,
    ConfirmDialogModule,
    ApplicationHistoryRecordListDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './offer-details-applications-tab-table.component.html',
  styles: ``,
})
export class OfferDetailsApplicationsTabTableComponent implements OnDestroy {
  @ViewChild('menu') menu!: Menu;
  @Input() request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  applicationService = inject(ApplicationService);
  applications = this.applicationService.applications;
  isLoading = this.applicationService.isApplicationsLoading;
  private confirmationService = inject(ConfirmationService);

  selectedApplication: WritableSignal<ApplicationResponse | null> =
    signal(null);
  menuItems: MenuItem[] | undefined;

  columns: Column[] = [];
  private destroy$ = new Subject<void>();

  constructor() {
    this.initColumns();
  }

  getApplicationStatusClasses = getApplicationStatusClasses;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadApplications(event: TableLazyLoadEvent) {}
  @ViewChild('actionsMenu') actionsMenu!: ApplicationActionsMenuComponent;

  onRowSelect(event: any, application: ApplicationResponse) {
    this.selectedApplication.set(application);
    this.actionsMenu.toggle(event);
  }
  shareApplicationProfileWithClient() {
    this.confirmationService.confirm({
      message:
        'ARE_YOU_SURE_YOU_WANT_TO_SHARE_THIS_APPLICATION_PROFILE_WITH_CLIENT',
      accept: () => {
        this.applicationService.shareApplicationProfileWithClient(
          this.selectedApplication()?.id!
        );
      },
    });
  }
  deleteApplication() {
    this.confirmationService.confirm({
      message: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_APPLICATION',
      accept: () => {
        this.applicationService.deleteApplication(
          this.selectedApplication()?.id!
        );
      },
    });
  }
  viewDetails() {
    this.applicationService.openApplicationHistoryRecordListDialog(
      this.selectedApplication()?.id!
    );
  }
  initColumns() {
    this.columns = [
      {
        field: 'application.profile.title',
        header: 'PROFILE_TITLE',
        visible: true,
      },

      {
        field: 'application.profile.candidate.firstName',
        header: 'FIRST_NAME',
        visible: true,
      },
      {
        field: 'application.profile.candidate.lastName',
        header: 'LAST_NAME',
        visible: true,
      },
      {
        field: 'application.profile.candidate.email',
        header: 'EMAIL',
        visible: true,
      },

      { field: 'status', header: 'STATUS', visible: true },

      {
        field: 'createdAt',
        header: 'CREATED_AT',
        visible: true,
      },

      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }
}
