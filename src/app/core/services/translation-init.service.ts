import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationInitService {
  private translateService = inject(TranslateService);
  private translationsLoaded = new BehaviorSubject<boolean>(false);

  initializeTranslations(): Observable<boolean> {
    const defaultLang = 'en';

    // First set the default language
    this.translateService.setDefaultLang(defaultLang);

    // Then load the translations
    return new Observable<boolean>((observer) => {
      this.translateService.use(defaultLang).subscribe({
        next: () => {
          this.translationsLoaded.next(true);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          console.error('Error loading translations:', error);
          observer.error(error);
        },
      });
    });
  }

  isTranslationsLoaded(): Observable<boolean> {
    return this.translationsLoaded.asObservable();
  }
}
