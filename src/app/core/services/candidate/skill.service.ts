import { Injectable, signal, computed, inject } from '@angular/core';
import { SkillRequest, SkillResponse } from '../../models/candidate.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { take, finalize } from 'rxjs';
import { CANDIDATE_SERVICE_DOMAIN } from '../../utils/constants';
import { MessageWrapperService } from '../message-wrapper.service';
import { CandidateService } from './candidate.service';
@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly baseUrl = environment.domain + CANDIDATE_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private selectedSkill = signal<SkillResponse | null>(null);
  private _skills = signal<SkillResponse[]>([]);
  private _skillsByProfile = signal<SkillResponse[]>([]);
  private isDialogVisible = signal(false);
  private _isSkillLoading = signal<boolean>(false);
  private _isSkillsLoading = signal<boolean>(false);
  private _isSkillsByProfileLoading = signal<boolean>(false);

  readonly skills = computed(() => this._skills());
  readonly selectedSkillComputed = computed(() => this.selectedSkill());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isSkillLoading = computed(() => this._isSkillLoading());
  readonly isSkillsLoading = computed(() => this._isSkillsLoading());
  readonly isSkillsByProfileLoading = computed(() =>
    this._isSkillsByProfileLoading()
  );
  readonly skillsByProfile = computed(() => this._skillsByProfile());
  messageWrapper = inject(MessageWrapperService);
  candidateService = inject(CandidateService);
  candidateSkills = this.candidateService.candidateSkills;

  openAddDialog() {
    this.selectedSkill.set(null);
    this.isDialogVisible.set(true);
  }

  openEditDialog(skill: SkillResponse) {
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

  setSelectedSkill(skill: SkillResponse) {
    this.selectedSkill.set(skill);
  }

  getSkillsByCandidateId() {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/skills`;
    this._isSkillsLoading.set(true);
    return this.http
      .get<SkillResponse[]>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isSkillsLoading.set(false);
        })
      )
      .subscribe({
        next: (skills) => {
          this._skills.set(skills);
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_FETCHING_SKILLS');
        },
      });
  }
  getSkillsByProfileId(profileId: string) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/skills/profiles/${profileId}`;
    this._isSkillsByProfileLoading.set(true);
    return this.http
      .get<SkillResponse[]>(url)
      .pipe(
        take(1),
        finalize(() => {
          this._isSkillsByProfileLoading.set(false);
        })
      )
      .subscribe({
        next: (skills) => {
          this._skillsByProfile.set(skills);
        },
      });
  }
  addSkill(skill: SkillRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const url = `${this.baseUrl}/${candidateId}/skills`;
    this._isSkillLoading.set(true);
    return this.http
      .post<SkillResponse>(url, skill)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isSkillLoading.set(false);
        })
      )
      .subscribe({
        next: (skill) => {
          this.messageWrapper.success('SKILL_ADDED_SUCCESSFULLY');
          this.candidateSkills.set([...this.candidateSkills(), skill]);
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_ADDING_SKILL');
        },
      });
  }
  updateSkill(skill: SkillRequest) {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const skillId: string = this.selectedSkillComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/skills/${skillId}`;
    this._isSkillLoading.set(true);
    return this.http
      .put<SkillResponse>(url, skill)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
          this._isSkillLoading.set(false);
        })
      )
      .subscribe({
        next: (skill) => {
          this.messageWrapper.success('SKILL_UPDATED_SUCCESSFULLY');
          this.candidateSkills.set(
            this.candidateSkills().map((s) => (s.id === skill.id ? skill : s))
          );
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_UPDATING_SKILL');
        },
      });
  }

  deleteSkill() {
    const candidateId = this.candidateService.candidateDetails()?.id;
    const skillId: string = this.selectedSkillComputed()?.id!;
    const url = `${this.baseUrl}/${candidateId}/skills/${skillId}`;
    this._isSkillLoading.set(true);
    return this.http
      .delete<void>(url)
      .pipe(
        take(1),
        finalize(() => {
          this.closeDialog();
        })
      )
      .subscribe({
        next: () => {
          this.messageWrapper.success('SKILL_DELETED_SUCCESSFULLY');
          this.candidateSkills.set(
            this.candidateSkills().filter((s) => s.id !== skillId)
          );
        },
        error: (error) => {
          this.messageWrapper.error('ERROR_DELETING_SKILL');
        },
      });
  }
  setSkillsByProfile(skills: SkillResponse[]) {
    this._skillsByProfile.set(skills);
  }
}
