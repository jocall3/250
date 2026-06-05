import { DesignTokens } from './types';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { breakpoints } from './breakpoints';
import { borders } from './borders';
import { animations } from './animations';
import { zIndex } from './z-index';

export const tokens: DesignTokens = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  borders,
  animations,
  zIndex,
};

export * from './types';
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './breakpoints';
export * from './borders';
export * from './animations';
export * from './z-index';
