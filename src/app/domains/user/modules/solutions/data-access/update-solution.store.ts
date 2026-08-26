import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IUpdateSolutionPayload } from '../interfaces';

interface IUpdateSolutionState {
  isLoading: boolean;
  error: string;
}

export const UpdateSolutionStore = signalStore(
  withState<IUpdateSolutionState>({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    updateSolution: rxMethod<{ id: string; payload: IUpdateSolutionPayload }>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isLoading: true, error: '' });

          return _http.patch(`/solutions/${id}`, payload).pipe(
            tap(() => _router.navigate(['/user/solutions'])),
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
