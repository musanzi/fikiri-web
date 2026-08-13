import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SolutionCardComponent } from '../solution-card/solution-card';
import { SolutionCardSkeletonComponent } from '../solution-card-skeleton/solution-card-skeleton';
import { httpResource } from '@angular/common/http';
import { ISolution } from '@/app/core/interfaces';

@Component({
  selector: 'solutions-awards',
  imports: [MatButtonModule, MatIconModule, RouterLink, SolutionCardComponent, SolutionCardSkeletonComponent],
  templateUrl: './solutions.html'
})
export class SolutionsAwards {
  readonly solutionsResource = httpResource<{ data: ISolution[] }>(() => '/solutions/awards');
}
