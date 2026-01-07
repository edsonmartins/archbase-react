// Polyfill for Promise.withResolvers (Node.js < 20.10.0)
if (typeof Promise.withResolvers === 'undefined') {
  (Promise as any).withResolvers = function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantinex/mantine-logo/styles.css';
import '@mantinex/mantine-header/styles.css';
import '@mantinex/demo/styles.css';

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CodeHighlightAdapterProvider, createShikiAdapter } from '@mantine/code-highlight';
import { MantineProvider } from '@mantine/core';
import { theme } from '../theme';

async function loadShiki() {
  const { createHighlighter } = await import('shiki');
  const shiki = await createHighlighter({
    langs: ['tsx', 'typescript', 'javascript', 'scss', 'css', 'html', 'bash', 'json'],
    themes: [],
  });

  return shiki;
}

const shikiAdapter = createShikiAdapter(loadShiki);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Archbase React - Documentação</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta name="description" content="Biblioteca completa de componentes React para aplicações empresariais" />
      </Head>
      <CodeHighlightAdapterProvider adapter={shikiAdapter}>
        <Component {...pageProps} />
      </CodeHighlightAdapterProvider>
    </MantineProvider>
  );
}
