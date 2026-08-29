import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IAwardSolutionResponse, IAwardSolutionState } from '../interfaces';

const initialState: IAwardSolutionState = {
  awardingSolutionId: '',
  updatedSolutions: [],
  error: '',
  isSaved: false
};

export const AwardSolutionStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    toggleAward: rxMethod<string>(
      pipe(
        concatMap((id) => {
          patchState(store, { awardingSolutionId: id, error: '', isSaved: false });

          return _http.post<IAwardSolutionResponse>(`/solutions/${id}/award`, {}).pipe(
            tap(({ data }) =>
              patchState(store, {
                updatedSolutions: [...store.updatedSolutions().filter((solution) => solution.id !== data.id), data],
                isSaved: true
              })
            ),
            catchError(() => {
              patchState(store, {
                error: 'Impossible de modifier le statut lauréat de cette solution. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { awardingSolutionId: '' }))
          );
        })
      )
    ),
    clearFeedback(): void {
      patchState(store, { error: '', isSaved: false });
    }
  }))
);
