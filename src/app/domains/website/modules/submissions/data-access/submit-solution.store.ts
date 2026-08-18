import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, map, pipe, switchMap, tap } from 'rxjs';
import { ICreateSolutionPayload } from '../interfaces/submission.interface';
import { ISolution } from '@/app/core/interfaces';

interface SubmitSolutionState {
  isLoading: boolean;
  error: string;
}

export interface SubmitSolutionRequest {
  payload: ICreateSolutionPayload;
  thumbnail: File;
}

const thumbnailFormData = (thumbnail: File): FormData => {
  const body = new FormData();
  body.append('thumb', thumbnail);
  return body;
};

export const SubmitSolutionStore = signalStore(
  withState<SubmitSolutionState>({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withMethods(({ _http, _router, ...store }) => ({
    submitSolution: rxMethod<SubmitSolutionRequest>(
      pipe(
        concatMap(({ payload, thumbnail }) => {
          patchState(store, { isLoading: true, error: '' });
          return _http.post<{ data: ISolution }>('/solutions', payload).pipe(
            map(({ data }) => data.id),
            switchMap((id) => _http.post(`/solutions/${id}/image`, thumbnailFormData(thumbnail))),
            tap(() => _router.navigate(['/submit-solution/success'])),
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
