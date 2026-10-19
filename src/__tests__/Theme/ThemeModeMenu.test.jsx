import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeModeMenu from 'components/Header/ThemeModeMenu';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import { COLOR_MODE_STORAGE_KEY } from 'theme/colorMode';

const renderMenu = () =>
  render(
    <MockThemeProvider>
      <ThemeModeMenu />
    </MockThemeProvider>
  );

describe('ThemeModeMenu', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mui-color-scheme');
  });

  it('offers light, dark and system modes with system selected by default', async () => {
    renderMenu();
    await userEvent.click(screen.getByTestId('theme-mode-button'));

    expect(screen.getByTestId('theme-mode-light')).toBeInTheDocument();
    expect(screen.getByTestId('theme-mode-dark')).toBeInTheDocument();
    expect(screen.getByTestId('theme-mode-system')).toHaveClass('Mui-selected');
  });

  it('switches to dark mode and remembers the choice', async () => {
    renderMenu();
    await userEvent.click(screen.getByTestId('theme-mode-button'));
    await userEvent.click(screen.getByTestId('theme-mode-dark'));

    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-mui-color-scheme', 'dark');
  });

  it('switches back to light mode', async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
    renderMenu();
    await userEvent.click(screen.getByTestId('theme-mode-button'));
    await userEvent.click(screen.getByTestId('theme-mode-light'));

    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light');
    expect(document.documentElement).toHaveAttribute('data-mui-color-scheme', 'light');
  });
});
