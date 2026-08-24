import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IUpdateProfilePayload } from '@/app/shared/interfaces';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IProfileResponse, IProfileState, IUpdatePasswordPayload } from '../interfaces/profile.interface';

const initialState: IProfileState = {
  isUpdatingProfile: false,
  isUpdatingPassword: false,
  profileUpdated: false,
  passwordUpdated: false,
  profileError: '',
  passwordError: ''
};

export const ProfileStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _authStore: inject(AuthStore),
    _http: inject(HttpClient)
  })),
  withMethods(({ _authStore, _http, ...store }) => ({
    updateProfile: rxMethod<IUpdateProfilePayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isUpdatingProfile: true, profileUpdated: false, profileError: '' });
          return _http.patch<IProfileResponse>('/auth/profile', payload).pipe(
            tap(({ data }) => {
              _authStore.setUser(data);
              patchState(store, { profileUpdated: true });
            }),
            catchError(() => {
              patchState(store, {
                profileError: 'Impossible de mettre à jour le profil. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isUpdatingProfile: false }))
          );
        })
      )
    ),
    updatePassword: rxMethod<IUpdatePasswordPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isUpdatingPassword: true, passwordUpdated: false, passwordError: '' });
          return _http.patch<void>('/auth/update-password', payload).pipe(
            tap(() => patchState(store, { passwordUpdated: true })),
            catchError(() => {
              patchState(store, {
                passwordError: 'Impossible de mettre à jour le mot de passe. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isUpdatingPassword: false }))
          );
        })
      )
    ),
    clearProfileMessage(): void {
      patchState(store, { profileUpdated: false, profileError: '' });
    },
    clearPasswordMessage(): void {
      patchState(store, { passwordUpdated: false, passwordError: '' });
    }
  }))
);
