import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  effect,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import {
  InterviewDataRequest,
  InterviewDataResponse,
} from '../../../../../core/models/interview.models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  CANDIDATE_AVAILABILITY_STATUS_OPTIONS,
  CANDIDATE_PROGRESS_LEVEL_OPTIONS,
  CANDIDATE_WORK_SEARCH_OPTIONS,
  CURRENCIES,
  CURRENCIES_FR,
} from '../../../../../core/utils/constants';
import { InterviewDataService } from '../../../../../core/services/interview/interview-data.service';
import { ActivatedRoute } from '@angular/router';
import { Currency } from '../../../../../core/types';

@Component({
  selector: 'app-add-edit-interview-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    ButtonModule,
    TextareaModule,
    CheckboxModule,
  ],
  templateUrl: './add-edit-interview-data-form.component.html',
  styles: '',
})
export class AddEditInterviewDataFormComponent implements OnInit {
  interviewForm!: FormGroup;
  candidateWorkSearchOptions: { label: string; value: string }[] = [];
  progressLevelOptions: { label: string; value: string }[] = [];
  availabilityStatusOptions: { label: string; value: string }[] = [];
  currencies: Currency[] = CURRENCIES;

  private _candidateWorkSearchOptions = CANDIDATE_WORK_SEARCH_OPTIONS;
  private _progressLevelOptions = CANDIDATE_PROGRESS_LEVEL_OPTIONS;
  private _availabilityStatusOptions = CANDIDATE_AVAILABILITY_STATUS_OPTIONS;

  private interviewDataService = inject(InterviewDataService);
  isLoading = this.interviewDataService.interviewDataLoading;
  isActionLoading = this.interviewDataService.interviewDataActionLoading;
  interviewData = this.interviewDataService.interviewData;
  interviewId!: string;
  isEditMode = signal(false);
  private route = inject(ActivatedRoute);

  // Form change tracking
  private originalFormValue: any = null;
  private _formChanged = signal(false);
  formChanged = computed(() => this._formChanged());

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.interviewId = params['interviewId'];
    });
    this.initializeOptions();
    effect(() => {
      const interviewData = this.interviewData();
      if (interviewData) {
        this.isEditMode.set(true);
        this.patchForm(interviewData);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeOptions();
    this.setupFormChangeDetection();

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ lang }) => {
        if (lang === 'fr') {
          this.currencies = CURRENCIES_FR;
        } else {
          this.currencies = CURRENCIES;
        }
        this.initializeOptions();
      });
  }

  private setupFormChangeDetection(): void {
    // Listen to form value changes
    this.interviewForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkFormChanges();
      });
  }

  private checkFormChanges(): void {
    if (this.originalFormValue && this.interviewForm) {
      const currentValue = this.interviewForm.value;
      const hasChanges =
        JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue);
      this._formChanged.set(hasChanges);
    }
  }

  private saveOriginalFormValue(): void {
    if (this.interviewForm) {
      this.originalFormValue = JSON.parse(
        JSON.stringify(this.interviewForm.value)
      );
      this._formChanged.set(false);
    }
  }

  private initializeForm(): void {
    this.interviewForm = this.fb.group({
      currentlyEmployed: [null, Validators.required],
      motivationForChange: [''],
      candidateStatus: [null, Validators.required],

      otherRecruitmentProcesses: this.fb.group({
        hasOther: [false, Validators.required],
        progressLevel: [null],
      }),

      mobility: this.fb.group({
        isMobile: [false, Validators.required],
        mobilityZone: [''],
      }),

      compensation: this.fb.group({
        currency: [this.currencies[0], Validators.required],
        current: this.fb.group({
          grossTotal: [0, [Validators.min(0)]],
          fixedPortion: [0, [Validators.min(0)]],
          benefits: [0, [Validators.min(0)]],
        }),
        desired: this.fb.group({
          grossTotal: [0, [Validators.min(0)]],
          fixedPortion: [0, [Validators.min(0)]],
          benefits: [0, [Validators.min(0)]],
        }),
      }),

      availability: this.fb.group({
        status: ['', Validators.required],
        noticeDetails: this.fb.group({
          duration: [''],
          isNegotiable: [false],
          availabilityDate: [null],
        }),
      }),

      videoInterviewDate: [new Date(), Validators.required],

      essentialPoints: this.fb.group({
        matchingClientCriteria: [''],
        additionalStrengths: [''],
      }),

      experience: this.fb.group({
        relevantSkills: [''],
      }),

      personality: this.fb.group({
        softSkills: [''],
      }),

      motivationsAndExpectations: [''],
      trainingPlans: [''],
      references: [''],
    });

    // Save initial form value
    this.saveOriginalFormValue();
  }

  private patchForm(interviewData: InterviewDataResponse) {
    const currentCurrency = this.currencies.find(
      (c) => c.code === interviewData.compensation.currency
    );
    this.interviewForm.patchValue({
      currentlyEmployed: interviewData.currentlyEmployed,
      motivationForChange: interviewData.motivationForChange,
      candidateStatus: interviewData.candidateStatus,
      otherRecruitmentProcesses: {
        hasOther: interviewData.otherRecruitmentProcesses.hasOther,
        progressLevel: interviewData.otherRecruitmentProcesses.progressLevel,
      },
      mobility: {
        isMobile: interviewData.mobility.mobile,
        mobilityZone: interviewData.mobility.mobilityZone,
      },
      compensation: {
        currency: currentCurrency,
        current: interviewData.compensation.current,
        desired: interviewData.compensation.desired,
      },
      availability: {
        status: interviewData.availability.status,
        noticeDetails: interviewData.availability.noticeDetails,
      },
      videoInterviewDate: new Date(interviewData.videoInterviewDate),
      essentialPoints: interviewData.essentialPoints,
      experience: interviewData.experience,
      personality: {
        softSkills: interviewData.personality.softSkills,
      },
      motivationsAndExpectations: interviewData.motivationsAndExpectations,
      trainingPlans: interviewData.trainingPlans,
      references: interviewData.references,
    });

    // Save the patched form value as original
    setTimeout(() => {
      this.saveOriginalFormValue();
    }, 0);
  }

  private destroy$ = new Subject<void>();

  private initializeOptions(): void {
    this.candidateWorkSearchOptions = this._candidateWorkSearchOptions.map(
      (option) => ({
        label: this.translateService.instant(option.name),
        value: option.value,
      })
    );

    this.progressLevelOptions = this._progressLevelOptions.map((option) => ({
      label: this.translateService.instant(option.name),
      value: option.value,
    }));

    this.availabilityStatusOptions = this._availabilityStatusOptions.map(
      (option) => ({
        label: this.translateService.instant(option.name),
        value: option.value,
      })
    );
  }

  onSubmit(): void {
    if (this.interviewForm.valid) {
      const formData = this.interviewForm.value;

      const interviewData: InterviewDataRequest = {
        currentlyEmployed: formData.currentlyEmployed,
        motivationForChange: formData.motivationForChange,
        candidateStatus: formData.candidateStatus,

        otherRecruitmentProcesses: formData.otherRecruitmentProcesses,
        mobility: {
          mobile: formData.mobility.isMobile,
          mobilityZone: formData.mobility.mobilityZone,
        },
        compensation: {
          currency: formData.compensation.currency.code,
          current: {
            grossTotal: formData.compensation.current.grossTotal,
            fixedPortion: formData.compensation.current.fixedPortion,
            benefits: formData.compensation.current.benefits,
          },
          desired: {
            grossTotal: formData.compensation.desired.grossTotal,
            fixedPortion: formData.compensation.desired.fixedPortion,
            benefits: formData.compensation.desired.benefits,
          },
        },
        availability: formData.availability,
        videoInterviewDate: formData.videoInterviewDate,
        essentialPoints: formData.essentialPoints,
        experience: formData.experience,
        personality: {
          softSkills: formData.personality.softSkills,
        },
        motivationsAndExpectations: formData.motivationsAndExpectations,
        trainingPlans: formData.trainingPlans,
        references: formData.references,
      };
      if (this.isEditMode()) {
        this.interviewDataService.updateInterviewData(
          interviewData,
          this.interviewId,
          this.interviewData()?.id!
        );
        // Reset form change tracking after successful update
        this.saveOriginalFormValue();
      } else {
        this.interviewDataService.saveInterviewData(
          interviewData,
          this.interviewId
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get selectedCurrencyLocale(): string {
    const selectedCurrency = this.interviewForm.get(
      'compensation.currency'
    )?.value;
    const currency = this.currencies.find(
      (c) => c.code === selectedCurrency?.code
    );
    return currency?.locale || 'en-US';
  }

  // Method to check if update button should be disabled
  isUpdateDisabled(): boolean {
    return this.isEditMode() && !this.formChanged() && this.interviewForm.valid;
  }
}
