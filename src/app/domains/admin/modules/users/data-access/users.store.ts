import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, forkJoin, pipe, switchMap, tap } from 'rxjs';
import {
  IOrganizationsLookupResponse,
  IQueryParams,
  IRemoveUserCommand,
  IRolesLookupResponse,
  IUpdateUserCommand,
  IUserPayload,
  IUserResponse,
  IUsersResponse,
  IUsersState
} from '../interfaces/users.interface';

const initialState: IUsersState = {
  users: [],
  usersCount: 0,
  roles: [],
  organizations: [],
  isLoading: false,
  isLoadingLookups: false,
  isSaving: false,
  isExporting: false,
  removingUserId: '',
  error: ''
};

export const UsersStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _document: inject(DOCUMENT),
    _http: inject(HttpClient)
  })),
  withMethods(({ _document, _http, ...store }) => ({
    loadUsers: rxMethod<IQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap((params) =>
          _http.get<IUsersResponse>('/users', { params: { page: params.page, q: params.q } }).pipe(
            tap(({ data: [users, usersCount] }) => patchState(store, { users, usersCount })),
            catchError(() => {
              patchState(store, { error: 'Impossible de charger les utilisateurs. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    loadLookups: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoadingLookups: true, error: '' })),
        switchMap(() =>
          forkJoin({
            roles: _http.get<IRolesLookupResponse>('/roles'),
            organizations: _http.get<IOrganizationsLookupResponse>('/organizations')
          }).pipe(
            tap(({ roles, organizations }) =>
              patchState(store, { roles: roles.data, organizations: organizations.data })
            ),
            catchError(() => {
              patchState(store, { error: 'Impossible de charger les rôles et organisations.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoadingLookups: false }))
          )
        )
      )
    ),
    createUser: rxMethod<IUserPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IUserResponse>('/users', payload).pipe(
            tap(({ data }) => {
              const user = {
                ...data,
                organization: store.organizations().find(({ id }) => id === payload.organisation) ?? null,
                roles: store.roles().filter(({ id }) => payload.roles.includes(id)),
                socials: payload.socials
              };
              patchState(store, {
                users: [user, ...store.users()],
                usersCount: store.usersCount() + 1
              });
            }),
            catchError(() => {
              patchState(store, { error: "Impossible de créer l'utilisateur. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateUser: rxMethod<IUpdateUserCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IUserResponse>(`/users/${id}`, payload).pipe(
            tap(({ data }) => {
              const user = {
                ...data,
                organization:
                  store.organizations().find((organization) => organization.id === payload.organisation) ?? null,
                roles: store.roles().filter((role) => payload.roles.includes(role.id)),
                socials: payload.socials
              };
              patchState(store, {
                users: store.users().map((currentUser) => (currentUser.id === id ? user : currentUser))
              });
            }),
            catchError(() => {
              patchState(store, { error: "Impossible de modifier l'utilisateur. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeUser: rxMethod<IRemoveUserCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingUserId: id, error: '' });
          return _http.delete<void>(`/users/${id}`).pipe(
            tap(() =>
              patchState(store, {
                users: store.users().filter((user) => user.id !== id),
                usersCount: Math.max(0, store.usersCount() - 1)
              })
            ),
            catchError(() => {
              patchState(store, { error: "Impossible de supprimer l'utilisateur. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingUserId: '' }))
          );
        })
      )
    ),
    exportUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isExporting: true, error: '' })),
        switchMap(() =>
          _http.get('/users/export/csv', { responseType: 'blob' }).pipe(
            tap((csv) => {
              const urlApi = _document.defaultView?.URL;
              if (!urlApi) return;

              const url = urlApi.createObjectURL(csv);
              const link = _document.createElement('a');
              link.href = url;
              link.download = `utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              urlApi.revokeObjectURL(url);
            }),
            catchError(() => {
              patchState(store, { error: "Impossible d'exporter les utilisateurs. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isExporting: false }))
          )
        )
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
