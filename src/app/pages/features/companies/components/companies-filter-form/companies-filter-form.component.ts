import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import {
  DEFAULT_COMPANY_PAGE,
  DEFAULT_COMPANY_SIZE,
} from '../../../../../core/utils/constants';
import { CompanySearchRequest } from '../../../../../core/models/company.models';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-companies-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    FloatLabelModule,
    PopoverModule,
    TranslateModule,
  ],
  templateUrl: './companies-filter-form.component.html',
  styles: ``,
})
export class CompaniesFilterFormComponent implements OnDestroy {
  @Input({ required: true }) request!: WritableSignal<CompanySearchRequest>;
  @ViewChild('filterPopover') filterPopover!: Popover;
  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
    });
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.applyFilters();
      });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const filteredRequest: CompanySearchRequest = {
      page: this.request().page,
      size: this.request().size,
      keyword: '',
    };

    if (filters.search) {
      filteredRequest.keyword = filters.search;
    }

    this.request.set(filteredRequest);
    this.filterPopover.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
