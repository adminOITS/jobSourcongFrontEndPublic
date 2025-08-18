import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-empty',
  imports: [ChartModule],
  templateUrl: './empty.component.html',
  styles: ``,
})
export class EmptyComponent {
  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);
  constructor(private cd: ChangeDetectorRef) {}

  // themeEffect = effect(() => {
  //     if (this.configService.transitionComplete()) {
  //         if (this.designerService.preset()) {
  //             this.initChart();
  //         }
  //     }
  // });

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-primary-contrast'
      );

      this.data = {
        labels: [
          'functional skills',
          'technical skills',
          'languages',
          // 'certifications',
          // 'projects',
          // 'volunteer',
          // 'awards',
        ],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: 'rgb(255, 99, 132)',
            pointBorderWidth: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
            borderWidth: 4,
            fill: true,

            data: [
              65, 59, 90,
              // 81, 56, 55, 40
            ],
          },
          {
            label: 'My Second dataset',
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            // pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: 'rgb(54, 162, 235)',
            pointBorderWidth: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
            borderWidth: 4,
            // pointBorderWidth: 10,
            // pointStyle: 'triangle',
            pointBackgroundColor: 'rgb(74, 162, 235)',
            data: [
              28, 48, 40,
              // 19, 96, 27, 100
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          elements: {
            line: {
              borderWidth: 3,
            },
          },
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        // scales: {
        //   r: {
        //     grid: {
        //       // color: textColorSecondary,
        //     },
        //   },
        // },
        scale: {
          pointLabels: {
            fontSize: 50,
            fontColor: '#fff',
          },
        },
      };
    }
    this.cd.markForCheck();
  }
}
