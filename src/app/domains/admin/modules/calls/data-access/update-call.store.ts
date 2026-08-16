import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, of, pipe, tap } from 'rxjs';
import { CreateCallPayload } from '../interfaces/calls.interface';

interface UpdateCallState {
  isLoading: boolean;
  error: string;
}

export interface UpdateCallRequest {
  id: string;
  payload: CreateCallPayload;
  cover?: File;
}

const coverFormData = (cover: File): FormData => {
  const body = new FormData();
  body.append('cover', cover);
  return body;
};

export const UpdateCallStore = signalStore(
  withState<UpdateCallState>({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    updateCall: rxMethod<UpdateCallRequest>(
      pipe(
        concatMap(({ id, payload, cover }) => {
          patchState(store, { isLoading: true, error: '' });

          return _http.patch(`/calls/${id}`, payload).pipe(
            concatMap(() => (cover ? _http.post(`/calls/cover/${id}`, coverFormData(cover)) : of(null))),
            tap(() => void _router.navigate(['/admin/calls'])),
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
