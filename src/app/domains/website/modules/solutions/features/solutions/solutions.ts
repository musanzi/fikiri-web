import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ISolution } from '@/app/core/interfaces';
import { SolutionCardSkeletonComponent } from '../../ui/solution-card-skeleton/solution-card-skeleton';
import { SolutionCardComponent } from '../../ui/solution-card/solution-card';

@Component({
  imports: [MatButtonModule, MatPaginatorModule, SolutionCardComponent, SolutionCardSkeletonComponent],
  templateUrl: './solutions.html'
})
export default class Solutions {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  page = input<string | null>(null);
  limit = input<string | null>(null);

  pageIndex = computed(() => Math.max(0, this.toPositiveInteger(this.page(), 1) - 1));
  pageSize = computed(() => this.toPositiveInteger(this.limit(), 8));

  private queryParams = computed(() => ({
    page: this.page(),
    limit: this.limit()
  }));

  solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => ({
    url: '/solutions/mapped',
    params: this.queryParams() as unknown as HttpParams
  }));

  onPageChange(event: PageEvent): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: event.pageIndex + 1,
        limit: event.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }

  private toPositiveInteger(value: string | null, fallback: number): number {
    const parsedValue = Number(value);

    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
  }
}
