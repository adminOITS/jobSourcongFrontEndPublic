import { computed, inject, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  fromEvent,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowResizeService {
  // Signal to track screen size
  #isLargeScreen = signal<boolean>(false);
  isLargeScreen = computed(this.#isLargeScreen);
  constructor() {
    this.updateScreenSize();

    // Listen to window resize events
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        tap(() => this.updateScreenSize())
      )
      .subscribe();
  }

  private updateScreenSize() {
    const isLarge = window.innerWidth >= 900; // lg breakpoint
    this.#isLargeScreen.set(isLarge);
  }
}
