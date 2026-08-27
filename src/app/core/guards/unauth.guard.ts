import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';

export const unauthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAdmin()) {
    return router.parseUrl('/admin');
  }

  if (authStore.isReviewer()) {
    return router.parseUrl('/reviwer');
  }

  if (authStore.isUser()) {
    return router.parseUrl('/user');
  }

  return true;
};
