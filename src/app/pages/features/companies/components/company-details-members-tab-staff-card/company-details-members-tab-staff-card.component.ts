import {
  Component,
  Input,
  WritableSignal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StaffResponse } from '../../../../../core/models/staff.models';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActivatedRoute } from '@angular/router';
import { CompanyStaffCardActionsMenuComponent } from '../company-staff-card-actions-menu/company-staff-card-actions-menu.component';

@Component({
  selector: 'app-company-details-members-tab-staff-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    ButtonModule,
    ConfirmDialogModule,
    CompanyStaffCardActionsMenuComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './company-details-members-tab-staff-card.component.html',
  styles: ``,
})
export class CompanyDetailsMembersTabStaffCardComponent {
  @Input({ required: true }) staff!: WritableSignal<StaffResponse | null>;
  isSelected = computed(
    () => this.staffService.selectedStaff()?.id === this.staff()?.id
  );
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  translateService = inject(TranslateService);
  companyId!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    this.translateOptions();
    this.translateService.onLangChange.subscribe((res) => {
      this.translateOptions();
    });
  }

  menuItems: MenuItem[] = [
    {
      label: 'VIEW_DETAILS',
      icon: 'pi pi-eye',
      command: () => this.viewDetails(),
    },
    {
      label: 'EDIT',
      icon: 'pi pi-pencil',
      command: () => this.editStaff(),
    },
    {
      label: 'DELETE',
      icon: 'pi pi-trash',
      command: () => this.deleteStaff(),
    },
  ];
  translateOptions() {
    this.menuItems[0].label = this.translateService.instant('VIEW_DETAILS');
    this.menuItems[1].label = this.translateService.instant('EDIT');
    this.menuItems[2].label = this.translateService.instant('DELETE');
  }

  staffService = inject(StaffService);

  onStaffSelected(): void {
    this.staffService.setSelectedStaff(this.staff());
  }

  viewDetails(): void {
    this.staffService.openStaffDetailsDialog(this.staff()!);
  }

  editStaff(): void {
    this.staffService.openEditStaffDialog(this.staff()!);
  }

  deleteStaff(): void {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.staffService.deleteStaff(this.staff()!.id, this.companyId);
      },
    });
  }
}
