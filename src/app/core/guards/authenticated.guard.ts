import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';

export const authenticatedGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.user() ? true : router.createUrlTree(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
};
