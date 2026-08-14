import { Routes } from '@angular/router';
import { WebLayout } from '@/app/domains/website/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: WebLayout,
    children: [
      {
        path: 'solutions',
        title: 'Solutions',
        loadChildren: () => import('./modules/solutions/routes')
      },
      {
        path: '',
        title: 'Home',
        loadChildren: () => import('./modules/landing/routes')
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

export default routes;
