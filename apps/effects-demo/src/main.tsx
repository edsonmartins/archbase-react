import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { App } from './App';

const tema = createTheme({ primaryColor: 'violet' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={tema} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
