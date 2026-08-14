import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { IResetPasswordPayload } from '../interfaces/reset-password.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '@/app/core/interfaces';

interface IResetPasswordStore {
  isLoading: boolean;
}

export const ResetPasswordStore = signalStore(
  withState<IResetPasswordStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    resetPassword: rxMethod<IResetPasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('/auth/reset-password', payload).pipe(
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
