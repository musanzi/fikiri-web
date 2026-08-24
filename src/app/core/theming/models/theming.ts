import { TonalPalette } from '@/app/core/theming/palette';

export interface Colors {
  primary: string;
  error: string;
}
export type ThemeConfig = Colors;

export interface Theme {
  primary: TonalPalette;
  error: TonalPalette;
}
