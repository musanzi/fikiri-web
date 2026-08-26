import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ISolution, SolutionStatus } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './list-solutions.html'
})
export default class ListSolutions {
  private readonly authStore = inject(AuthStore);

  protected readonly statusLabels: Record<SolutionStatus, string> = {
    pending: 'En attente',
    mapped: 'Cartographiée',
    explored: 'Explorée',
    experimented: 'Expérimentée'
  };

  protected readonly solutionsResource = httpResource<{ data: ISolution[] }>(() => {
    const userId = this.authStore.user()?.id;
    return userId ? `/solutions/user/${userId}` : undefined;
  });

  protected imageUrl(solution: ISolution): string {
    return solution.image ? `${environment.apiUrl}/uploads/solutions/${solution.image}` : '/images/no-img.png';
  }
}
