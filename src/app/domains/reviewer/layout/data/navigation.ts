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
        route: '/user/profile',
        activeOptions: { exact: true }
      }
    ]
  },
  {
    id: 'solutions-management',
    label: 'Candidatures',
    description: 'Gérez les solutions que vous avez proposées',
    children: [
      {
        id: 'solutions',
        label: 'Mes solutions',
        icon: 'lightbulb',
        route: '/user/solutions',
        activeOptions: { exact: false }
      }
    ]
  }
];
