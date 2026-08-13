import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SolutionCardComponent } from '../../../solutions/ui/solution-card/solution-card';
import { SolutionCardSkeletonComponent } from '../../../solutions/ui/solution-card-skeleton/solution-card-skeleton';
import { httpResource } from '@angular/common/http';
import { ISolution } from '@/app/core/interfaces';

@Component({
  selector: 'awards',
  imports: [MatButtonModule, MatIconModule, RouterLink, SolutionCardComponent, SolutionCardSkeletonComponent],
  templateUrl: './awards.html'
})
export class Awards {
  readonly solutionsResource = httpResource<{ data: ISolution[] }>(() => '/solutions/awards');
}
