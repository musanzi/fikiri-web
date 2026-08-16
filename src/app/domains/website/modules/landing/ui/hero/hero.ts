import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';

@Component({
  selector: 'hero',
  imports: [RouterLink],
  templateUrl: './hero.html'
})
export class HeroComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly submitSolutionLink = computed(() =>
    this.authStore.user() ? '/submit-solution' : '/auth/sign-in'
  );
  protected readonly submitSolutionQueryParams = computed(() =>
    this.authStore.user() ? undefined : { returnUrl: '/submit-solution' }
  );
}
