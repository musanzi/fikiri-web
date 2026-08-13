import { Routes } from '@angular/router';
import { WebLayout } from '@/app/domains/website/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: WebLayout,
    children: [
      {
        path: 'solutions',
        loadChildren: () => import('./modules/solutions.routes').then((routes) => routes.solutionsRoutes)
      },
      {
        path: '',
        loadChildren: () => import('./modules/landing.routes').then((routes) => routes.landingRoutes)
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

export default routes;
