import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, map, pipe, switchMap, tap } from 'rxjs';
import { ICallSolution } from '@/app/core/interfaces';
import { ICreateCallPayload } from '../interfaces/calls.interface';

interface AddCallState {
  isLoading: boolean;
  error: string;
}

export const AddCallStore = signalStore(
  withState<AddCallState>({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    addCall: rxMethod<{ payload: ICreateCallPayload; cover: File }>(
      pipe(
        concatMap(({ payload, cover }) => {
          patchState(store, { isLoading: true, error: '' });
          return _http.post<{ data: ICallSolution }>('/calls', payload).pipe(
            map(({ data }) => data.id),
            switchMap((id) => {
              const body = new FormData();
              body.append('cover', cover);
              return _http.post(`/calls/cover/${id}`, body);
            }),
            tap(() => _router.navigate(['/admin/calls'])),
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
