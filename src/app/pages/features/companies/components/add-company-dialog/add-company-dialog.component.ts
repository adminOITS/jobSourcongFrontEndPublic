import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { AddCompanyFormComponent } from '../add-company-form/add-company-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService } from '../../../../../core/services/company/company.service';

@Component({
  selector: 'app-add-company-dialog',
  standalone: true,
  imports: [DialogModule, AddCompanyFormComponent, TranslateModule],
  templateUrl: './add-company-dialog.component.html',
  styles: ``,
})
export class AddCompanyDialogComponent {
  private companyService = inject(CompanyService);
  isLoading = this.companyService.isCompanyLoading;
  isVisible = this.companyService.isCompanyAddDialogVisible;
  currentStep = 1;

  onHideDialog(): void {
    this.currentStep = 1;
    this.companyService.closeAddCompanyDialog();
  }

  onStepChange(step: number): void {
    this.currentStep = step;
  }
  setIsCompanyAddDialogVisible(visible: boolean) {
    this.companyService.setIsCompanyAddDialogVisible(visible);
  }
}
