import { INavigationLink } from '../interfaces/navigation.interface';

export const NAVIGATION_LINKS: readonly INavigationLink[] = [
  { name: 'Accueil', path: '/', icon: 'house' },
  { name: 'Solutions', path: '/solutions', icon: 'lightbulb' },
  { name: 'À propos', path: '/', fragment: 'about', icon: 'info' },
  { name: 'Notre mission', path: '/', fragment: 'mission', icon: 'target' },
  { name: 'Les champions', path: '/', fragment: 'awards', icon: 'award' },
  { name: 'SDGs', path: '/', fragment: 'sdgs', icon: 'earth' }
];
