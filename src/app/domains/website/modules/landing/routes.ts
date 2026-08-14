import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/landing')
  }
];

export default routes;
