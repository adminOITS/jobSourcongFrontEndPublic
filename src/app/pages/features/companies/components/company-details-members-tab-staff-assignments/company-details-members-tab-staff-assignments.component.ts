import { Component, Input, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { CompanyDetailsMembersTabStaffAssignmentCardComponent } from '../company-details-members-tab-staff-assignment-card/company-details-members-tab-staff-assignment-card.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { OfferService } from '../../../../../core/services/offer/offer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-details-members-tab-staff-assignments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    PopoverModule,
    CompanyDetailsMembersTabStaffAssignmentCardComponent,
  ],
  templateUrl: './company-details-members-tab-staff-assignments.component.html',
  styles: ``,
})
export class CompanyDetailsMembersTabStaffAssignmentsComponent
  implements OnInit
{
  private staffService = inject(StaffService);
  private offerService = inject(OfferService);
  isOffersLoading = this.offerService.isOffersAssignedLoading;
  staffAssignedOffers = this.offerService.offers;
  private fb = inject(FormBuilder);

  selectedStaff = this.staffService.selectedStaff;

  offerFilterForm: FormGroup = this.fb.group({
    search: [''],
    status: [null],
  });

  offerStatusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Open', value: 'OPEN' },
    { label: 'Hold', value: 'HOLD' },
    { label: 'Close', value: 'CLOSE' },
  ];
  private route = inject(ActivatedRoute);

  companyId!: string;

  constructor() {
    this.route.params.subscribe((params) => {
      this.companyId = params['companyId'];
    });
    effect(() => {
      const staff = this.selectedStaff();
      if (staff) {
        this.offerService.getOffersAssignedToStaff(
          this.companyId,
          staff.id,
          staff.role === 'RECRUITER' ? 'recruiters' : 'validators'
        );
      } else {
        this.offerService.emptyOffers();
      }
    });
  }

  ngOnInit(): void {}
}
