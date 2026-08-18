import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ISolution } from '@/app/core/interfaces';
import { SolutionCardComponent, SolutionCardSkeletonComponent } from '@/app/domains/website/shared/ui';

@Component({
  imports: [MatButtonModule, MatPaginatorModule, SolutionCardComponent, SolutionCardSkeletonComponent],
  templateUrl: './solutions.html'
})
export default class Solutions {
  page = signal<number>(1);
  limit = signal<number>(12);

  private queryParams = computed(() => ({
    page: this.page(),
    limit: this.limit()
  }));

  solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => ({
    url: '/solutions/mapped',
    params: this.queryParams()
  }));

  onPageChange(event: PageEvent): void {
    this.limit.set(event.pageSize);
    this.page.set(event.pageIndex + 1);
  }
}
