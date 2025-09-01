import {
  Component,
  Input,
  inject,
  ViewChild,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  getContractTypeClasses,
  getEmploymentTypeClasses,
  getOfferStatusColor,
  getWorkModeClasses,
} from '../../../../../core/utils';
import {
  EmploymentType,
  OfferShortResponse,
  WorkMode,
  JobOfferFilterRequest,
  ContractType,
  OfferStatus,
} from '../../../../../core/models/offer.models';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ROUTES } from '../../../../../routes';
import { Column } from '../../../../../core/types';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
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
  selector: 'app-company-offers-table',
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
  templateUrl: './company-offers-table.component.html',
  styles: ``,
})
export class CompanyOffersTableComponent {
  @ViewChild('table') table: Table | undefined;
  @ViewChild('offerActionsMenu') offerActionsMenu!: OffersActionsMenuComponent;
  @Input({ required: true }) request!: WritableSignal<JobOfferFilterRequest>;
  selectedColumns: string[] = [];

  private offerService = inject(OfferService);
  offers = this.offerService.offers;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private translateService: TranslateService = inject(TranslateService);
  isLoading = this.offerService.isLoadingSignal;
  confirmationService = inject(ConfirmationService);

  columns: Column[] = [];

  constructor() {
    this.columns = [
      { field: 'title', header: 'JOB_TITLE', visible: true },
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

  selectRowId(event: Event, selectedOffer: OfferShortResponse) {
    this.selectedOffer.set(selectedOffer);

    if (this.offerActionsMenu) {
      this.offerActionsMenu.toggle(event);
    }
  }
  viewDetails(): void {
    if (this.selectedOffer()) {
      const currentUrl = this.router.url;
      const url = currentUrl.split('/');
      this.router.navigate([
        `${url[1]}/${ROUTES.OFFER.LIST}/${this.selectedOffer()!.id}`,
      ]);
    }
  }
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
  confirmationHeader = '';
  confirmationMsg = '';
  acceptLabel = '';
  acceptIcon = '';
  acceptButtonStyleClass = '';
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

  getOfferStatusColor(status: string): string {
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
