import { Route } from '@angular/router';
import { adminGuard, unauthGuard } from './core/guards';

export const routes: Route[] = [
  {
    path: 'auth',
    canActivate: [unauthGuard],
    loadChildren: () => import('./domains/auth/routes')
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./domains/admin/routes')
  },
  {
    path: '',
    loadChildren: () => import('./domains/website/routes')
  }
];
