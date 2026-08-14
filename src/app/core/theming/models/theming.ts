import { TonalPalette } from '@/app/core/theming/palette';

export type Scheme = 'light' | 'dark' | 'system';
export interface Colors {
  primary: string;
  error: string;
}
export type ThemeConfig = Colors & Record<'scheme', Scheme>;

export interface Theme {
  primary: TonalPalette;
  error: TonalPalette;
}
