import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ISignInPayload } from '../interfaces/sign-in.interface';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { IUser } from '@/app/core/interfaces';

interface ISignInStore {
  isLoading: boolean;
}

export const SignInStore = signalStore(
  withState<ISignInStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _authStore: inject(AuthStore)
  })),
  withMethods(({ _http, _authStore, _router, ...store }) => ({
    signIn: rxMethod<ISignInPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('/auth/sign-in', payload).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false });
              _authStore.setUser(data);
              void _router.navigate(['/admin']);
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
