import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ISignUpPayload } from '../interfaces/sign-up.interface';
import { IUser } from '@/app/core/interfaces';
import { ISignUpState } from '../interfaces/auth-state.interface';

export const SignUpStore = signalStore(
  withState<ISignUpState>({ isLoading: false, user: null, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    signUp: rxMethod<{ payload: ISignUpPayload; link: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap((params) => {
          const { payload, link } = params;
          return _http.post<{ data: IUser }>('/auth/sign-up', payload, { params: { link } }).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              void _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, {
                isLoading: false,
                error: 'Impossible de créer votre compte. Vérifiez vos informations puis réessayez.'
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
