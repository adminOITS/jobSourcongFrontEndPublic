import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StatsCardData } from '../../../../../core/types';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div
      class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden h-40 flex flex-col"
    >
      <!-- Background decoration -->
      <div
        class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full -translate-y-10 translate-x-10 opacity-60 group-hover:opacity-80 transition-opacity"
      ></div>

      <div class="relative z-10 flex flex-col h-full">
        <!-- Header with icon and title -->
        <div class="flex items-start justify-between mb-4 flex-shrink-0">
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 truncate"
              [title]="data.title | translate"
            >
              {{ data.title | translate }}
            </p>
            <h3
              class="text-3xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              {{ data.value.toLocaleString() }}
            </h3>
          </div>
          <div
            class="w-14 h-14 flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0"
            [ngClass]="data.bgColor"
          >
            <i [class]="data.icon + ' ' + data.iconColor + ' text-xl'"></i>
          </div>
        </div>

        <!-- Trend indicator -->
        <div class="mt-auto" *ngIf="data.trend">
          <div class="flex items-center space-x-2">
            <div
              class="flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
              [ngClass]="
                data.trend.isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              "
            >
              <i
                [class]="
                  data.trend.isPositive
                    ? 'pi pi-arrow-up text-xs mr-1'
                    : 'pi pi-arrow-down text-xs mr-1'
                "
              ></i>
              {{ data.trend.value }}%
            </div>
            <span
              class="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-28"
              [title]="data.trend.period | translate"
            >
              {{ data.trend.period | translate }}
            </span>
          </div>
        </div>

        <!-- Bottom accent line -->
        <div
          class="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
      </div>
    </div>
  `,
  styles: [],
})
export class StatsCardComponent {
  @Input() data!: StatsCardData;
}
