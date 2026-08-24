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
        loadComponent: () => import('./modules/solutions/features/list-solutions/list-solutions')
      },
      {
        path: 'calls',
        children: [
          {
            path: '',
            title: 'Appels',
            loadComponent: () => import('./modules/calls/features/list-calls/calls')
          },
          {
            path: 'add',
            title: 'Ajouter un appel',
            loadComponent: () => import('./modules/calls/features/add-call/add-call')
          },
          {
            path: ':id',
            title: 'Modifier un appel',
            loadComponent: () => import('./modules/calls/features/update-call/update-call')
          }
        ]
      },
      {
        path: 'roles',
        title: 'Rôles',
        loadComponent: () => import('./modules/roles/features/list-roles/list-roles')
      },
      {
        path: 'organizations',
        title: 'Organisations',
        loadComponent: () => import('./modules/organizations/features/list-organizations/list-organizations')
      },
      {
        path: 'outreachers',
        title: 'Ambassadeurs',
        loadComponent: () => import('./modules/outreachers/features/list-outreachers')
      },
      {
        path: 'profile',
        title: 'Mon profil',
        loadComponent: () => import('./modules/profile/features/profile/profile')
      }
    ]
  }
];

export default routes;
