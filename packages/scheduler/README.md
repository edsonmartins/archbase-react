# @archbase/scheduler

Linha do tempo por recurso: uma faixa por veículo, sala ou pessoa, e os eventos posicionados no
tempo. É o componente por trás de telas como a de detalhes de jornada.

## De onde veio

É um fork de [`mantine-resource-timeline`](https://www.npmjs.com/package/mantine-resource-timeline)
8.1.2, de Jan Vollmer, sob licença MIT — preservada em `LICENSE.upstream`.

**Por que forkar.** O original declara `@mantine/core ^8.2.8` como peer e não tem versão para o
Mantine 9; a última publicada continua no 8. Os pacotes do Archbase exigem Mantine 9.5.1 exato, então
qualquer projeto que use os dois fica com um peer não atendido — e a incompatibilidade de peer só se
manifesta em runtime, quando manifesta.

Na prática o componente usa só doze APIs do Mantine, todas básicas e presentes no 9: `Box`, `Button`,
`Center`, `Flex`, `Paper`, `Tooltip`, `useMantineTheme`, `useProps` e quatro tipos. O peer conservador
era o único impedimento real.

Forkar, em vez de esperar o upstream, também abre espaço para evoluir o componente conforme o que os
projetos precisam.

## API

Compatível com a do original — trocar o import basta:

```diff
-import { Scheduler, useSchedulerController } from 'mantine-resource-timeline'
+import { Scheduler, useSchedulerController } from '@archbase/scheduler'
```

Os nomes também estão disponíveis com o prefixo da casa (`ArchbaseScheduler`,
`useArchbaseSchedulerController`), para código novo.

Não esqueça o CSS:

```ts
import '@archbase/scheduler/dist/index.css'
```

## O que mudou em relação ao upstream

- peers passam a exigir Mantine 9.5.1, alinhado ao resto do Archbase;
- `@date-fns/tz`, `date-fns`, `@tanstack/react-virtual`, `@use-gesture/react` e `valtio` deixam de
  ser peers e viram dependências: quem instala o pacote não precisa declarar nenhuma delas;
- aliases com o prefixo `Archbase`.
