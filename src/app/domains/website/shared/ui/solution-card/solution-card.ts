import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISolution } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-solution-card',
  imports: [DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './solution-card.html'
})
export class SolutionCardComponent {
  solution = input.required<ISolution>();

  solutionImageUrl = computed(() => {
    return this.solution().image
      ? `${environment.apiUrl}/uploads/solutions/${this.solution().image}`
      : '/images/no-img.png';
  });

  profileImageUrl = computed(() => {
    return this.solution().user?.profile
      ? `${environment.apiUrl}/uploads/profiles/${this.solution().user?.profile}`
      : '/images/avatar.webp';
  });
}
