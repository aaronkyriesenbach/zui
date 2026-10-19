import React, { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

const MODES = [
  { value: 'light', label: 'Light', Icon: LightModeIcon },
  { value: 'dark', label: 'Dark', Icon: DarkModeIcon },
  { value: 'system', label: 'System', Icon: SettingsBrightnessIcon }
];

const SYSTEM_MODE = MODES.find((m) => m.value === 'system');

function ThemeModeMenu({ sx }) {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // The stored mode is only known after the provider has resolved it.
  if (!mode) return null;

  const { Icon: CurrentIcon } = MODES.find((m) => m.value === mode) || SYSTEM_MODE;

  const handleSelect = (value) => {
    setMode(value);
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Color theme">
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label="Color theme"
          aria-controls={open ? 'theme-mode-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          data-testid="theme-mode-button"
          sx={sx}
        >
          <CurrentIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-mode-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ 'aria-label': 'Color theme' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {MODES.map(({ value, label, Icon }) => (
          <MenuItem
            key={value}
            role="menuitemradio"
            aria-checked={mode === value}
            selected={mode === value}
            onClick={() => handleSelect(value)}
            data-testid={`theme-mode-${value}`}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default ThemeModeMenu;
