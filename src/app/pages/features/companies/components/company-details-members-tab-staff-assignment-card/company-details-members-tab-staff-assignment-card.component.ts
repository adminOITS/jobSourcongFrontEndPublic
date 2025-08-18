import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OfferShortResponse } from '../../../../../core/models/offer.models';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { StaffService } from '../../../../../core/services/company/staff.service';

@Component({
  selector: 'app-company-details-members-tab-staff-assignment-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl:
    './company-details-members-tab-staff-assignment-card.component.html',
  styles: ``,
})
export class CompanyDetailsMembersTabStaffAssignmentCardComponent {
  @Input() offer!: OfferShortResponse;
  confirmationService = inject(ConfirmationService);
  offerService = inject(OfferService);
  staffService = inject(StaffService);
  selectedStaff = this.staffService.selectedStaff;

  unassignOffer() {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offerService.unassignStaffOffer(
          this.offer.id,
          this.offer.company!.id,
          this.selectedStaff()!.id,
          this.selectedStaff()!.role === 'RECRUITER'
            ? 'recruiters'
            : 'validators'
        );
      },
    });
  }
}
