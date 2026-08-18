import { DatePipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ICallRow, IQueryParams } from '../../interfaces/calls.interface';

@Component({
  imports: [DatePipe, FormsModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, RouterLink],
  templateUrl: './calls.html'
})
export default class Calls {
  readonly page = signal<number>(1);
  readonly q = signal<string>('');

  readonly debouncedQuery = debounced(this.q, 300);
  readonly displayedColumns = ['name', 'period', 'solutionsCount', 'actions'];

  private readonly queryParams = computed<IQueryParams>(() => ({
    page: String(this.page()),
    q: this.debouncedQuery.value()
  }));

  readonly callsResource = httpResource<{ data: [ICallRow[], number] }>(() => ({
    url: '/calls',
    params: this.queryParams() as unknown as HttpParams
  }));

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }
}
