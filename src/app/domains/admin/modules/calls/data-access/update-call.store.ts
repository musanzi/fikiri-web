import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IUpdatedCallPayload } from '../interfaces/calls.interface';

interface UpdateCallState {
  isLoading: boolean;
  error: string;
}

export const UpdateCallStore = signalStore(
  withState<UpdateCallState>({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    updateCall: rxMethod<{ id: string; payload: IUpdatedCallPayload; cover?: File }>(
      pipe(
        concatMap(({ id, payload, cover }) => {
          patchState(store, { isLoading: true, error: '' });
          return _http.patch(`/calls/${id}`, payload).pipe(
            switchMap(() => {
              if (!cover) {
                return of(null);
              }
              const body = new FormData();
              body.append('cover', cover);
              return _http.post(`/calls/cover/${id}`, body);
            }),
            tap(() => _router.navigate(['/admin/calls'])),
            catchError(() => {
              patchState(store, { error: "Impossible de modifier l'appel. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    )
  }))
);
