import { Component, inject, Input } from '@angular/core';
import { SidebarItem } from '../../../core/types';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { WindowResizeService } from '../../../core/services/window-resize.service';
import { AppSettingsService } from '../../../core/services/app-settings.service';

@Component({
  selector: 'app-sidebar-item',
  imports: [
    NgClass,
    RouterModule,
    RouterLink,
    TooltipModule,
    NgIf,
    NgFor,
    TranslateModule,
  ],
  templateUrl: './sidebar-item.component.html',
  styles: ``,
})
export class SidebarItemComponent {
  @Input() item!: SidebarItem;
  @Input() isExpanded!: boolean;

  windowResizeService = inject(WindowResizeService);
  appSettingsService = inject(AppSettingsService);
  open = false;

  toggle() {
    this.open = !this.open;
  }
  navigateClick() {
    if (!this.windowResizeService.isLargeScreen()) {
      this.appSettingsService.toggleMobileSidebar();
    }
  }
}
