import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import {
  IOrganizationPayload,
  IOrganizationResponse,
  IOrganizationsResponse,
  IOrganizationsState,
  IRemoveOrganizationCommand,
  IUpdateOrganizationCommand
} from '../interfaces/organizations.interface';

const initialState: IOrganizationsState = {
  organizations: [],
  isLoading: false,
  isSaving: false,
  removingOrganizationId: '',
  error: ''
};

export const OrganizationsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    loadOrganizations: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap(() =>
          _http.get<IOrganizationsResponse>('/organizations').pipe(
            tap(({ data }) => patchState(store, { organizations: data })),
            catchError(() => {
              patchState(store, { error: 'Impossible de charger les organisations. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    createOrganization: rxMethod<IOrganizationPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IOrganizationResponse>('/organizations', payload).pipe(
            tap(({ data }) => patchState(store, { organizations: [...store.organizations(), data] })),
            catchError(() => {
              patchState(store, { error: "Impossible de créer l'organisation. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateOrganization: rxMethod<IUpdateOrganizationCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IOrganizationResponse>(`/organizations/${id}`, payload).pipe(
            tap(({ data }) =>
              patchState(store, {
                organizations: store
                  .organizations()
                  .map((organization) => (organization.id === id ? data : organization))
              })
            ),
            catchError(() => {
              patchState(store, { error: "Impossible de modifier l'organisation. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeOrganization: rxMethod<IRemoveOrganizationCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingOrganizationId: id, error: '' });
          return _http.post<void>(`/organizations/${id}`, {}).pipe(
            tap(() =>
              patchState(store, {
                organizations: store.organizations().filter((organization) => organization.id !== id)
              })
            ),
            catchError(() => {
              patchState(store, { error: "Impossible de supprimer l'organisation. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingOrganizationId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
