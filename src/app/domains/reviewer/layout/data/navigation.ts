import { INavigationItem } from '@/app/shared/interfaces';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'account',
    label: 'Mon compte',
    description: 'Gérez vos informations personnelles',
    children: [
      {
        id: 'profile',
        label: 'Mon profil',
        icon: 'user-round',
        route: '/reviewer/profile',
        activeOptions: { exact: true }
      }
    ]
  },
  {
    id: 'solutions-management',
    label: 'Évaluations',
    description: 'Consultez les solutions qui vous sont assignées',
    children: [
      {
        id: 'solutions',
        label: 'Solutions assignées',
        icon: 'lightbulb',
        route: '/reviewer/solutions',
        activeOptions: { exact: false }
      }
    ]
  }
];
