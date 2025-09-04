import {
  Component,
  inject,
  Input,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Column } from '../../../../../core/types';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import {
  ProfileFilterRequest,
  ProfileShortResponse,
} from '../../../../../core/models/profile.models';
import { DEFAULT_PROFILE_PAGE } from '../../../../../core/utils/constants';
import { Subject } from 'rxjs';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';
import { DEFAULT_PROFILE_SIZE } from '../../../../../core/utils/constants';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ProfilesActionsMenuComponent } from '../profiles-actions-menu/profiles-actions-menu.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddProfileDialogComponent } from '../add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { EditResumeDialogComponent } from '../edit-resume-dialog/edit-resume-dialog.component';
import { ApplyToOfferDialogComponent } from '../apply-to-offer-dialog/apply-to-offer-dialog.component';

@Component({
  selector: 'app-offer-details-profiles-table',
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
    ProfilesActionsMenuComponent,
    ConfirmDialogModule,
    ApplyToOfferDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './offer-details-profiles-table.component.html',
  styles: ``,
})
export class OfferDetailsProfilesTableComponent implements OnDestroy {
  @ViewChild('table') table: Table | undefined;
  @ViewChild('profileActionsMenu')
  profileActionsMenu!: ProfilesActionsMenuComponent;
  @Input({ required: true }) request!: WritableSignal<ProfileFilterRequest>;
  selectedColumns: string[] = [];

  columns: Column[] = [];
  profileService = inject(ProfileService);
  profiles = this.profileService.profiles;
  isLoading = this.profileService.isProfilesLoading;

  profile = signal<ProfileShortResponse | null>(null);
  applicationService = inject(ApplicationService);
  destroy$ = new Subject<void>();
  private confirmationService = inject(ConfirmationService);

  // Apply to offer dialog
  isApplyDialogVisible = signal<boolean>(false);
  applyDialogCandidateId = signal<string>('');
  applyDialogProfileId = signal<string>('');
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

  editProfile() {
    console.log('editProfile');
  }

  editResume() {
    console.log('editResume');
  }
  confirmationHeader = '';
  confirmationMsg = '';
  acceptLabel = '';
  acceptIcon = '';
  acceptButtonStyleClass = '';
  rejectLabel = '';
  rejectIcon = '';
  rejectButtonStyleClass = '';
  deleteProfile() {
    if (this.profile()) {
      this.confirmationHeader = 'DELETE_PROFILE';
      this.confirmationMsg = 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PROFILE';
      this.acceptLabel = 'YES';
      this.acceptIcon = 'pi pi-check';
      this.acceptButtonStyleClass = 'p-button-danger';
      this.rejectLabel = 'CANCEL';
      this.rejectIcon = 'pi pi-times';
      this.rejectButtonStyleClass = 'p-button-text';
      this.confirmationService.confirm({
        message: this.confirmationMsg,
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
    this.applyDialogCandidateId.set(event.candidateId);
    this.applyDialogProfileId.set(event.profileId);
    this.isApplyDialogVisible.set(true);
  }

  onApplyWithEmail(event: { candidateId: string; profileId: string }) {
    this.applicationService.createApplication(
      event.candidateId,
      event.profileId,
      true
    );
    this.closeApplyDialog();
  }

  onApplyWithoutEmail(event: { candidateId: string; profileId: string }) {
    this.applicationService.createApplication(
      event.candidateId,
      event.profileId,
      false
    );
    this.closeApplyDialog();
  }

  onDialogVisibleChange(visible: boolean) {
    this.isApplyDialogVisible.set(visible);
  }

  closeApplyDialog() {
    this.isApplyDialogVisible.set(false);
    this.applyDialogCandidateId.set('');
    this.applyDialogProfileId.set('');
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
      { field: 'number', header: 'NUMBER', visible: true },
      { field: 'title', header: 'PROFILE_TITLE', visible: true },
      {
        field: 'candidate',
        header: 'CANDIDATE_FULL_NAME',
        visible: true,
      },

      { field: 'category', header: 'CATEGORY', visible: true },
      { field: 'resumeLink', header: 'RESUME', visible: true },

      { field: 'createdAt', header: 'CREATED_AT', visible: true },
      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }
}
