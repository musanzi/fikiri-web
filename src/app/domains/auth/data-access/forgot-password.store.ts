import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { IForgotPasswordPayload } from '../interfaces/forgot-password.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '@/app/core/interfaces';

interface IForgotPasswordStore {
  isLoading: boolean;
}

export const ForgotPasswordStore = signalStore(
  withState<IForgotPasswordStore>({
    isLoading: false
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    forgotPassword: rxMethod<IForgotPasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('/auth/forgot-password', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              void _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
