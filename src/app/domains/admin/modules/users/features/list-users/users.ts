import { DatePipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryParams, UserRow } from '../../interfaces/users.interface';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [DatePipe, MatButtonModule, FormsModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './users.html'
})
export default class Users {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  page = signal<number>(1);
  q = signal<string>('');

  debouncedQuery = debounced(this.q, 300);

  displayedColumns = ['name', 'email', 'phoneNumber', 'roles', 'createdAt'];
  pageIndex = computed(() => Math.max(0, this.page() - 1));

  private queryParams = computed<IQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value()
  }));

  usersResource = httpResource<{ data: [UserRow[], number] }>(() => ({
    url: '/users',
    params: this.queryParams() as unknown as HttpParams
  }));

  onPageChange(event: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.pageIndex + 1 },
      queryParamsHandling: 'merge'
    });
  }
}
