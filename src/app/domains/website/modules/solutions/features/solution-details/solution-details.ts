import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ISolution, IUser } from '@/app/core/interfaces';
import { environment } from '@/environments/environment';
import { SolutionSkeleton } from '../../ui/solution-skeleton/solution-skeleton';

@Component({
  imports: [DatePipe, MatButtonModule, RouterLink, SolutionSkeleton, TitleCasePipe],
  templateUrl: './solution-details.html'
})
export default class SolutionDetails {
  slug = input.required<string>();

  solutionResource = httpResource<{ data: ISolution }>(() => `/solutions/slug/${this.slug()}`);

  solutionImageUrl(image: string | null): string {
    return image ? `${environment.apiUrl}/uploads/solutions/${image}` : '/images/no-img.png';
  }

  profileImageUrl(user: IUser): string {
    return user?.profile ? `${environment.apiUrl}/uploads/profiles/${user.profile}` : '/images/avatar.webp';
  }
}
