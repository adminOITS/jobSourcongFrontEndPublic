import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { MyPreset } from '../../base-theme';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '',
        },
      },
    }),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
        defaultLanguage: 'en',
        useDefaultLang: true,
        isolate: false,
        extend: true,
      })
    ),
    MessageService,
  ],
};
