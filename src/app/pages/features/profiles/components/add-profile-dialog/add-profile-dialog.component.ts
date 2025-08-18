import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditCandidateProfileFormComponent } from '../add-edit-candidate-profile-form/add-edit-candidate-profile-form.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProfileService } from '../../../../../core/services/candidate/profile.service';

@Component({
  selector: 'app-add-profile-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AddEditCandidateProfileFormComponent,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './add-profile-dialog.component.html',
  styles: ``,
})
export class AddProfileDialogComponent {
  private profileService = inject(ProfileService);
  isDialogVisible = this.profileService.isAddProfileDialogVisible;
  setIsDialogVisible(val: boolean) {
    this.profileService.setIsAddProfileDialogVisible(val);
  }
  closeDialog() {
    this.profileService.closeProfileDialog();
  }
}
