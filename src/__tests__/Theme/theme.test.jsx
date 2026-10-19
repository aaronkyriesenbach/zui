import React from 'react';
import { render, screen } from '@testing-library/react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import fs from 'fs';
import path from 'path';
import theme from 'theme';
import { darkPalette, lightPalette } from 'theme/palette';
import MockThemeProvider from '__mocks__/MockThemeProvider';

describe('theme', () => {
  it('keeps the zot brand palette', () => {
    expect(theme.palette.primary.main).toBe('#14191F');
    expect(theme.palette.secondary.main).toBe('#0F2139');
    expect(theme.palette.secondary.dark).toBe('#52637A');
    expect(theme.palette.background.default).toBe('#F6F7F9');
  });

  it('exposes palette values as css variables', () => {
    expect(theme.vars.palette.background.default).toContain('var(--mui-palette-background-default');
    expect(theme.vars.palette.secondary.main).toContain('var(--mui-palette-secondary-main');
  });

  it('resolves sx palette shorthands to css variables', () => {
    render(
      <MockThemeProvider>
        <Box data-testid="box" sx={{ bgcolor: 'background.default' }} />
      </MockThemeProvider>
    );
    const css = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText)).join('');
    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(css).toMatch(/background-color:\s*var\(--mui-palette-background-default/);
  });

  it('keeps the h4 override inheriting the surrounding typography once the provider resolves the theme', () => {
    let resolved;
    const Probe = () => {
      resolved = useTheme().typography.h4;
      return null;
    };
    render(
      <MockThemeProvider>
        <Probe />
      </MockThemeProvider>
    );

    expect(resolved).toMatchObject({
      fontFamily: 'inherit',
      fontWeight: 'bold',
      lineHeight: 'inherit',
      letterSpacing: 'inherit'
    });
  });

  it('keeps the h4 override responsive', () => {
    expect(theme.typography.h4.fontSize).toBe('2.5rem');
    expect(theme.typography.h4[theme.breakpoints.down('sm')]).toEqual({ fontSize: '1.5rem' });
  });

  it('defines a dark color scheme alongside the light one', () => {
    expect(Object.keys(theme.colorSchemes)).toEqual(expect.arrayContaining(['light', 'dark']));
    expect(theme.colorSchemes.dark.palette.background.default).toBe(darkPalette.background.default);
  });

  it('gives the dark palette a value for every light palette token', () => {
    const tokenPaths = (palette, prefix = '') =>
      Object.entries(palette).flatMap(([key, value]) =>
        typeof value === 'object' ? tokenPaths(value, prefix + key + '.') : [prefix + key]
      );
    const darkPaths = new Set(tokenPaths(darkPalette));

    expect(tokenPaths(lightPalette).filter((tokenPath) => !darkPaths.has(tokenPath))).toEqual([]);
  });

  it('keeps the pre-paint dark background in index.css in sync with the dark palette', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../index.css'), 'utf8');

    expect(css.toLowerCase()).toContain(darkPalette.background.default.toLowerCase());
  });
});
