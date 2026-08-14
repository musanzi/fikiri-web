import { signalStore, withState, withMethods, patchState, withProps, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@/app/core/interfaces';

interface IAuthStore {
  user: IUser | null;
  isCheckingAuth: boolean;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IAuthStore>({ user: null, isCheckingAuth: true }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withComputed(({ user }) => ({
    hasRights: computed(() => {
      const roles = user()?.roles;
      return roles?.some((role) => role === 'admin');
    })
  })),
  withMethods(({ _http, _router, ...store }) => ({
    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isCheckingAuth: true })),
        exhaustMap(() =>
          _http.get<{ data: IUser }>('auth/me').pipe(
            tap(({ data }) => {
              patchState(store, { user: data, isCheckingAuth: false });
            }),
            catchError(() => {
              patchState(store, { user: null, isCheckingAuth: false });
              return of(null);
            })
          )
        )
      )
    ),
    signOut: rxMethod<void>(
      pipe(
        exhaustMap(() =>
          _http.post<void>('auth/signout', {}).pipe(
            tap(() => {
              _router.navigate(['/']);
              patchState(store, { user: null });
            }),
            catchError(() => {
              return of(null);
            })
          )
        )
      )
    ),
    setUser: (user: IUser | null) => {
      patchState(store, { user });
    }
  }))
);
