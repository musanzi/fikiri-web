import { DatePipe } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ICallSolution, ISolution, SolutionStatus } from '@/app/shared/interfaces';

@Component({
  selector: 'app-list-solutions',
  imports: [DatePipe, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTableModule],
  templateUrl: './list-solutions.html'
})
export default class ListSolutions {
  protected readonly call = signal<string>('');
  protected readonly displayedColumns = ['name', 'call', 'owner', 'status', 'updatedAt'];

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

  protected readonly solutionsResource = httpResource<{ data: ISolution[] }>(() => ({
    url: '/solutions/reviewer/me',
    params: this.queryParams()
  }));

  protected statusLabel(status: SolutionStatus): string {
    return this.statusLabels[status];
  }
}
