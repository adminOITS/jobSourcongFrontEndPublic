import { Component, inject, Input } from '@angular/core';
import { WindowResizeService } from '../../../core/services/window-resize.service';
import { DesktopSidebarComponent } from '../desktop-sidebar/desktop-sidebar.component';
import { MobileSidebarComponent } from '../mobile-sidebar/mobile-sidebar.component';
import { SidebarItem } from '../../../core/types';

@Component({
  selector: 'app-sidebar',
  imports: [DesktopSidebarComponent, MobileSidebarComponent],

  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent {
  @Input() sidebarItems: SidebarItem[] = [];

  private windowResizeService = inject(WindowResizeService);
  isLargeScreen = this.windowResizeService.isLargeScreen;
}
