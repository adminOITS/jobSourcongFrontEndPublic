import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Column } from '../../../../../core/types';
import { Router, ROUTES } from '@angular/router';
import {
  ApplicationResponse,
  ApplicationSearchRequest,
} from '../../../../../core/models/application.models';
import { getApplicationStatusClasses } from '../../../../../core/utils';
import { InterviewService } from '../../../../../core/services/interview/interview.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../../core/utils/constants';
import { ApplicationActionsMenuComponent } from '../application-actions-menu/application-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApplicationHistoryRecordListDialogComponent } from '../application-history-record-list-dialog/application-history-record-list-dialog.component';
@Component({
  selector: 'app-candidate-details-applications-tab-table',
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
  templateUrl: './candidate-details-applications-tab-table.component.html',
  styles: ``,
})
export class CandidateDetailsApplicationsTabTableComponent
  implements OnDestroy
{
  @ViewChild('menu') menu!: Menu;
  @Input() request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  applicationService = inject(ApplicationService);
  applications = this.applicationService.applications;
  isLoading = this.applicationService.isApplicationsLoading;
  rows = computed(
    () => this.applications().totalItems / this.applications().totalPages
  );

  menuItems: MenuItem[] | undefined;

  columns: Column[] = [];
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();
  private confirmationService = inject(ConfirmationService);
  selectedApplication: WritableSignal<ApplicationResponse | null> =
    signal(null);
  constructor() {
    this.initColumns();
  }

  getApplicationStatusClasses = getApplicationStatusClasses;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @ViewChild('actionsMenu') actionsMenu!: ApplicationActionsMenuComponent;

  onRowSelect(event: any, application: ApplicationResponse) {
    this.selectedApplication.set(application);
    this.actionsMenu.toggle(event);
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

  loadApplications(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_APPLICATION_PAGE;
    const size = event.rows ? event.rows : DEFAULT_APPLICATION_SIZE;
    this.request.set({
      ...this.request(),
      page: page,
      size: size,
    });
  }

  initColumns() {
    this.columns = [
      {
        field: 'application.id',
        header: 'Number',
        visible: true,
      },
      {
        field: 'application.profile.title',
        header: 'PROFILE_TITLE',
        visible: true,
      },
      {
        field: 'application.offer.title',
        header: 'OFFER_TITLE',
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
