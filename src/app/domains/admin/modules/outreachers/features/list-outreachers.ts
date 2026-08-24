import { DecimalPipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { IQueryParams, IOutreacher } from '../interfaces/';

@Component({
  imports: [DecimalPipe, FormsModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './list-outreachers.html'
})
export default class ListOutreachers {
  page = signal<number>(1);
  q = signal<string>('');

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
  }
}
