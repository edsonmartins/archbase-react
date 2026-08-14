import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = resolve(__dirname, '..');
const sourceRoot = join(packageRoot, 'src');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry) ? [full] : [];
  });
}

const files = sourceFiles(sourceRoot);
const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

/**
 * Validacao 3 do ADR de arquitetura: o Anel 1 compila sem `@mantine/*` no grafo
 * de dependencias. A regra de lint impede a importacao; este teste impede que a
 * dependencia entre por outra porta, como um `dependencies` acrescentado sem
 * import correspondente.
 */
describe('isolamento do nucleo headless', () => {
  it('encontra os fontes do pacote', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('nao declara nenhuma biblioteca de UI como dependencia', () => {
    const declared = Object.keys({
      ...packageJson.dependencies,
      ...packageJson.peerDependencies,
    });
    const ui = declared.filter(
      (name) => name.startsWith('@mantine') || name.startsWith('@tabler') || name === 'echarts',
    );
    expect(ui).toEqual([]);
  });

  it('nao declara dependencias de runtime: o nucleo traz seu proprio cliente', () => {
    expect(Object.keys(packageJson.dependencies ?? {})).toEqual([]);
  });

  it('nao importa de nenhuma biblioteca de componentes', () => {
    const offenders = files.filter((file) => {
      const content = readFileSync(file, 'utf-8');
      return /from\s+['"]@mantine\//.test(content) || /from\s+['"]@tabler\//.test(content);
    });
    expect(offenders).toEqual([]);
  });

  it('nao importa o Anel 2', () => {
    const offenders = files.filter((file) =>
      /from\s+['"]@archbase\/analytics-mantine/.test(readFileSync(file, 'utf-8')),
    );
    expect(offenders).toEqual([]);
  });
});

/**
 * Gate 7.6, parte versionada e neutra. A parte nominal — nomes de produto e de
 * cliente — e injetada pelo pipeline e nao vive no repositorio.
 */
describe('ausencia de dominio no codigo da biblioteca', () => {
  const MEMBRO = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;

  it('nao carrega literal com forma de membro de camada semantica', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      for (const match of content.matchAll(/['"]([^'"\n]+)['"]/g)) {
        const literal = match[1];
        if (literal && literal.includes('_') && MEMBRO.test(literal)) {
          offenders.push(`${file}: ${literal}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('o modelo ficticio das fixtures nao vaza para os fontes', () => {
    const offenders = files.filter((file) => /\bpedidos\./.test(readFileSync(file, 'utf-8')));
    expect(offenders).toEqual([]);
  });
});
