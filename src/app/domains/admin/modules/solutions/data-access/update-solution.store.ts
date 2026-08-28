import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IUpdateSolutionPayload } from '../interfaces';

interface IUpdateSolutionState {
  isLoading: boolean;
  error: string;
  isSaved: boolean;
}

export const UpdateSolutionStore = signalStore(
  withState<IUpdateSolutionState>({ isLoading: false, error: '', isSaved: false }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    updateSolution: rxMethod<{ id: string; payload: IUpdateSolutionPayload }>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isLoading: true, error: '', isSaved: false });

          return _http.patch(`/solutions/${id}`, payload).pipe(
            tap(() => patchState(store, { isSaved: true })),
            catchError(() => {
              patchState(store, { error: 'Impossible de modifier la solution. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    )
  }))
);
