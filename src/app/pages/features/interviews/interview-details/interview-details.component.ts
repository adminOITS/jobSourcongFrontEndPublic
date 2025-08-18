import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewDataService } from '../../../../core/services/interview/interview-data.service';
import { InterviewDataActionsMenuComponent } from '../components/interview-data-actions-menu/interview-data-actions-menu.component';
import { ROUTES } from '../../../../routes';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    InterviewDataActionsMenuComponent,
    ConfirmDialogModule,
    LoaderComponent,
    HasRoleDirective,
  ],
  providers: [ConfirmationService],
  templateUrl: './interview-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class InterviewDetailsComponent implements OnInit {
  @ViewChild('interviewDataActionsMenu')
  interviewDataActionsMenu!: InterviewDataActionsMenuComponent;

  menuItems: MenuItem[] = [];

  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  interviewDataService = inject(InterviewDataService);
  interviewData = this.interviewDataService.interviewData;
  interviewDataLoading = this.interviewDataService.interviewDataLoading;
  interviewId!: string;
  router = inject(Router);
  constructor() {
    this.route.params.subscribe((params) => {
      this.interviewId = params['interviewId'];
      this.interviewDataService.getInterviewData(this.interviewId);
    });
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('INTERVIEW_DETAILS').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }

  ngOnInit() {}

  toggleMenu(event: Event) {
    this.interviewDataActionsMenu.toggle(event);
  }

  onEditInterviewData() {
    const currentRoute = this.router.url;
    const url = currentRoute.split('/');
    this.router.navigate([
      `${url[1]}/${ROUTES.INTERVIEW.LIST}/edit/${this.interviewId}`,
    ]);
  }

  onDeleteInterviewData() {
    this.confirmationService.confirm({
      accept: () => {
        this.interviewDataService.deleteInterviewData(
          this.interviewData()?.id!,
          this.interviewId
        );
      },
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
