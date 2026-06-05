import { AnimationTokens } from './types';

export const animations: AnimationTokens = {
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.26, 1.55)',
  },
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    verySlow: '1000ms',
  },
};
