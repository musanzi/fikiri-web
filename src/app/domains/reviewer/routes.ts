import { Routes } from '@angular/router';
import { ReviewerLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: ReviewerLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'solutions'
      },
      {
        path: 'profile',
        title: 'Mon profil',
        loadComponent: () => import('../common/modules/profile/features/profile/profile')
      },
      {
        path: 'solutions',
        title: 'Solutions assignées',
        loadComponent: () => import('./modules/solutions/features/list-solutions/list-solutions')
      }
    ]
  }
];

export default routes;
