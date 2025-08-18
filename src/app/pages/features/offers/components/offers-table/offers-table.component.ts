import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  Input,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  EmploymentType,
  WorkMode,
  JobOfferFilterRequest,
  ContractType,
  OfferResponse,
  OfferShortResponse,
  OfferStatus,
} from '../../../../../core/models/offer.models';
import { Column } from '../../../../../core/types';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import {
  getEmploymentTypeClasses,
  getContractTypeClasses,
  getOfferStatusColor,
  getWorkModeClasses,
} from '../../../../../core/utils';
import { ROUTES } from '../../../../../routes';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import {
  DEFAULT_JOB_OFFER_PAGE,
  DEFAULT_JOB_OFFER_SIZE,
} from '../../../../../core/utils/constants';
import { OffersActionsMenuComponent } from '../offers-actions-menu/offers-actions-menu.component';
import { ManageOfferRecruitersDialogComponent } from '../manage-offer-recruiters-dialog/manage-offer-recruiters-dialog.component';
import { HasRoleDirective } from '../../../../../core/directives/has-role.directive';
import { ManageOfferValidatorsDialogComponent } from '../manage-offer-validators-dialog/manage-offer-validators-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-offers-table',
  imports: [
    TableModule,
    TranslateModule,
    CommonModule,
    ButtonModule,
    MenuModule,
    RippleModule,
    OffersActionsMenuComponent,
    ManageOfferRecruitersDialogComponent,
    HasRoleDirective,
    ManageOfferValidatorsDialogComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './offers-table.component.html',
  styles: ``,
})
export class OffersTableComponent {
  @ViewChild('table') table: Table | undefined;
  @Input({ required: true }) request!: WritableSignal<JobOfferFilterRequest>;

  columns: Column[] = [];
  offerService = inject(OfferService);
  offers = this.offerService.offers;
  isLoading = this.offerService.isLoadingSignal;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService: MessageService = inject(MessageService);
  private translateService: TranslateService = inject(TranslateService);
  private confirmationService = inject(ConfirmationService);
  constructor() {
    this.columns = [
      { field: 'title', header: 'JOB_TITLE', visible: true },
      { field: 'company.name', header: 'COMPANY', visible: true },
      { field: 'country', header: 'COUNTRY', visible: true },
      { field: 'city', header: 'CITY', visible: true },
      { field: 'employmentType', header: 'EMPLOYMENT_TYPE', visible: true },
      { field: 'workMode', header: 'WORK_MODE', visible: true },
      { field: 'contractType', header: 'CONTRACT_TYPE', visible: true },
      { field: 'status', header: 'STATUS', visible: true },
      { field: 'createdAt', header: 'CREATED_AT', visible: true },
      { field: 'actions', header: 'ACTION', visible: true },
    ];
  }

  selectedOffer = signal<OfferShortResponse | null>(null);

  @ViewChild('offerActionsMenu') offerActionsMenu!: OffersActionsMenuComponent;

  selectRowId(event: Event, selectedOffer: OfferShortResponse) {
    this.selectedOffer.set(selectedOffer);

    if (this.offerActionsMenu) {
      this.offerActionsMenu.toggle(event);
    }
  }

  confirmationHeader = '';
  confirmationMsg = '';
  acceptLabel = '';
  acceptIcon = '';
  acceptButtonStyleClass = '';

  ngOnInit(): void {}

  manageRecruiters(): void {
    if (this.selectedOffer()) {
      this.offerService.setSelectedOffer(
        this.selectedOffer()!.id,
        this.selectedOffer()!.company!.id
      );
      this.offerService.openManageRecruitersDialog();
    }
  }

  manageValidators(): void {
    if (this.selectedOffer()) {
      this.offerService.setSelectedOffer(
        this.selectedOffer()!.id,
        this.selectedOffer()!.company!.id
      );
      this.offerService.openManageValidatorsDialog();
    }
  }

  closeOffer(): void {
    if (this.selectedOffer()) {
      this.confirmationHeader = 'CLOSE_OFFER';
      this.confirmationMsg = 'ARE_YOU_SURE_YOU_WANT_TO_CLOSE_THIS_OFFER';
      this.acceptLabel = 'YES';
      this.acceptIcon = 'pi pi-check';
      this.acceptButtonStyleClass = 'p-button-danger';
      this.confirmationService.confirm({
        accept: () => {
          this.offerService.updateOfferStatus(
            this.selectedOffer()!.id,
            'CLOSE' as OfferStatus
          );
        },
      });
    }
  }

  holdOffer(): void {
    if (this.selectedOffer()) {
      this.confirmationHeader = 'HOLD_OFFER';
      this.confirmationMsg = 'ARE_YOU_SURE_YOU_WANT_TO_HOLD_THIS_OFFER';
      this.acceptLabel = 'YES';
      this.acceptIcon = 'pi pi-check';
      this.acceptButtonStyleClass = 'p-button-danger';
      this.confirmationService.confirm({
        accept: () => {
          if (this.selectedOffer()) {
            this.offerService.updateOfferStatus(
              this.selectedOffer()!.id,
              'HOLD' as OfferStatus
            );
          }
        },
      });
    }
  }
  openOffer(): void {
    if (this.selectedOffer()) {
      this.confirmationHeader = 'OPEN_OFFER';
      this.confirmationMsg = 'ARE_YOU_SURE_YOU_WANT_TO_OPEN_THIS_OFFER';
      this.acceptLabel = 'YES';
      this.acceptIcon = 'pi pi-check';
      this.acceptButtonStyleClass = 'p-button-success';
      this.confirmationService.confirm({
        accept: () => {
          if (this.selectedOffer()) {
            this.offerService.updateOfferStatus(
              this.selectedOffer()!.id,
              'OPEN' as OfferStatus
            );
          }
        },
      });
    }
  }

  deleteOffer(): void {
    if (this.selectedOffer()) {
      this.confirmationHeader = 'DELETE_OFFER';
      this.confirmationMsg = 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_OFFER';
      this.acceptLabel = 'YES';
      this.acceptIcon = 'pi pi-trash';
      this.acceptButtonStyleClass = 'p-button-danger';
      this.confirmationService.confirm({
        accept: () => {
          if (this.selectedOffer()) {
            this.offerService.deleteOffer(this.selectedOffer()!.id);
          }
        },
      });
    }
  }

  loadOffersLazy(event: TableLazyLoadEvent) {
    const page =
      event.first && event.rows
        ? event.first / event.rows
        : DEFAULT_JOB_OFFER_PAGE;
    const size = event.rows ? event.rows : DEFAULT_JOB_OFFER_SIZE;
    if (this.request().page !== page || this.request().size !== size) {
      this.request.set({
        ...this.request(),
        page: page,
        size: size,
      });
    }
  }

  getStatusColor(status: string): string {
    return getOfferStatusColor(status);
  }

  getEmploymentTypeStyle(type: EmploymentType): string {
    return getEmploymentTypeClasses(type);
  }

  getWorkModeStyle(mode: WorkMode): string {
    return getWorkModeClasses(mode);
  }

  getContractTypeStyle(type: ContractType): string {
    return getContractTypeClasses(type);
  }
}
