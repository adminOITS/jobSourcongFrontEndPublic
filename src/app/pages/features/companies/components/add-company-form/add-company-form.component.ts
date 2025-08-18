import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TextareaModule } from 'primeng/textarea';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { H_R_Request } from '../../../../../core/models/hr.models';
import { TranslateModule } from '@ngx-translate/core';
import { COMPANY_SIZE_OPTIONS } from '../../../../../core/utils/constants';
import { SelectModule } from 'primeng/select';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { CompanyRequest } from '../../../../../core/models/company.models';
import { DatePickerModule } from 'primeng/datepicker';
import { detectContentType } from '../../../../../core/utils';

@Component({
  selector: 'app-add-company-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ColorPickerModule,
    TextareaModule,
    TranslateModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './add-company-form.component.html',
  styles: ``,
})
export class AddCompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  currentStep = 1;
  dragging = false;
  previewUrl: string | null = null;
  currentYear = new Date().getFullYear();
  maxDate = new Date();

  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() stepChange = new EventEmitter<number>();

  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = this.companyService.isCompanyLoading;

  companySizeOptions = COMPANY_SIZE_OPTIONS;

  constructor(private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      // Company Information
      name: ['', Validators.required],
      logo: [null],
      address: this.createAddressFormGroup(),
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      webSiteLink: [''],
      sector: ['', Validators.required],
      primaryColor: ['#3B82F6'], // Blue-500
      secondaryColor: ['#3BF686'],
      description: [''],
      foundedYear: [
        null,
        [Validators.min(1800), Validators.max(new Date().getFullYear())],
      ],
      companySize: [''],

      // HR Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      hrCountry: ['', Validators.required],
      hrEmail: ['', [Validators.required, Validators.email]],
    });
  }

  private createAddressFormGroup(): FormGroup {
    return this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.isCompanyFormValid()) {
      this.currentStep = 2;
      this.stepChange.emit(this.currentStep);
    }
  }

  previousStep(): void {
    this.currentStep = 1;
    this.stepChange.emit(this.currentStep);

    // Restore image preview if logo exists in form
    const logoFile = this.companyForm.get('logo')?.value;
    if (logoFile && logoFile instanceof File) {
      this.restoreImagePreview(logoFile);
    }

    // Trigger change detection to ensure UI updates
    this.cdr.detectChanges();
  }

  private restoreImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrl = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  isCompanyFormValid(): boolean {
    const companyControls = this.companyForm.controls;
    return (
      companyControls['name'].valid &&
      companyControls['address'].valid &&
      companyControls['contact'].valid &&
      companyControls['email'].valid &&
      companyControls['sector'].valid
    );
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = e.target?.result as string;
        this.companyForm.patchValue({ logo: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      const hrData: H_R_Request = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        country: formData.hrCountry,
        email: formData.hrEmail,
      };
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
        staffHr: hrData,
      };

      if (this.companyForm.value.logo) {
        companyData.logoUploadRequest = {
          contentType: detectContentType(this.companyForm.value.logo),
        };
        this.companyService.createCompany(
          companyData,
          this.companyForm.value.logo
        );
      } else {
        this.companyService.createCompany(companyData);
      }
    }
  }
}
