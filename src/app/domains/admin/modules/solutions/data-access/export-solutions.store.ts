import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { IExportSolutionsState, QueryParams } from '../interfaces';

const initialState: IExportSolutionsState = {
  isExporting: false,
  error: ''
};

export const ExportSolutionsStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _document: inject(DOCUMENT),
    _http: inject(HttpClient)
  })),
  withMethods(({ _document, _http, ...store }) => ({
    exportSolutions: rxMethod<QueryParams>(
      pipe(
        tap(() => patchState(store, { isExporting: true, error: '' })),
        switchMap((params) =>
          _http.get('/solutions/export/csv', { params: params as HttpParams, responseType: 'blob' }).pipe(
            tap((csv) => {
              const urlApi = _document.defaultView?.URL;
              if (!urlApi) return;

              const url = urlApi.createObjectURL(csv);
              const link = _document.createElement('a');
              link.href = url;
              link.download = `solutions-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              urlApi.revokeObjectURL(url);
            }),
            catchError(() => {
              patchState(store, { error: "Impossible d'exporter les solutions. Veuillez réessayer." });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isExporting: false }))
          )
        )
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
