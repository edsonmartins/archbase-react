import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface PackageJson {
  type?: string;
  exports?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

function read(packageName: string): PackageJson {
  const path = resolve(__dirname, '..', '..', packageName, 'package.json');
  return JSON.parse(readFileSync(path, 'utf-8')) as PackageJson;
}

const mantine = read('analytics-mantine');
const core = read('analytics-core');

/**
 * Requisito de empacotamento: React e Mantine como `peerDependencies`, para que
 * a instalacao em aplicacao que ja os utiliza nao traga uma segunda copia.
 */
describe('empacotamento', () => {
  it('declara React como peer, nunca como dependencia direta', () => {
    for (const [nome, pacote] of [
      ['analytics-mantine', mantine],
      ['analytics-core', core],
    ] as const) {
      expect(Object.keys(pacote.dependencies ?? {}), nome).not.toContain('react');
      expect(Object.keys(pacote.dependencies ?? {}), nome).not.toContain('react-dom');
      expect(pacote.peerDependencies?.react, nome).toBeDefined();
    }
  });

  it('declara Mantine como peer no Anel 2', () => {
    expect(mantine.peerDependencies?.['@mantine/core']).toBeDefined();
    expect(Object.keys(mantine.dependencies ?? {})).not.toContain('@mantine/core');
  });

  it('mantem a biblioteca de grafico como peer opcional', () => {
    // Quem usa apenas tabela nao deve ser obrigado a instalar o renderizador.
    expect(mantine.peerDependenciesMeta?.['@mantine/charts']?.optional).toBe(true);
    expect(Object.keys(mantine.dependencies ?? {})).not.toContain('@mantine/charts');
  });

  it('depende do nucleo pelo workspace', () => {
    expect(mantine.dependencies?.['@archbase/analytics-core']).toBe('workspace:*');
  });

  it('distribui ESM', () => {
    expect(mantine.type).toBe('module');
    expect(core.type).toBe('module');
    const raiz = mantine.exports?.['.'] as Record<string, string> | undefined;
    expect(raiz?.import).toBeDefined();
    expect(raiz?.require).toBeUndefined();
  });

  it('expoe o renderizador de grafico em subpath proprio', () => {
    expect(mantine.exports?.['./charts']).toBeDefined();
  });

  it('mantem react e mantine externos, nunca inlinados', () => {
    const bundle = readFileSync(join(resolve(__dirname, '..'), 'dist', 'index.js'), 'utf-8');

    // Presentes como import — prova de que sao externos. Inlinados, o pacote
    // carregaria uma segunda copia junto de quem ja os usa.
    expect(bundle).toMatch(/from\s*["']@mantine\/core["']/);
    expect(bundle).toMatch(/from\s*["']react["']|from\s*["']react\/jsx-runtime["']/);

    // Marcadores de implementacao do React: se aparecerem, houve inlining.
    expect(bundle).not.toContain('react.production.min.js');
    expect(bundle).not.toContain('__SECRET_INTERNALS');
  });

  it('mantem a biblioteca de grafico fora do bundle principal', () => {
    const principal = readFileSync(join(resolve(__dirname, '..'), 'dist', 'index.js'), 'utf-8');
    const charts = readFileSync(join(resolve(__dirname, '..'), 'dist', 'charts.js'), 'utf-8');

    expect(principal).not.toContain('@mantine/charts');
    expect(charts).toMatch(/from\s*["']@mantine\/charts["']/);
  });
});
