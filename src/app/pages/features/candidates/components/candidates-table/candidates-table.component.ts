import {
  Component,
  inject,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Column } from '../../../../../core/types';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import {
  CandidateSearchRequest,
  CandidateShortResponse,
} from '../../../../../core/models/candidate.models';
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
  getCandidateAvailabilityStatusClasses,
  getCandidateCreationSourceClasses,
  getCandidateValidationStatusClasses,
} from '../../../../../core/utils';
import { CandidateService } from '../../../../../core/services/candidate/candidate.service';
import {
  DEFAULT_CANDIDATE_PAGE,
  DEFAULT_CANDIDATE_SIZE,
} from '../../../../../core/utils/constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CandidatesActionsMenuComponent } from '../candidates-actions-menu/candidates-actions-menu.component';
@Component({
  selector: 'app-candidates-table',
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
    ConfirmDialogModule,
    CandidatesActionsMenuComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './candidates-table.component.html',
  standalone: true,
})
export class CandidatesTableComponent {
  @ViewChild('table') table: Table | undefined;
  @ViewChild('candidatesActionsMenu')
  candidatesActionsMenu!: CandidatesActionsMenuComponent;
  selectedColumns: string[] = [];
  candidateService = inject(CandidateService);
  confirmationService = inject(ConfirmationService);
  candidates = this.candidateService.candidatesComputed;
  isLoading = this.candidateService.isCandidatesLoading;

  @Input({ required: true }) request!: WritableSignal<CandidateSearchRequest>;
  columns: Column[] = [];
  selectedCandidate = signal<CandidateShortResponse | null>(null);

  private router: Router = inject(Router);

  constructor() {
    this.columns = [
      { field: 'firstName', header: 'FULL_NAME', visible: true },
      { field: 'phone', header: 'PHONE', visible: true },
      { field: 'email', header: 'EMAIL', visible: true },
      { field: 'country', header: 'COUNTRY', visible: true },
      { field: 'city', header: 'CITY', visible: true },
      { field: 'address', header: 'ADDRESS', visible: true },
      // { field: 'status', header: 'STATUS', visible: true },
      { field: 'creationSource', header: 'SOURCE', visible: true },
      { field: 'validationStatus', header: 'STATUS', visible: true },
      {
        field: 'availabilityStatus',
        header: 'AVAILABILITY',
        visible: true,
      },
      { field: 'createdAt', header: 'CREATED_AT', visible: true },

      { field: 'actions', header: 'ACTIONS', visible: true },
    ];
  }

  ngOnInit(): void {}

  getValidationStatusClasses = getCandidateValidationStatusClasses;
  getCreationSourceClasses = getCandidateCreationSourceClasses;
  getAvailabilityStatusClasses = getCandidateAvailabilityStatusClasses;

  selectRowId(event: any, candidate: CandidateShortResponse) {
    this.selectedCandidate.set(candidate);
    if (this.candidatesActionsMenu) {
      this.candidatesActionsMenu.toggle(event);
    }
  }

  viewDetails() {
    if (this.selectedCandidate()) {
      const currentUrl = this.router.url;
      this.router.navigate([`${currentUrl}/${this.selectedCandidate()!.id}`]);
    }
  }

  deleteCandidate() {
    if (this.selectedCandidate()) {
      this.confirmationService.confirm({
        accept: () => {
          this.candidateService.deleteCandidate(this.selectedCandidate()!.id);
        },
      });
    }
  }

  loadCandidatesLazy(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_CANDIDATE_PAGE;
    const size = event.rows ? event.rows : DEFAULT_CANDIDATE_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }
}
