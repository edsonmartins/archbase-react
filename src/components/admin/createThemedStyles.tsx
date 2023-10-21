import { MantineTheme } from '@mantine/core';

export const createThemedStyles = (_theme: MantineTheme): any => {
  return {
    light: {
      sidebar: {
        backgroundColor: '#ffffff',
        color: '#607489',
      },
      menu: {
        menuContent: '#fbfcfd',
        icon: '#0098e5',
        hover: {
          backgroundColor: '#c5e4ff',
          color: '#44596e',
        },
        disabled: {
          color: '#9fb6cf',
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: '#0b2948',
        color: '#8ba1b7',
      },
      menu: {
        menuContent: '#082440',
        icon: '#59d0ff',
        hover: {
          backgroundColor: '#00458b',
          color: '#b6c8d9',
        },
        disabled: {
          color: '#3e5e7e',
        },
      },
    },
  };
};
