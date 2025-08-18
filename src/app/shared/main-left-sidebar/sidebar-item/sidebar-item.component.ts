import { Component, inject, Input } from '@angular/core';
import { SidebarItem } from '../../../core/types';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

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

  open = false;

  toggle() {
    this.open = !this.open;
  }
}
