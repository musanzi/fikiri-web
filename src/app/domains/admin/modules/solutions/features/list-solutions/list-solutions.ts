import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, debounced, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICallSolution, ISolution, SolutionStatus } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui/message/message';
import { AwardSolutionStore } from '../../data-access/award-solution.store';
import { QueryParams } from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    Message,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './list-solutions.html',
  providers: [AwardSolutionStore]
})
export default class ListSolutions {
  protected readonly awardStore = inject(AwardSolutionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly page = signal<number>(this.initialPage());
  readonly q = signal<string>(this.route.snapshot.queryParamMap.get('q') ?? '');
  readonly call = signal<string>(this.route.snapshot.queryParamMap.get('call') ?? '');

  readonly debouncedQuery = debounced(this.q, 300);
  readonly displayedColumns = ['name', 'owner', 'status', 'reviewNote', 'updatedAt', 'actions'];

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
    this.persistFilters();
  }

  onQueryChange(query: string): void {
    this.q.set(query);
    this.page.set(1);
    this.persistFilters();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.persistFilters();
  }

  statusLabel(status: SolutionStatus): string {
    return this.statusLabels[status];
  }

  isAwarded(solution: ISolution): boolean {
    const updatedSolution = this.awardStore
      .updatedSolutions()
      .find((candidate) => candidate.id === solution.id);

    return updatedSolution ? updatedSolution.award !== null : solution.award !== null;
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
        q: this.q() || null,
        call: this.call() || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
