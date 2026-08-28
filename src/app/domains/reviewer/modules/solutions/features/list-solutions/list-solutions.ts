import { DatePipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ICallSolution, ISolution, SolutionStatus } from '@/app/shared/interfaces';

@Component({
  selector: 'app-list-solutions',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './list-solutions.html'
})
export default class ListSolutions {
  private readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly call = signal<string>(this.route.snapshot.queryParamMap.get('call') ?? '');
  protected readonly pageIndex = signal(this.initialPage() - 1);
  protected readonly pageSize = 40;
  protected readonly displayedColumns = ['name', 'call', 'owner', 'status', 'updatedAt', 'actions'];

  protected readonly statusLabels: Record<SolutionStatus, string> = {
    pending: 'En attente',
    mapped: 'Cartographiée',
    explored: 'Explorée',
    experimented: 'Expérimentée'
  };

  private readonly queryParams = computed(() => {
    const call = this.call();
    return call ? new HttpParams().set('call', call) : new HttpParams();
  });

  protected readonly callsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/all');

  protected readonly solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => ({
    url: '/solutions/reviewer/me',
    params: this.queryParams()
  }));

  protected readonly solutions = computed(() => this.solutionsResource.value()?.data[0] ?? []);

  protected readonly paginatedSolutions = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.solutions().slice(start, start + this.pageSize);
  });

  protected onCallChange(call: string): void {
    this.call.set(call);
    this.pageIndex.set(0);
    this.persistFilters();
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.persistFilters();
  }

  protected statusLabel(status: SolutionStatus): string {
    return this.statusLabels[status];
  }

  protected hasReview(solution: ISolution): boolean {
    const user = this.authStore.user();
    return (
      !!user &&
      (solution.reviews?.some((review) => review.reviewer === user.id || review.reviewer === user.email) ?? false)
    );
  }

  private initialPage(): number {
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private persistFilters(): void {
    const page = this.pageIndex() + 1;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page === 1 ? null : page,
        call: this.call() || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
