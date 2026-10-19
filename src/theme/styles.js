import { get } from 'lodash';

export const cardShadow = (theme) => `0rem 0.3125rem 0.625rem ${theme.vars.palette.shadow.card}`;

export const cardShadowHover = (theme) => `0rem 1.1875rem 1.4375rem ${theme.vars.palette.shadow.cardHover}`;

// sx palette shorthands cannot carry !important, which MUI's nested icon selectors require.
export const paletteColor = (path, important = false) => {
  return (theme) => `${get(theme.vars.palette, path)}${important ? ' !important' : ''}`;
};
