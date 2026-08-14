import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'auth',
    // canActivate: [unauthGuard],
    loadChildren: () => import('./domains/auth/routes')
  },
  {
    path: 'admin',
    // canActivate: [authGuard],
    loadChildren: () => import('./domains/admin/routes')
  },
  {
    path: '',
    loadChildren: () => import('./domains/website/routes')
  }
];
