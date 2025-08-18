import { Injectable, signal, computed, inject } from '@angular/core';
import {
  OfferSkillRequest,
  OfferSkillResponse,
} from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { take, finalize } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root',
})
export class OfferSkillService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedSkill = signal<OfferSkillResponse | null>(null);
  private isDialogVisible = signal(false);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private offerService = inject(OfferService);
  private _isSkillLoading = signal<boolean>(false);
  offerSkills = this.offerService.offerSkills;

  selectedSkillComputed = computed(() => this.selectedSkill());
  isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isSkillLoading = computed(() => this._isSkillLoading());

  setSelectedSkill(skill: OfferSkillResponse | null) {
    this.selectedSkill.set(skill);
  }

  openAddDialog() {
    this.selectedSkill.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(skill: OfferSkillResponse) {
    this.selectedSkill.set(skill);
    this.isDialogVisible.set(true);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  closeDialog() {
    this.selectedSkill.set(null);
    this.isDialogVisible.set(false);
  }

  addSkill(skill: OfferSkillRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/skills`;
    this._isSkillLoading.set(true);
    return this.http
      .post<OfferSkillResponse>(url, skill)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isSkillLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SUCCESS'),
            detail: this.translateService.instant('SKILL_ADDED_SUCCESSFULLY'),
          });
          this.offerSkills.set([...this.offerSkills(), res]);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('ERROR'),
            detail: this.translateService.instant('ERROR_ADDING_SKILL'),
          });
        },
      });
  }

  updateSkill(skill: OfferSkillRequest) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const skillId: string = this.selectedSkillComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/skills/${skillId}`;
    this._isSkillLoading.set(true);
    return this.http
      .put<OfferSkillResponse>(url, skill)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isSkillLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.offerSkills.set([...this.offerSkills(), res]);
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SUCCESS'),
            detail: this.translateService.instant('SKILL_UPDATED_SUCCESSFULLY'),
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('ERROR'),
            detail: this.translateService.instant('ERROR_UPDATING_SKILL'),
          });
        },
      });
  }

  deleteSkill() {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const skillId: string = this.selectedSkillComputed()?.id!;
    const url = `${this.baseUrl}/${offerId}/skills/${skillId}`;
    this._isSkillLoading.set(true);
    return this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isSkillLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SUCCESS'),
            detail: this.translateService.instant('SKILL_DELETED_SUCCESSFULLY'),
          });
          this.offerSkills.set(
            this.offerSkills().filter((s) => s.id !== skillId)
          );
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('ERROR'),
            detail: this.translateService.instant('ERROR_DELETING_SKILL'),
          });
        },
      });
  }
}
