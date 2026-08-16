import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Desligada em TypeScript por recomendacao do proprio typescript-eslint.
      // O compilador ja acusa identificador indefinido, e a regra nao entende
      // referencia em posicao de tipo (`useRef<HTMLLIElement>`), nem globais de
      // plataforma sem uma lista manual que envelhece.
      //
      // Mantida ligada, ela produzia 1512 erros neste repositorio — todos
      // falsos. Volume assim nao e rigor: e ruido que faz a equipe parar de ler
      // a saida do lint, e junto com ele passam os erros verdadeiros.
      'no-undef': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Globais de plataforma para os pacotes de analytics.
  //
  // A config da raiz nao declara `languageOptions.globals`, entao `no-undef` da
  // configuracao recomendada acusa qualquer global de browser ou de Node. O
  // efeito e pre-existente e atinge outros pacotes (`document` e `btoa` em
  // @archbase/core, por exemplo); a correcao esta escopada aqui para nao alterar
  // o resultado de lint de pacotes fora deste trabalho.
  {
    files: ['packages/analytics-core/**/*.{ts,tsx}', 'packages/analytics-mantine/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        DOMException: 'readonly',
        HTMLElement: 'readonly',
        Headers: 'readonly',
        ResizeObserver: 'readonly',
        Request: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
        ResponseInit: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
  },
  // Anel 1 de @archbase/analytics: nucleo headless.
  // ADR de arquitetura, secao 2.2 — o nucleo nao pode alcancar biblioteca de UI,
  // sob pena de perder a separacao que permite sobreviver a majors do Mantine.
  {
    files: ['packages/analytics-core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mantine', '@mantine/*'],
              message:
                'O nucleo headless (@archbase/analytics-core) nao pode importar de @mantine/*. Componentes pertencem a @archbase/analytics-mantine. Ver ADR de arquitetura, secao 2.2.',
            },
            {
              group: ['@tabler/icons-react'],
              message:
                'Icones sao camada de apresentacao e pertencem a @archbase/analytics-mantine.',
            },
            {
              group: ['@archbase/analytics-mantine', '@archbase/analytics-mantine/*'],
              message:
                'Dependencia invertida: o Anel 1 nunca depende do Anel 2. Ver ADR de arquitetura, secao 2.2.',
            },
          ],
        },
      ],
    },
  },
  // Gate de varredura 7.6, parte versionada e neutra.
  // Proibe literal com forma de membro de camada semantica (`cubo.membro_x`)
  // fora de test/fixtures/. A lista nominal de produtos e clientes NAO vive
  // aqui: ela e injetada pelo pipeline, justamente para nao trazer o nome do
  // cliente para o repositorio que existe para nao o conter.
  //
  // Limite conhecido: so alcanca literais com underscore em um dos lados, para
  // nao confundir com nomes de arquivo (`index.js`). Membros inteiramente sem
  // underscore escapam da regra versionada e ficam a cargo da parte nominal.
  {
    files: ['packages/analytics-core/src/**/*.{ts,tsx}', 'packages/analytics-mantine/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^[a-z][a-z0-9_]*\\.[a-z][a-z0-9_]*$/][value=/_/]',
          message:
            'Literal com forma de membro de camada semantica no codigo da biblioteca. A biblioteca nao conhece dominio: nomes de cubo, view e membro so podem aparecer em test/fixtures/.',
        },
      ],
    },
  },
  prettier,
];