import {
  Component,
  inject,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  effect,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'primeng/colorpicker';
import {
  CompanyRequest,
  CompanyResponse,
} from '../../../../../core/models/company.models';
import { COMPANY_SIZE_OPTIONS } from '../../../../../core/utils/constants';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CompanyService } from '../../../../../core/services/company/company.service';
@Component({
  selector: 'app-edit-company-dialog',
  imports: [
    DialogModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    TextareaModule,
    FileUploadModule,
    CommonModule,
    ColorPickerModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './edit-company-dialog.component.html',
  styles: ``,
})
export class EditCompanyDialogComponent implements OnChanges {
  companyService = inject(CompanyService);
  company = this.companyService.companyDetails;
  visible = this.companyService.isCompanyEditDialogVisible;
  isLoading = this.companyService.isCompanyActionLoading;

  currentYear = new Date().getFullYear();
  maxDate = new Date();
  dragging = false;
  previewUrl: string | null = null;
  fb = inject(FormBuilder);
  editCompanyForm: FormGroup;
  companySizeOptions = COMPANY_SIZE_OPTIONS;
  constructor() {
    this.editCompanyForm = this.fb.group({
      // Company Information
      name: [null, Validators.required],
      address: this.createAddressFormGroup(),
      contact: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      webSiteLink: [null],
      sector: [null, Validators.required],
      primaryColor: ['#3B82F6'], // Blue-500
      secondaryColor: ['#3BF686'],
      description: [null],
      foundedYear: [
        null,
        [Validators.min(1800), Validators.max(new Date().getFullYear())],
      ],
      companySize: [null],
    });
    effect(() => {
      const company = this.company();
      if (company) {
        this.patchForm();
      }
    });
  }
  setIsCompanyAddDialogVisible(visible: boolean) {
    this.companyService.setIsCompanyEditDialogVisible(visible);
  }
  private createAddressFormGroup(): FormGroup {
    return this.fb.group({
      addressLine1: [null, Validators.required],
      addressLine2: [null],
      city: [null, Validators.required],
      zipCode: [null, Validators.required],
      country: [null, Validators.required],
    });
  }

  onHideDialog() {
    this.onCancel();
  }
  onCancel(): void {
    this.companyService.closeEditCompanyDialog();
  }

  onSave(): void {
    const formData = this.editCompanyForm.value;
    const companyData: CompanyRequest = {
      name: formData.name,
      address: {
        addressLine1: formData.address.addressLine1,
        addressLine2: formData.address.addressLine2 || '',
        city: formData.address.city,
        zipCode: formData.address.zipCode,
        country: formData.address.country || '',
      },
      contact: formData.contact,
      email: formData.email,
      webSiteLink: formData.webSiteLink,
      sector: formData.sector,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      description: formData.description,
      companySize: formData.companySize,
      foundedYear: new Date(formData.foundedYear).getFullYear(),
    };
    this.companyService.updateCompany(this.company()!.id, companyData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company']) {
      this.patchForm();
    }
  }

  patchForm() {
    if (!this.company()) {
      this.onCancel();
    }
    this.editCompanyForm.patchValue({
      name: this.company()!.name,
      address: {
        addressLine1: this.company()!.address?.addressLine1,
        addressLine2: this.company()!.address?.addressLine2,
        city: this.company()!.address?.city,
        zipCode: this.company()!.address?.zipCode,
        country: this.company()!.address?.country,
      },
      contact: this.company()!.contact,
      email: this.company()!.email,
      webSiteLink: this.company()!.websiteLink,
      sector: this.company()!.sector,
      primaryColor: this.company()!.primaryColor,
      secondaryColor: this.company()!.secondaryColor,
      description: this.company()!.description,
      foundedYear: this.company()!.foundedYear,
      companySize: this.company()!.companySize,
    });
  }
}
