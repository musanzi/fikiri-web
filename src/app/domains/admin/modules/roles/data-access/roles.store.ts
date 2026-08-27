import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import {
  IRemoveRoleCommand,
  IRolePayload,
  IRoleResponse,
  IRolesResponse,
  IRolesState,
  IUpdateRoleCommand
} from '../interfaces/roles.interface';

const initialState: IRolesState = {
  roles: [],
  isLoading: false,
  isSaving: false,
  removingRoleId: '',
  error: ''
};

export const RolesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap(() =>
          _http.get<IRolesResponse>('/roles').pipe(
            tap(({ data }) => patchState(store, { roles: data })),
            catchError(() => {
              patchState(store, { error: 'Impossible de charger les rôles. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    createRole: rxMethod<IRolePayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IRoleResponse>('/roles', payload).pipe(
            tap(({ data }) => patchState(store, { roles: [...store.roles(), data] })),
            catchError(() => {
              patchState(store, { error: 'Impossible de créer le rôle. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateRole: rxMethod<IUpdateRoleCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IRoleResponse>(`/roles/${id}`, payload).pipe(
            tap(({ data }) =>
              patchState(store, {
                roles: store.roles().map((role) => (role.id === id ? data : role))
              })
            ),
            catchError(() => {
              patchState(store, { error: 'Impossible de modifier le rôle. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeRole: rxMethod<IRemoveRoleCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingRoleId: id, error: '' });
          return _http.delete<void>(`/roles/${id}`, {}).pipe(
            tap(() => patchState(store, { roles: store.roles().filter((role) => role.id !== id) })),
            catchError(() => {
              patchState(store, { error: 'Impossible de supprimer le rôle. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingRoleId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
