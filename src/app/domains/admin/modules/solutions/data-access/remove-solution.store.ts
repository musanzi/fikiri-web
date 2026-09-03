import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IRemoveSolutionState } from '../interfaces';

const initialState: IRemoveSolutionState = {
  removingSolutionId: '',
  removedSolutionId: '',
  error: ''
};

export const RemoveSolutionStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    removeSolution: rxMethod<string>(
      pipe(
        concatMap((id) => {
          patchState(store, { removingSolutionId: id, removedSolutionId: '', error: '' });

          return _http.delete<void>(`/solutions/${id}`).pipe(
            tap(() => patchState(store, { removedSolutionId: id })),
            catchError(() => {
              patchState(store, { error: 'Impossible de supprimer cette solution. Veuillez réessayer.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingSolutionId: '' }))
          );
        })
      )
    ),
    clearFeedback(): void {
      patchState(store, { removedSolutionId: '', error: '' });
    }
  }))
);
