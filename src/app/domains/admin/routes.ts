import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        title: 'Admin',
        loadComponent: () => import('./modules/stats/features/stats')
      },
      {
        path: 'users',
        title: 'Utilisateurs',
        loadComponent: () => import('./modules/users/features/list-users/users')
      },
      {
        path: 'outreachers',
        title: 'Ambassadeurs',
        loadComponent: () => import('./modules/outreachers/features/outreachers')
      }
    ]
  }
];

export default routes;
