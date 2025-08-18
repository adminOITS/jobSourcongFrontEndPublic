import { Injectable, computed, inject, signal } from '@angular/core';
import { OfferNotes } from '../../models/offer.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, take } from 'rxjs';
import { OFFER_SERVICE_DOMAIN } from '../../utils/constants';
import { OfferService } from './offer.service';
import { MessageWrapperService } from '../message-wrapper.service';
@Injectable({
  providedIn: 'root',
})
export class OfferNotesService {
  private readonly baseUrl = environment.domain + OFFER_SERVICE_DOMAIN;
  private http = inject(HttpClient);
  private offerService = inject(OfferService);
  private messageWrapper = inject(MessageWrapperService);
  // State signals
  private selectedNote = signal<OfferNotes | undefined>(undefined);
  private isDialogVisible = signal<boolean>(false);
  private _isNoteLoading = signal<boolean>(false);

  // Public computed values
  readonly selectedNoteComputed = computed(() => this.selectedNote());
  readonly isDialogVisibleComputed = computed(() => this.isDialogVisible());
  readonly isNoteLoading = computed(() => this._isNoteLoading());
  setSelectedNote(note: OfferNotes | undefined) {
    this.selectedNote.set(note);
  }

  setDialogVisible(visible: boolean) {
    this.isDialogVisible.set(visible);
  }

  updateNote(note: OfferNotes) {
    const offerId: string = this.offerService.offerDetails()?.id!;
    const url = `${this.baseUrl}/${offerId}/notes`;
    this._isNoteLoading.set(true);
    return this.http
      .put<OfferNotes>(url, note)
      .pipe(
        take(1),
        finalize(() => {
          this._isNoteLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageWrapper.success('NOTES_UPDATED_SUCCESSFULLY');
          this.offerService.offerNotes.set(res.notes);
          this.offerService.updateOfferNotes(res);
          this.closeDialog();
        },
        error: (err) => {
          this.messageWrapper.error('ERROR_UPDATING_NOTES');
        },
      });
  }

  // Helper methods
  private clearSelection() {
    this.selectedNote.set(undefined);
    this.isDialogVisible.set(false);
  }

  // Dialog management
  openAddDialog() {
    this.selectedNote.set(undefined);
    this.isDialogVisible.set(true);
  }

  openEditDialog(note: OfferNotes) {
    this.selectedNote.set(note);
    this.isDialogVisible.set(true);
  }

  closeDialog() {
    this.clearSelection();
  }
}
