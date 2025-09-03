import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-h-r-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePicker,
    ButtonModule,
    FloatLabelModule,
    PopoverModule,
    TranslateModule,
  ],
  templateUrl: './h-r-filter-form.component.html',
  styles: ``,
})
export class HRFilterFormComponent {
  private fb: FormBuilder = inject(FormBuilder);
  filterForm: FormGroup = this.fb.group({
    search: [''],
    location: [null],
    status: [null],
    creationDate: [null],
  });
  locations = [
    { name: 'New York', value: 'NY' },
    { name: 'Los Angeles', value: 'LA' },
    { name: 'San Francisco', value: 'SF' },
  ];

  statuses = [
    { name: 'Pending', value: 'pending' },
    { name: 'Approved', value: 'approved' },
    { name: 'Rejected', value: 'rejected' },
  ];
  applyFilters() {
    const filters = this.filterForm.value;
  }

  resetFilters() {
    this.filterForm.reset();
  }
}
