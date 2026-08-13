import { Routes } from '@angular/router';

export const solutionsRoutes: Routes = [
  {
    path: '',
    title: 'Solutions',
    loadComponent: () => import('./solutions/features/solutions/solutions').then((component) => component.Solutions)
  },
  {
    path: ':slug',
    title: 'Détails de la solution',
    loadComponent: () =>
      import('./solutions/features/solution-details/solution-details').then((component) => component.SolutionDetails)
  }
];
