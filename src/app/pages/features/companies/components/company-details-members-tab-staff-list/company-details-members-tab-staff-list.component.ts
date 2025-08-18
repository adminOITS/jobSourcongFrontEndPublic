import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { StaffResponse } from '../../../../../core/models/staff.models';
import { StaffService } from '../../../../../core/services/company/staff.service';
import { CompanyDetailsMembersTabStaffCardComponent } from '../company-details-members-tab-staff-card/company-details-members-tab-staff-card.component';

@Component({
  selector: 'app-company-details-members-tab-staff-list',
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
    CompanyDetailsMembersTabStaffCardComponent,
  ],
  templateUrl: './company-details-members-tab-staff-list.component.html',
  styles: ``,
})
export class CompanyDetailsMembersTabStaffListComponent implements OnInit {
  filterForm: FormGroup;
  private staffService = inject(StaffService);

  staff = this.staffService.staffList;
  // roleOptions = [
  //   { label: 'All Roles', value: null },
  //   { label: 'Recruiter', value: 'RECRUITER' },
  //   { label: 'Validator', value: 'VALIDATOR' },
  // ];

  isStaffListCollapsed = this.staffService.isStaffListCollapsed;

  signal = signal;
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      role: [null],
    });
  }

  ngOnInit(): void {}

  onScroll(): void {
    // TODO: Implement infinite scroll
  }
}
