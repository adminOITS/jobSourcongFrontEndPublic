import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AppSettingsService } from '../../../core/services/app-settings.service';
import { SidebarItem } from '../../../core/types';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-mobile-sidebar',
  imports: [DrawerModule, ButtonModule, SidebarItemComponent, NgFor],
  templateUrl: './mobile-sidebar.component.html',
  styles: ``,
})
export class MobileSidebarComponent {
  @Input() sidebarItems: SidebarItem[] = [];
  private appSettingsService = inject(AppSettingsService);

  mobileSidebarVisible = this.appSettingsService.mobileSidebarVisible;
  toggleMobileSidebar = this.appSettingsService.toggleMobileSidebar;
}
