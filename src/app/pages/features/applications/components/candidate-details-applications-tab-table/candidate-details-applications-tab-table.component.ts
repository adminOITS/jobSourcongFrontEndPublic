import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
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
@Component({
  selector: 'app-candidate-details-applications-tab-table',
  imports: [
    CommonModule,
    TableModule,
    MenuModule,
    ButtonModule,
    TranslateModule,
  ],
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

  selectedApplication: ApplicationResponse | null = null;
  menuItems: MenuItem[] | undefined;

  columns: Column[] = [];
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.initColumns();
    this.initMenuItems();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initMenuItems();
      });
  }

  getApplicationStatusClasses = getApplicationStatusClasses;
  initMenuItems() {
    this.menuItems = [
      {
        label: this.translateService.instant('VIEW_DETAILS'),
        icon: 'pi pi-eye',
        command: () => this.viewDetails(),
      },
      {
        label: this.translateService.instant('SCHEDULE_INTERVIEW'),
        icon: 'pi pi-calendar',
        command: () => this.scheduleInterview(),
      },

      {
        label: this.translateService.instant('DELETE'),
        icon: 'pi pi-trash',
        command: () => this.deleteApplication(),
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private interviewService = inject(InterviewService);
  scheduleInterview() {
    this.interviewService.openAddDialog(this.selectedApplication?.id!);
  }

  deleteApplication() {
    this.applicationService.deleteApplication(this.selectedApplication?.id!);
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

  onRowSelect(event: any, application: ApplicationResponse) {
    this.selectedApplication = application;
    this.menu.toggle(event);
  }

  viewDetails() {
    if (this.selectedApplication) {
    }
  }

  deleteInterview() {
    if (this.selectedApplication) {
      console.log('Deleting application:', this.selectedApplication);
      // Implement delete logic
    }
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
