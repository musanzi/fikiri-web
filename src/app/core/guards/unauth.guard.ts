import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';

export const unauthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isUser()) {
    return router.parseUrl('/user');
  }

  if (authStore.isReviewer()) {
    return router.parseUrl('/reviewer');
  }

  if (authStore.isAdmin()) {
    return router.parseUrl('/admin');
  }

  return true;
};
