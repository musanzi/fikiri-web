import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISolution, IUser } from '@/app/core/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-solution-card',
  imports: [DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './solution-card.html'
})
export class SolutionCardComponent {
  readonly solution = input.required<ISolution>();

  solutionImage(image: string | null): string {
    return image ? `${environment.apiUrl}/uploads/solutions/${image}` : '/images/no-img.png';
  }

  profileImage(user: IUser | null | undefined): string {
    return user?.profile ? `${environment.apiUrl}/uploads/profiles/${user.profile}` : '/images/avatar.webp';
  }
}
