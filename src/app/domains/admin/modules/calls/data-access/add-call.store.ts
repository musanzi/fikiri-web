import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, map, of, pipe, tap } from 'rxjs';
import { CreateCallPayload } from '../interfaces/calls.interface';

interface AddCallState {
  isLoading: boolean;
  error: string;
  createdCallId: string | null;
}

export interface AddCallRequest {
  payload: CreateCallPayload;
  cover: File;
}

interface CreateCallResponse {
  data: { id: string };
}

const coverFormData = (cover: File): FormData => {
  const body = new FormData();
  body.append('cover', cover);
  return body;
};

export const AddCallStore = signalStore(
  withState<AddCallState>({ isLoading: false, error: '', createdCallId: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    addCall: rxMethod<AddCallRequest>(
      pipe(
        concatMap(({ payload, cover }) => {
          patchState(store, { isLoading: true, error: '' });
          const createdCallId = store.createdCallId();
          const callId$ = createdCallId
            ? of(createdCallId)
            : _http.post<CreateCallResponse>('/calls', payload).pipe(
                map(({ data }) => data.id),
                tap((id) => patchState(store, { createdCallId: id }))
              );

          return callId$.pipe(
            concatMap((id) => _http.post(`/calls/cover/${id}`, coverFormData(cover))),
            tap(() => {
              patchState(store, { createdCallId: null });
              void _router.navigate(['/admin/calls']);
            }),
            catchError(() => {
              patchState(store, { error: "Impossible de créer l'appel. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    )
  }))
);
