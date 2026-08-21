import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { IForgotPasswordPayload } from '../interfaces/forgot-password.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '@/app/core/interfaces';
import { IAuthRequestState } from '../interfaces/auth-state.interface';

export const ForgotPasswordStore = signalStore(
  withState<IAuthRequestState>({
    isLoading: false,
    error: ''
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    forgotPassword: rxMethod<IForgotPasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('/auth/forgot-password', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              void _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, {
                isLoading: false,
                error: "Impossible d'envoyer le lien de réinitialisation. Veuillez réessayer."
              });
              return of(null);
            })
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
