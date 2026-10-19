import fs from 'fs';
import path from 'path';
import { decomposeColor, getContrastRatio } from '@mui/material/styles';

import { darkPalette } from 'theme/palette';
import { COLOR_MODE_STORAGE_KEY } from 'theme/colorMode';

const AA_NORMAL_TEXT = 4.5;

// Composites a translucent color over an opaque hex background, as the browser would paint it.
const over = (translucent, backgroundHex) => {
  const {
    values: [r, g, b, a = 1]
  } = decomposeColor(translucent);
  const { values: base } = decomposeColor(backgroundHex);
  const mixed = [r, g, b].map((channel, i) => Math.round(channel * a + base[i] * (1 - a)));
  return `rgb(${mixed.join(', ')})`;
};

describe('dark palette contrast', () => {
  const { background, text, status } = darkPalette;

  it.each(['primary', 'muted', 'subtle', 'faint', 'body', 'soft', 'link', 'linkAlt', 'accent', 'fieldLabel'])(
    'keeps text.%s readable on cards and the page background',
    (token) => {
      expect(getContrastRatio(text[token], background.paper)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      expect(getContrastRatio(text[token], background.default)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    }
  );

  it.each(Object.keys(status).filter((name) => name !== 'failed'))(
    'keeps status.%s chip text readable on its tinted background',
    (name) => {
      const textColor = status[name].text || status[name].main;
      expect(getContrastRatio(textColor, over(status[name].bg, background.paper))).toBeGreaterThanOrEqual(
        AA_NORMAL_TEXT
      );
    }
  );

  it('keeps the failed scan icon readable on its grey background', () => {
    expect(getContrastRatio(status.failed.main, status.failed.bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe('theme-init.js', () => {
  const script = fs.readFileSync(path.resolve(__dirname, '../../../public/theme-init.js'), 'utf8');

  it('reads the same storage key as the theme provider', () => {
    expect(script).toContain(`'${COLOR_MODE_STORAGE_KEY}'`);
  });

  it('sets the attribute the theme selector listens to', () => {
    expect(script).toContain("'data-mui-color-scheme'");
  });
});
