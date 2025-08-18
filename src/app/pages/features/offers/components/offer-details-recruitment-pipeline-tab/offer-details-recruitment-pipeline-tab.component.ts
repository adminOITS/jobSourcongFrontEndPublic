import { Component, Input } from '@angular/core';
import { OfferResponse } from '../../../../../core/models/offer.models';
import { OfferDetailsRecruitmentPipelineBoardComponent } from '../offer-details-recruitment-pipeline-board/offer-details-recruitment-pipeline-board.component';

@Component({
  selector: 'app-offer-details-recruitment-pipeline-tab',
  imports: [OfferDetailsRecruitmentPipelineBoardComponent],
  templateUrl: './offer-details-recruitment-pipeline-tab.component.html',
  styles: ``,
})
export class OfferDetailsRecruitmentPipelineTabComponent {
  @Input() offer: OfferResponse | null = null;
}
