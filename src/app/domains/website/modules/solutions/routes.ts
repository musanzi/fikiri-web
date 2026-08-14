import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Solutions',
    loadComponent: () => import('./features/solutions/solutions')
  },
  {
    path: ':slug',
    title: 'Détails de la solution',
    loadComponent: () => import('./features/solution-details/solution-details')
  }
];

export default routes;
