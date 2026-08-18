import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICallSolution } from '@/app/core/interfaces';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { environment } from '@/environments/environment';

@Component({
  selector: 'hero',
  imports: [DatePipe, RouterLink],
  templateUrl: './hero.html'
})
export class HeroComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly currentCallsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/current');

  protected readonly latestCall = computed(() => this.currentCallsResource.value()?.data[0]);
  protected readonly latestCallCoverUrl = computed(() => {
    const cover = this.latestCall()?.cover;
    return cover ? `${environment.apiUrl}/uploads/calls/covers/${cover}` : '/images/no-img.png';
  });

  protected readonly submitSolutionLink = computed(() =>
    this.authStore.user() ? '/submit-solution' : '/auth/sign-in?returnUrl=submit-solution'
  );
}
