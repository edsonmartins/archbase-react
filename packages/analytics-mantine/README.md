# @archbase/analytics-mantine

Componentes Mantine e composições de `@archbase/analytics`. Anéis 2 e 3.

Consome o estado de `@archbase/analytics-core` e não guarda estado de consulta
próprio — a separação é o que permite ao núcleo sobreviver a majors do Mantine e
a produtos futuros reutilizarem o estado com layout próprio.

## Superfície

**Anel 2 — componentes.** `MemberPalette`, `QueryCanvas`, `FilterBuilder`,
`TimeDimensionControl`, `ResultTable`, `ResultChart`, `SavedQueryBar` e os
estados de vazio, carregamento, truncamento, erro e degradação.

**Anel 3 — composições.** `AnalyticsExplorer` e `AnalyticsWidget`.

```tsx
import { AnalyticsProvider } from '@archbase/analytics-core';
import { AnalyticsExplorer } from '@archbase/analytics-mantine';
import { createMantineChartRenderer } from '@archbase/analytics-mantine/charts';

<AnalyticsProvider baseUrl="/api/analytics" ports={{ ...portas, chartRenderer: createMantineChartRenderer() }}>
  <AnalyticsExplorer
    ownerId={usuario.id}
    deepLink={{ search: location.search, onChange: (s) => navigate({ search: s }) }}
  />
</AnalyticsProvider>;
```

O roteamento é do hospedeiro: sem a prop `deepLink`, a biblioteca não toca na
URL — apenas lê e escreve os parâmetros configurados quando solicitada.

`AnalyticsWidget` é superfície de leitura: recebe `savedQueryId` ou `query`,
não oferece composição e registra origem `widget` na telemetria.

## Empacotamento

React e Mantine são `peerDependencies`. `@mantine/charts` é peer **opcional** e
o renderizador de referência vive em subpath próprio
(`@archbase/analytics-mantine/charts`), para ficar fora do grafo de dependências
de quem usa apenas tabela.
