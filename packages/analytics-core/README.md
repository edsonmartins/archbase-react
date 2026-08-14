# @archbase/analytics-core

Núcleo headless de exploração sobre camada semântica. Anéis 0 e 1 da
arquitetura de `@archbase/analytics`.

Não importa nenhuma biblioteca de componentes e não tem dependências de runtime:
traz o próprio cliente de transporte. Componentes vivem em
`@archbase/analytics-mantine`.

## Instalação

```bash
pnpm add @archbase/analytics-core
```

React é `peerDependency`.

## Uso

```tsx
import {
  AnalyticsProvider,
  useExploration,
  createPtBrFormatter,
} from '@archbase/analytics-core';

<AnalyticsProvider
  baseUrl="/api/analytics"
  ports={{
    tokenProvider: () => auth.getToken(),
    savedQueryStore: minhaPersistencia,
    formatter: createPtBrFormatter(),
  }}
>
  <MinhaTela />
</AnalyticsProvider>;
```

## Portas

| Porta | Obrigatória | Papel |
|---|---|---|
| `tokenProvider` | montagem | Token do hospedeiro, renovável |
| `savedQueryStore` | montagem | Persistência de consulta salva |
| `formatter` | montagem | Formatação e ordenação sensível a locale |
| `chartRenderer` | no uso | Renderização de gráfico |
| `labeler` | opcional | Resolução de rótulo; default fornecido |
| `telemetry` | opcional | Eventos de consulta |

**Não existe porta de permissões.** Membros fora do escopo do usuário não chegam
na introspecção; a biblioteca renderiza o que recebeu e nunca oculta membro por
lógica própria. Membro exibido indevidamente é defeito de política no data model
do produto consumidor.

## Invariantes

- Valores monetários trafegam em unidade mínima inteira. Nenhuma divisão ocorre
  no núcleo — a conversão acontece só na porta `formatter`.
- Consulta salva é versionada, com `migrateSavedQuery` exportada.
- Consulta salva com membro indisponível degrada com aviso quantitativo; nunca
  falha e nunca identifica o que foi removido.
- Comparação temporal é propriedade da consulta, emitida como múltiplos
  intervalos. A biblioteca não infere vínculo entre membros por convenção de
  nome.

## Pressupostos sobre o hospedeiro

A biblioteca assume, e não verifica: controle de acesso aplicado na camada
semântica; metadados publicados conforme o contrato; valores monetários em
unidade mínima; acesso intermediado pelo backend do produto.
