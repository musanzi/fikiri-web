import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Proposer une solution',
    loadComponent: () => import('./features/submit-solution/submit-solution')
  },
  {
    path: 'success',
    title: 'Solution soumise',
    loadComponent: () => import('./features/submission-success/submission-success')
  }
];

export default routes;
