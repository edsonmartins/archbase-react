# @archbase/effects

Efeitos visuais para Archbase React: fundos em canvas e WebGL, indicadores e a
base para construir os seus.

**Zero dependências de runtime.** Não importa Mantine nem biblioteca de
animação — são canvas e shader. O tema é lido pelas custom properties que o
Mantine já publica (`--mantine-color-*`), então a integração acontece sem a
dependência. Em hospedeiro sem Mantine, o fallback assume.

## Instalação

```bash
pnpm add @archbase/effects
```

React é `peerDependency`.

## Uso

```tsx
import { ArchbaseNebulaFlow, ArchbaseMagicLoader } from '@archbase/effects';

<ArchbaseNebulaFlow style={{ height: 320 }}>
  <h1>Bem-vindo</h1>
</ArchbaseNebulaFlow>;

<ArchbaseMagicLoader label="Carregando relatório" />;
```

## Componentes

| | |
|---|---|
| `ArchbaseNebulaFlow` | Nébula em shader WebGL, reage ao ponteiro |
| `ArchbaseCosmicDust` | Partículas em deriva que orbitam o ponteiro |
| `ArchbaseDotGridBackground` | Grade de pontos arrastável com inércia |
| `ArchbaseMagicLoader` | Indicador de carregamento com rastro de partículas |

## O que este pacote acrescenta

Os efeitos foram adaptados de [Lightswind UI](https://github.com/codewithMUHILAN)
(MIT). O valor não está em ter copiado o desenho — está no ciclo de vida em
volta dele, que `useArchbaseCanvasAnimation` padroniza:

- **O laço para de verdade.** Fora da viewport ou pausado, nenhum quadro é
  pedido. As versões originais mantinham `requestAnimationFrame` eterno, o que
  acorda a GPU sem desenhar nada — num painel administrativo, o dia inteiro.
- **`prefers-reduced-motion` é respeitado.** Fundo animado permanente é barreira
  de acessibilidade. Onde a animação carrega informação, como no loader, o
  componente troca por sinal estático em vez de sumir.
- **Redimensionamento pelo container**, não pela janela.
- **Densidade de pixels** aplicada de forma consistente, com teto para não
  triplicar o custo em telas 3x.
- **Recursos de GPU liberados** ao desmontar. Sem isso cada montagem vaza um
  contexto WebGL, até o navegador começar a descartar os antigos e outros canvas
  apagarem sem explicação aparente.

## Construindo o seu efeito

```tsx
import { useArchbaseCanvasAnimation } from '@archbase/effects';

const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
  setup: (canvas, { dpr }) => {
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  },
  frame: (canvas, { time, size }) => {
    // desenhe aqui
  },
});
```

Use `mode: 'onDemand'` quando não houver animação contínua — o laço só existe
enquanto você chamar `requestFrame()`.

## Créditos

Efeitos adaptados de **Lightswind UI**, de Muhilan (codewithMUHILAN), sob
licença MIT.
