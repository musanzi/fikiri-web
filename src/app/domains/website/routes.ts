import { Routes } from '@angular/router';
import { authenticatedGuard } from '@/app/core/guards';
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
        path: 'submit-solution',
        canActivate: [authenticatedGuard],
        loadChildren: () => import('./modules/submissions/routes')
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
