import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const hasRights = authStore.hasRights();

  if (!hasRights) {
    return router.navigate(['/admin']);
  }

  return true;
};
