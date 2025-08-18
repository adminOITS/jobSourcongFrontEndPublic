import { Component, inject, effect } from '@angular/core';
import { AddOfferFormComponent } from '../components/add-offer-form/add-offer-form.component';
import { AppSettingsService } from '../../../../core/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-offer',
  imports: [AddOfferFormComponent],
  templateUrl: './add-offer.component.html',
  styles: ``,
})
export class AddOfferComponent {
  appSettingsService = inject(AppSettingsService);
  translateService = inject(TranslateService);
  constructor() {
    effect(() => {
      const language = this.appSettingsService.language();
      this.translateService.get('ADD_OFFER').subscribe((res) => {
        this.appSettingsService.setTitle(res);
      });
    });
  }
}
