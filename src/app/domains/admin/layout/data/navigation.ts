import { IsActiveMatchOptions } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
}

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview of key metrics',
    children: [
      {
        id: 'stats',
        label: 'Statistiques',
        icon: 'chart-no-axes-combined',
        route: '/admin',
        activeOptions: { exact: true }
      },
      {
        id: 'users',
        label: 'Utilisateurs',
        icon: 'users',
        route: 'users',
        activeOptions: { exact: false }
      },
      {
        id: 'outreachers',
        label: 'Ambassadeurs',
        icon: 'user-round-search',
        route: 'outreachers',
        activeOptions: { exact: false }
      }
    ]
  }
];
