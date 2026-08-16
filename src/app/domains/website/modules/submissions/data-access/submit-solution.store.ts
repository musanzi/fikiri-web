import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, map, of, pipe, tap } from 'rxjs';
import { CreateSolutionPayload } from '../interfaces/submission.interface';

interface SubmitSolutionState {
  isLoading: boolean;
  error: string;
  createdSolutionId: string | null;
}

export interface SubmitSolutionRequest {
  payload: CreateSolutionPayload;
  thumbnail: File;
}

interface CreateSolutionResponse {
  data: { id: string };
}

const thumbnailFormData = (thumbnail: File): FormData => {
  const body = new FormData();
  body.append('thumb', thumbnail);
  return body;
};

export const SubmitSolutionStore = signalStore(
  withState<SubmitSolutionState>({ isLoading: false, error: '', createdSolutionId: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    submitSolution: rxMethod<SubmitSolutionRequest>(
      pipe(
        concatMap(({ payload, thumbnail }) => {
          patchState(store, { isLoading: true, error: '' });
          const createdSolutionId = store.createdSolutionId();
          const solutionId$ = createdSolutionId
            ? of(createdSolutionId)
            : _http.post<CreateSolutionResponse>('/solutions', payload).pipe(
                map(({ data }) => data.id),
                tap((id) => patchState(store, { createdSolutionId: id }))
              );

          return solutionId$.pipe(
            concatMap((id) => _http.post(`/solutions/${id}/image`, thumbnailFormData(thumbnail))),
            tap(() => {
              patchState(store, { createdSolutionId: null });
              void _router.navigate(['/submit-solution/success']);
            }),
            catchError(() => {
              patchState(store, {
                error: 'Impossible de soumettre votre solution. Vérifiez vos informations puis réessayez.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    )
  }))
);
