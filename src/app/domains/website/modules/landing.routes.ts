import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./landing/features/landing').then((c) => c.LandingComponent)
  }
];
