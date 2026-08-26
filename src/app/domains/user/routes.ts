import { Routes } from '@angular/router';
import { UserLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      },
      {
        path: 'profile',
        title: 'Mon profil',
        loadComponent: () => import('./modules/profile/features/profile/profile')
      },
      {
        path: 'solutions',
        children: [
          {
            path: '',
            title: 'Mes solutions',
            loadComponent: () => import('./modules/solutions/features/list-solutions/list-solutions')
          },
          {
            path: ':id',
            title: 'Modifier une solution',
            loadComponent: () => import('./modules/solutions/features/update-solution/update-solution')
          }
        ]
      }
    ]
  }
];

export default routes;
