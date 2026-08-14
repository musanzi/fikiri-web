import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, TitleStrategy, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideIcons } from '@/app/core/icons/provider';
import { provideTheming } from '@/app/core/theming';
import { TranslocoHttpLoader } from '@/app/core/transloco/transloco-http-loader';
import { routes } from './app.routes';
import { httpInterceptor } from './core/interceptors';
import { PageTitleStrategy } from './core/strategies';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthStore } from './domains/auth/data-access/auth.store';
import { IUser } from './core/interfaces';
import { catchError, map, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideClientHydration(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    { provide: TitleStrategy, useClass: PageTitleStrategy },

    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      const http = inject(HttpClient);
      return http.get<{ data: IUser }>('auth/me').pipe(
        map(({ data }) => {
          authStore.setUser(data);
        }),
        catchError(() => {
          authStore.setUser(null);
          return of(null);
        })
      );
    }),

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    provideNativeDateAdapter(),

    provideIcons(),
    provideTheming({
      scheme: 'light',
      primary: '#006da4',
      error: '#dc2626'
    }),

    provideTransloco({
      config: {
        availableLangs: [
          { id: 'en', label: 'English' },
          { id: 'fr', label: 'Français' }
        ],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    })
  ]
};
