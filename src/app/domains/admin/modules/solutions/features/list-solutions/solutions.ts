import { DatePipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ICallSolution, ISolution, SolutionStatus } from '@/app/core/interfaces';
import { QueryParams } from '../../interfaces/solutions.interface';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './solutions.html'
})
export default class Solutions {
  readonly page = signal<number>(1);
  readonly q = signal<string>('');
  readonly call = signal<string>('');

  readonly debouncedQuery = debounced(this.q, 300);
  readonly displayedColumns = ['name', 'owner', 'status', 'updatedAt'];

  readonly statusLabels: Record<SolutionStatus, string> = {
    pending: 'En attente',
    mapped: 'Cartographiée',
    explored: 'Explorée',
    experimented: 'Expérimentée'
  };

  private readonly queryParams = computed<QueryParams>(() => ({
    page: String(this.page()),
    q: this.debouncedQuery.value(),
    call: this.call()
  }));

  readonly callsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/all');

  readonly solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => ({
    url: '/solutions',
    params: this.queryParams() as HttpParams
  }));

  onCallChange(call: string): void {
    this.call.set(call);
    this.page.set(1);
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  statusLabel(status: SolutionStatus): string {
    return this.statusLabels[status];
  }
}
