import {
  Component,
  inject,
  signal,
  ViewChild,
  OnDestroy,
  Input,
  WritableSignal,
} from '@angular/core';
import { Column } from '../../../../../core/types';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {
  ProfileFilterRequest,
  ProfileShortResponse,
} from '../../../../../core/models/profile.models';
import { TagModule } from 'primeng/tag';
import { DEFAULT_PROFILE_SIZE } from '../../../../../core/utils/constants';
import { DEFAULT_PROFILE_PAGE } from '../../../../../core/utils/constants';
import { Subject } from 'rxjs';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { ProfilesActionsMenuComponent } from '../profiles-actions-menu/profiles-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AddProfileDialogComponent } from '../add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { EditResumeDialogComponent } from '../edit-resume-dialog/edit-resume-dialog.component';
import { ApplicationService } from '../../../../../core/services/applications/application.service';

@Component({
  selector: 'app-candidates-details-profiles-table',
  imports: [
    TableModule,
    TranslateModule,
    CommonModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    FormsModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    ProfilesActionsMenuComponent,
    EditProfileDialogComponent,
    EditResumeDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './candidates-details-profiles-table.component.html',
  styles: ``,
})
export class CandidatesDetailsProfilesTableComponent implements OnDestroy {
  @ViewChild('table') table: Table | undefined;
  @ViewChild('profileActionsMenu')
  profileActionsMenu!: ProfilesActionsMenuComponent;
  @Input({ required: true }) request!: WritableSignal<ProfileFilterRequest>;
  selectedColumns: string[] = [];

  columns: Column[] = [];
  profileService = inject(ProfileService);
  profiles = this.profileService.profiles;
  isLoading = this.profileService.isProfilesLoading;

  translateService: TranslateService = inject(TranslateService);
  profile = signal<ProfileShortResponse | null>(null);
  destroy$ = new Subject<void>();
  confirmationService = inject(ConfirmationService);
  applicationService = inject(ApplicationService);

  // Apply to offer dialog
  isApplyDialogVisible = signal<boolean>(false);
  applyDialogData = signal<{ candidateId: string; profileId: string } | null>(
    null
  );
  constructor() {
    this.initColumns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectRowId(event: any, profile: ProfileShortResponse) {
    this.profile.set(profile);
    if (this.profileActionsMenu) {
      this.profileActionsMenu.toggle(event);
    }
  }

  deleteProfile() {
    if (this.profile()) {
      this.confirmationService.confirm({
        accept: () => {
          if (this.profile()) {
            this.profileService.deleteProfile(
              this.profile()!.candidate.id,
              this.profile()!.id
            );
          }
        },
      });
    }
  }

  applyToOffer(event: { candidateId: string; profileId: string }) {
    this.applyDialogData.set(event);
    this.isApplyDialogVisible.set(true);
  }

  sendEmailAndApply() {
    const data = this.applyDialogData();
    if (data) {
      this.applicationService.createApplication(
        data.candidateId,
        data.profileId,
        true
      );
      this.closeApplyDialog();
    }
  }

  applyWithoutEmail() {
    const data = this.applyDialogData();
    if (data) {
      this.applicationService.createApplication(
        data.candidateId,
        data.profileId,
        false
      );
      this.closeApplyDialog();
    }
  }

  closeApplyDialog() {
    this.isApplyDialogVisible.set(false);
    this.applyDialogData.set(null);
  }

  loadCandidateProfilesLazy(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_PROFILE_PAGE;
    const size = event.rows ? event.rows : DEFAULT_PROFILE_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }

  initColumns() {
    this.columns = [
      { field: 'title', header: 'PROFILE_TITLE', visible: true },

      { field: 'category', header: 'CATEGORY', visible: true },
      { field: 'resumeLink', header: 'RESUME', visible: true },

      { field: 'createdAt', header: 'CREATED_AT', visible: true },
      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }
}
