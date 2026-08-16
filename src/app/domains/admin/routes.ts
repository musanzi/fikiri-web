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
        path: 'solutions',
        title: 'Solutions',
        loadComponent: () => import('./modules/solutions/features/list-solutions/solutions')
      },
      {
        path: 'calls',
        title: 'Appels',
        loadComponent: () => import('./modules/calls/features/list-calls/calls')
      },
      {
        path: 'roles',
        title: 'Rôles',
        loadComponent: () => import('./modules/roles/features/list-roles/roles')
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
