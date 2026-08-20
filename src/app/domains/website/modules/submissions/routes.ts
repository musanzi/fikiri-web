import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Proposer une solution',
    loadComponent: () => import('./features/submit-solution/submit-solution')
  }
];

export default routes;
