import { Component, effect, inject, signal } from '@angular/core';
import { OfferDetailsApplicationsTabTableComponent } from '../../../applications/components/offer-details-applications-tab-table/offer-details-applications-tab-table.component';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditInterviewScheduleDialogComponent } from '../../../interviews/components/add-edit-interview-schedule-dialog/add-edit-interview-schedule-dialog.component';
import { ApplicationService } from '../../../../../core/services/applications/application.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsFilterFormComponent } from '../../../applications/components/applications-filter-form/applications-filter-form.component';
import { ApplicationSearchRequest } from '../../../../../core/models/application.models';
import {
  DEFAULT_APPLICATION_PAGE,
  DEFAULT_APPLICATION_SIZE,
} from '../../../../../core/utils/constants';

@Component({
  selector: 'app-offer-details-applications-tab',
  imports: [
    OfferDetailsApplicationsTabTableComponent,
    CommonModule,
    FloatLabelModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    AddEditInterviewScheduleDialogComponent,
    ApplicationsFilterFormComponent,
  ],
  templateUrl: './offer-details-applications-tab.component.html',
  styles: ``,
})
export class OfferDetailsApplicationsTabComponent {
  applicationService = inject(ApplicationService);
  route = inject(ActivatedRoute);
  request = signal<ApplicationSearchRequest>({
    page: DEFAULT_APPLICATION_PAGE,
    size: DEFAULT_APPLICATION_SIZE,
  });
  offerId: string = '';
  constructor() {
    this.route.params.subscribe((params) => {
      this.offerId = params['offerId'];
    });
    effect(() => {
      const filters = this.request();
      this.applicationService.getApplicationsByJobOfferId(
        this.offerId,
        filters
      );
    });
  }
  ngOnInit() {
    this.applicationService.getApplicationsByJobOfferId(this.offerId);
  }
}
