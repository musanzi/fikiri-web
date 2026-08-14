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
    id: 'dashboards',
    label: 'Dashboards',
    description: 'Overview of key metrics',
    children: [
      {
        id: 'dashboards/project',
        label: 'Project',
        icon: 'folder-kanban',
        route: '/admin/dashboards/project'
      },
      {
        id: 'dashboards/analytics',
        label: 'Analytics',
        icon: 'chart-area',
        route: '/admin/dashboards/analytics'
      },
      {
        id: 'dashboards/finance',
        label: 'Finance',
        icon: 'chart-candlestick',
        route: '/admin/dashboards/finance'
      }
    ]
  }
];
