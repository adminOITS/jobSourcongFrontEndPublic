import { Component, Input, Signal, signal } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styles: ``,
})
export class LoaderComponent {
  @Input() isLoading: Signal<boolean> = signal(false);
}
