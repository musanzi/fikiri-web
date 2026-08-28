import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IReviewPayload, IReviewResponse, IReviewState, IUpdateReviewCommand } from '../interfaces';

const initialState: IReviewState = {
  review: null,
  isSaving: false,
  saved: false,
  error: ''
};

export const ReviewStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createReview: rxMethod<IReviewPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, saved: false, error: '' });
          return _http.post<IReviewResponse>('/reviews', payload).pipe(
            tap(({ data }) => patchState(store, { review: data, saved: true })),
            catchError(() => {
              patchState(store, { error: "Impossible d'enregistrer l'évaluation. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateReview: rxMethod<IUpdateReviewCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, saved: false, error: '' });
          return _http.patch<IReviewResponse>(`/reviews/${id}`, payload).pipe(
            tap(({ data }) => patchState(store, { review: data, saved: true })),
            catchError(() => {
              patchState(store, { error: "Impossible de modifier l'évaluation. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    )
  }))
);
