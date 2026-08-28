import { DecimalPipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryParams, IOutreacher } from '../interfaces/';

@Component({
  imports: [DecimalPipe, FormsModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './list-outreachers.html'
})
export default class ListOutreachers {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  page = signal<number>(this.initialPage());
  q = signal<string>(this.route.snapshot.queryParamMap.get('q') ?? '');

  debouncedQuery = debounced(this.q, 300);

  displayedColumns = ['name', 'email', 'outreachCount'];

  private queryParams = computed<IQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value()
  }));

  outreachersResource = httpResource<{ data: [IOutreacher[], number] }>(() => ({
    url: '/users/outreachers/count',
    params: this.queryParams() as unknown as HttpParams
  }));

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.persistFilters();
  }

  onQueryChange(query: string): void {
    this.q.set(query);
    this.page.set(1);
    this.persistFilters();
  }

  private initialPage(): number {
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private persistFilters(): void {
    const page = this.page();

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page === 1 ? null : page,
        q: this.q() || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
