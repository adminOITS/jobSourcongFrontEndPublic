import { Component, inject, Input } from '@angular/core';
import { SidebarComponent } from '../../../shared/main-left-sidebar/sidebar/sidebar.component';
import { AppSettingsService } from '../../../core/services/app-settings.service';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { ToolbarComponent } from '../../../shared/toolbar/toolbar.component';
import { SidebarItem } from '../../../core/types';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, CommonModule, ToolbarComponent],
  templateUrl: './main-layout.component.html',
  styles: ``,
})
export class MainLayoutComponent {
  @Input() sidebarItems: SidebarItem[] = [];

  private appSettingsService = inject(AppSettingsService);
  marginLeft = this.appSettingsService.marginLeft;
  globalLoading = this.appSettingsService.globalLoading;
}
