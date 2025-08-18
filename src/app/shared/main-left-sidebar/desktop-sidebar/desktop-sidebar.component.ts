import { Component, inject, Input } from '@angular/core';
import { AppSettingsService } from '../../../core/services/app-settings.service';
import { SidebarItem } from '../../../core/types';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-desktop-sidebar',
  imports: [SidebarItemComponent, NgFor],
  templateUrl: './desktop-sidebar.component.html',
  styles: ``,
})
export class DesktopSidebarComponent {
  @Input() sidebarItems: SidebarItem[] = [];

  private appSettingsService = inject(AppSettingsService);
  sidebarWidth = this.appSettingsService.sidebarWidth;
  isExpanded = this.appSettingsService.isExpanded;
}
