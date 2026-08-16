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
    id: 'overview',
    label: 'Vue d’ensemble',
    description: 'Suivez les indicateurs clés',
    children: [
      {
        id: 'stats',
        label: 'Statistiques',
        icon: 'chart-no-axes-combined',
        route: '/admin',
        activeOptions: { exact: true }
      }
    ]
  },
  {
    id: 'content',
    label: 'Contenu',
    description: 'Gérez les appels et les solutions',
    children: [
      {
        id: 'calls',
        label: 'Appels',
        icon: 'megaphone',
        route: 'calls',
        activeOptions: { exact: false }
      },
      {
        id: 'solutions',
        label: 'Solutions',
        icon: 'lightbulb',
        route: 'solutions',
        activeOptions: { exact: false }
      }
    ]
  },
  {
    id: 'users-and-access',
    label: 'Utilisateurs et accès',
    description: 'Gérez les comptes et les permissions',
    children: [
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
      },
      {
        id: 'roles',
        label: 'Rôles',
        icon: 'shield-check',
        route: 'roles',
        activeOptions: { exact: false }
      }
    ]
  }
];
