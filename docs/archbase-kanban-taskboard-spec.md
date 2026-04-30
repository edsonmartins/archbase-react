# ArchbaseKanban + ArchbaseTaskBoard — Especificação Arquitetural

## Visão geral da estratégia

```
react-kanban-kit (source copiado)
         ↓
   ArchbaseKanban          ← kanban de propósito geral, Mantine-native
         ↓
  ArchbaseTaskBoard        ← kanban semântico com cards de tarefa/ticket prontos
```

O `react-kanban-kit` é copiado como **source interno** do `@archbase/advanced`.  
Nenhuma dependência de npm adicionada — apenas `@atlaskit/pragmatic-drag-and-drop`
(~4,7 kB) que já é dep transitiva. O source adaptado recebe tokens Mantine e
integração com DataSource. O `ArchbaseTaskBoard` consome o `ArchbaseKanban` como
primitivo e adiciona a camada semântica de tarefa.

---

## Parte 1 — ArchbaseKanban

### O que muda em relação ao react-kanban-kit original

| Aspecto | react-kanban-kit original | ArchbaseKanban |
|---------|--------------------------|----------------|
| Estilos | CSS próprio / className strings | Tokens Mantine (`useMantineTheme`) |
| Dark mode | Manual | Automático via Mantine ColorScheme |
| DataSource | Não tem | `ArchbaseDataSource` opcional |
| Swimlanes | Não tem | Suporte a agrupamento horizontal |
| Tipos de coluna | Não tem | `columnType` com cores e comportamento |
| Contagem de cards | `totalChildrenCount` raw | Badge formatado por coluna |
| Skeleton | Básico | `ArchbaseSkeleton` integrado |
| i18n | Não tem | `ArchbaseI18n` |

### Estrutura de dados

O `react-kanban-kit` usa uma estrutura **flat com referências por ID** — eficiente
e flexível. Mantemos o mesmo modelo, adicionando campos opcionais do Archbase:

```typescript
// Modelo de dados — compatível com react-kanban-kit + extensões Archbase
interface ArchbaseBoardData {
  root: ArchbaseBoardItem;           // nó raiz — contém IDs das colunas
  [itemId: string]: ArchbaseBoardItem;
}

interface ArchbaseBoardItem {
  // campos originais do react-kanban-kit
  id: string;
  title: string;
  parentId: string | null;
  children: string[];                // IDs dos filhos (cards ou colunas)
  content?: any;                     // dados do domínio — qualquer objeto
  type?: string;                     // chave do configMap para renderização
  totalChildrenCount: number;
  isDraggable?: boolean;

  // extensões Archbase
  columnType?: ArchbaseColumnType;   // só para itens que são colunas
  swimlaneId?: string;               // para agrupamento horizontal
  metadata?: Record<string, any>;   // dados extras sem tipagem forte
}

type ArchbaseColumnType =
  | 'default'
  | 'done'       // coluna final — card fica verde
  | 'blocked'    // coluna bloqueada — card fica vermelho
  | 'wip'        // work-in-progress — com WIP limit
  | 'backlog';   // coluna de entrada

interface ArchbaseCardMove {
  // igual ao react-kanban-kit
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  taskAbove: string | null;
  taskBelow: string | null;
  position: number;
}

interface ArchbaseColumnMove {
  columnId: string;
  fromIndex: number;
  toIndex: number;
}
```

### configMap — tipagem aprimorada

O `configMap` do react-kanban-kit é mantido como mecanismo principal de
customização de cards. O Archbase adiciona `columnRenderer` paralelo:

```typescript
type ArchbaseConfigMap = {
  [type: string]: {
    // renderização do card (igual ao original)
    render: (props: ArchbaseCardRenderProps) => React.ReactNode;
    isDraggable?: boolean;

    // extensões Archbase
    renderDragPreview?: (props: ArchbaseCardRenderProps) => React.ReactNode;
    canDropInto?: (column: ArchbaseBoardItem) => boolean; // regra de negócio
    maxPerColumn?: number;                                 // WIP limit por tipo
  };
};

type ArchbaseCardRenderProps = {
  // campos originais
  data: ArchbaseBoardItem;
  column: ArchbaseBoardItem;
  index: number;
  isDraggable: boolean;

  // extensões Archbase
  datasource?: ArchbaseDataSource<any>;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
};
```

### Props do componente

```typescript
interface ArchbaseKanbanProps<T = any> {
  // === Dados ===
  dataSource?: ArchbaseDataSource<T>;   // optional — pode usar boardData direto
  boardData?: ArchbaseBoardData;         // alternativa ao datasource
  configMap: ArchbaseConfigMap;

  // === Comportamento ===
  viewOnly?: boolean;                    // desabilita todo DnD
  allowColumnDrag?: boolean;             // padrão: true
  allowCardDrag?: boolean;               // padrão: true
  wipLimitEnabled?: boolean;             // ativa WIP limits por coluna

  // === Swimlanes (novo) ===
  swimlanes?: ArchbaseSwimlane[];        // define grupos horizontais
  swimlaneField?: string;                // campo do content que define a swimlane

  // === Callbacks ===
  onCardMove?: (move: ArchbaseCardMove) => void | Promise<void>;
  onColumnMove?: (move: ArchbaseColumnMove) => void;
  onCardClick?: (card: ArchbaseBoardItem, column: ArchbaseBoardItem) => void;
  onColumnClick?: (column: ArchbaseBoardItem) => void;
  onCardAdd?: (columnId: string) => void;
  onCardDndStateChange?: (info: DndStateInfo) => void;
  onColumnDndStateChange?: (info: DndStateInfo) => void;

  // === Renderização customizada ===
  renderColumnHeader?: (column: ArchbaseBoardItem) => React.ReactNode;
  renderColumnFooter?: (column: ArchbaseBoardItem) => React.ReactNode;
  renderCardDragPreview?: (card: ArchbaseBoardItem) => React.ReactNode;
  renderCardDragIndicator?: (card: ArchbaseBoardItem, info: any) => React.ReactNode;
  renderAddCardButton?: (columnId: string) => React.ReactNode;
  renderEmptyColumn?: (column: ArchbaseBoardItem) => React.ReactNode;

  // === Visual ===
  columnWidth?: number | string;          // padrão: 280px
  maxColumnHeight?: number | string;      // com scroll interno
  showCardCount?: boolean;                // badge de contagem por coluna
  showWipLimit?: boolean;                 // exibe "3/5" quando WIP ativo
  loading?: boolean;                      // exibe skeleton
  skeletonColumns?: number;              // quantas colunas no skeleton (padrão: 4)
  skeletonCardsPerColumn?: number;       // cards por coluna no skeleton (padrão: 3)

  // === Estilo ===
  rootStyle?: React.CSSProperties;
  rootClassName?: string;
  columnWrapperStyle?: (column: ArchbaseBoardItem) => React.CSSProperties;
  cardWrapperStyle?: (card: ArchbaseBoardItem, column: ArchbaseBoardItem) => React.CSSProperties;
}

interface ArchbaseSwimlane {
  id: string;
  label: string;
  color?: string;                        // cor do label da swimlane
  collapsible?: boolean;
}
```

### Integração com DataSource

Quando `dataSource` é fornecido, o `ArchbaseKanban` assume a responsabilidade de
transformar os dados do DataSource no formato `BoardData`. O mapeamento é feito via
prop `boardDataMapper`:

```typescript
// Se o desenvolvedor fornecer datasource, precisa também do mapper
interface ArchbaseKanbanProps<T> {
  dataSource?: ArchbaseDataSource<T>;
  boardDataMapper?: (records: T[]) => ArchbaseBoardData; // transforma registros em board
  columnIdField?: string;    // campo que define a coluna (padrão: 'status')
  // ... resto das props
}
```

**Fluxo quando datasource é usado:**
1. `DataSource` notifica mudanças → `ArchbaseKanban` re-executa `boardDataMapper`
2. `onCardMove` → atualiza o DataSource → DataSource notifica → re-render

### Swimlanes

Swimlanes adicionam uma dimensão horizontal ao board. Cada swimlane é uma linha
que contém todas as colunas do kanban. Útil para separar cards por responsável,
prioridade ou projeto:

```
                [A Fazer]   [Em Andamento]   [Concluído]
[Dev]             card1          card3
[QA]              card2                         card4
[Prod]                           card5
```

A implementação encapsula o board em um `ScrollArea` vertical com rows de swimlane,
cada row renderizando o board filtrado para aquela swimlane.

---

## Parte 2 — ArchbaseTaskBoard

O `ArchbaseTaskBoard` é um **produto final** construído sobre `ArchbaseKanban`.
Ele define a semântica de "tarefa" e entrega tudo pronto: cards de tarefa com layout
padronizado, filtros, toolbar, e integração com DataSource de tarefas.

### Modelo de domínio

```typescript
interface ArchbaseTask {
  id: string;
  title: string;
  description?: string;
  status: string;                        // coluna do kanban
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignee?: ArchbaseTaskAssignee;
  dueDate?: Date;
  tags?: string[];
  attachmentCount?: number;
  commentCount?: number;
  estimatedHours?: number;
  completedAt?: Date;
  createdAt?: Date;
  swimlaneId?: string;                   // para agrupamento

  // campos abertos para domínio da app
  [key: string]: any;
}

interface ArchbaseTaskAssignee {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;                     // fallback quando sem avatar
}
```

### Card padrão — ArchbaseTaskCard

O `ArchbaseTaskCard` é o card visual padrão do TaskBoard. Completamente customizável
via slots, mas funcional out-of-the-box:

```
┌──────────────────────────────────┐
│ 🔴 [CRÍTICO]          ⋮ menu   │  ← priority badge + context menu
│                                  │
│ Título da tarefa truncado em 2   │  ← title (2 linhas max)
│ linhas se necessário             │
│                                  │
│ Lorem ipsum descrição curta...   │  ← description (1 linha, opcional)
│                                  │
│ ──────────────────────────────── │
│ 👤 João Silva    📅 15/jan  🏷️2 │  ← footer: assignee + due date + tags
│                          💬3 📎1 │  ← comment + attachment count
└──────────────────────────────────┘
```

**Regras visuais automáticas:**
- `dueDate` vencida → data em vermelho
- `dueDate` vence hoje → data em laranja
- `priority === 'critical'` → borda esquerda vermelha
- `status === done` → card com opacidade reduzida
- `assignee` sem avatar → círculo com `initials`

### Props do ArchbaseTaskBoard

```typescript
interface ArchbaseTaskBoardProps {
  // === Dados ===
  dataSource: ArchbaseDataSource<ArchbaseTask>;
  statusField?: string;          // campo que mapeia para coluna (padrão: 'status')
  columns: ArchbaseTaskColumn[]; // definição das colunas do board

  // === Filtros e toolbar ===
  showToolbar?: boolean;         // padrão: true
  showFilters?: boolean;         // padrão: true
  filterFields?: ArchbaseTaskFilterField[]; // campos disponíveis nos filtros

  // === Swimlanes ===
  swimlaneField?: string;        // campo do task que define a swimlane
  swimlanes?: ArchbaseTaskSwimlane[];

  // === Comportamento ===
  onTaskMove?: (task: ArchbaseTask, fromStatus: string, toStatus: string) => void | Promise<void>;
  onTaskClick?: (task: ArchbaseTask) => void;
  onTaskCreate?: (columnId: string) => void;
  onTaskEdit?: (task: ArchbaseTask) => void;
  onTaskDelete?: (task: ArchbaseTask) => void;

  // === Customização do card ===
  renderCard?: (task: ArchbaseTask, column: ArchbaseTaskColumn) => React.ReactNode;
  renderCardHeader?: (task: ArchbaseTask) => React.ReactNode;
  renderCardFooter?: (task: ArchbaseTask) => React.ReactNode;
  extraCardActions?: (task: ArchbaseTask) => ArchbaseTaskCardAction[];

  // === Configurações visuais ===
  columnWidth?: number;
  showCardCount?: boolean;
  wipLimits?: Record<string, number>;   // { 'em-andamento': 5 }
}

interface ArchbaseTaskColumn {
  id: string;
  title: string;
  color?: string;                        // cor do header da coluna
  type?: ArchbaseColumnType;
  wipLimit?: number;
  allowCreate?: boolean;                 // exibe botão "+ Tarefa" (padrão: true)
  isDraggable?: boolean;                 // coluna pode ser movida
}

interface ArchbaseTaskSwimlane {
  id: string;
  label: string;
  fieldValue: any;                       // valor do swimlaneField que mapeia para essa lane
  color?: string;
  collapsed?: boolean;
}

interface ArchbaseTaskFilterField {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'user';
  options?: { value: any; label: string }[]; // para type === 'select'
}

interface ArchbaseTaskCardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (task: ArchbaseTask) => void;
  color?: string;
  disabled?: boolean;
}
```

### Toolbar do TaskBoard

```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Buscar tarefas...]  [👤 Assignee ▼] [🏷️ Tags ▼] [📅 Data▼] │
│                                          [+ Nova Tarefa] [⚙️]   │
└─────────────────────────────────────────────────────────────────┘
```

- Busca full-text: filtra cards em tempo real (client-side)
- Filtros de assignee, tags, data: multi-select com pills removíveis
- Filtros ativos exibidos como `FilterPill` (já existe no Archbase)
- Botão "+ Nova Tarefa": dispara `onTaskCreate`
- Botão ⚙️: abre painel de configuração (WIP limits, swimlane field, etc.)

### Exemplo de uso completo

```tsx
import { ArchbaseTaskBoard } from '@archbase/advanced';
import { useArchbaseDataSource } from '@archbase/data';

function PedidosKanban() {
  const datasource = useArchbaseDataSource<ArchbaseTask>({
    apiService: pedidosService,
    pageSize: 200
  });

  const columns: ArchbaseTaskColumn[] = [
    { id: 'pendente',       title: 'Pendente',        color: 'gray',   allowCreate: true },
    { id: 'em-separacao',   title: 'Em Separação',    color: 'yellow', type: 'wip', wipLimit: 10 },
    { id: 'em-transporte',  title: 'Em Transporte',   color: 'blue',   type: 'wip' },
    { id: 'entregue',       title: 'Entregue',        color: 'green',  type: 'done' },
    { id: 'cancelado',      title: 'Cancelado',       color: 'red',    type: 'blocked' },
  ];

  return (
    <ArchbaseTaskBoard
      dataSource={datasource}
      statusField="status"
      columns={columns}
      swimlaneField="rotaId"
      swimlanes={[
        { id: 'rota-1', label: 'Rota Norte', fieldValue: 'rota-1' },
        { id: 'rota-2', label: 'Rota Sul',   fieldValue: 'rota-2' },
      ]}
      onTaskMove={async (task, from, to) => {
        await pedidosService.updateStatus(task.id, to);
      }}
      onTaskClick={(task) => navigate(`/pedidos/${task.id}`)}
      extraCardActions={(task) => [
        { label: 'Ver rota', icon: <IconMap />, onClick: () => openRouteMap(task) },
        { label: 'WhatsApp', icon: <IconBrandWhatsapp />, onClick: () => sendWhatsApp(task) },
      ]}
      wipLimits={{ 'em-separacao': 10, 'em-transporte': 20 }}
    />
  );
}
```

---

## Parte 3 — Estrutura de arquivos no monorepo

```
packages/
└── advanced/
    └── src/
        ├── kanban/
        │   ├── core/                    ← source do react-kanban-kit adaptado
        │   │   ├── Board.tsx
        │   │   ├── Column.tsx
        │   │   ├── Card.tsx
        │   │   ├── DragPreview.tsx
        │   │   ├── Skeleton.tsx
        │   │   ├── dnd/                 ← lógica pragmatic-drag-and-drop
        │   │   │   ├── useDragCard.ts
        │   │   │   ├── useDragColumn.ts
        │   │   │   └── useDropColumn.ts
        │   │   └── utils/
        │   │       ├── boardData.ts     ← helpers de manipulação de BoardData
        │   │       └── theme.ts         ← mapeamento tokens Mantine
        │   │
        │   ├── ArchbaseKanban.tsx       ← componente público
        │   ├── ArchbaseKanban.types.ts
        │   ├── ArchbaseKanban.module.css
        │   └── index.ts
        │
        └── taskboard/
            ├── ArchbaseTaskBoard.tsx    ← compõe ArchbaseKanban
            ├── ArchbaseTaskBoard.types.ts
            ├── ArchbaseTaskCard.tsx     ← card padrão de tarefa
            ├── ArchbaseTaskCard.module.css
            ├── ArchbaseTaskBoardToolbar.tsx
            ├── ArchbaseTaskBoardFilters.tsx
            ├── hooks/
            │   ├── useTaskBoardFilters.ts
            │   ├── useTaskBoardData.ts  ← transforma DataSource → BoardData
            │   └── useWipValidation.ts
            └── index.ts
```

---

## Parte 4 — Ajustes necessários no source do react-kanban-kit

Com base na API pública e nos ajustes que você já precisou fazer, os pontos de
adaptação são:

### 4.1 Remover estilos hardcoded
O original usa className strings que esperam um CSS externo. Substituir por
`useMantineTheme()` e CSS Modules com variáveis Mantine:

```typescript
// ANTES (react-kanban-kit original)
<div className="kanban-column" style={{ backgroundColor: '#f4f5f7' }}>

// DEPOIS (ArchbaseKanban)
const theme = useMantineTheme();
<div style={{ backgroundColor: theme.colorScheme === 'dark'
  ? theme.colors.dark[6]
  : theme.colors.gray[0] }}>
```

### 4.2 Adicionar suporte a WIP limit
Quando `wipLimit` é configurado numa coluna e o número de cards atingir o limite:
- Header da coluna exibe badge vermelho `"5/5"`
- `canDropInto` retorna `false` para aquela coluna
- Card em drag sobre a coluna bloqueada exibe indicador visual de recusa

### 4.3 Corrigir scroll interno de coluna
Problema conhecido: com muitos cards, a coluna não scrolla independentemente.
Fix: envolver o container de cards em `<ScrollArea>` do Mantine com `mah` (max-height).

### 4.4 Adicionar `onCardRightClick`
Para o `ArchbaseContextMenu` funcionar nos cards — disparar no `onContextMenu` do
wrapper de card.

### 4.5 Swimlanes
Nova feature — não existe no original. Implementar como wrapper externo:
cada swimlane renderiza um `<ArchbaseKanban>` filtrado em modo `viewOnly={false}`
dentro de um `<Accordion.Panel>` do Mantine, compartilhando o mesmo handler de
`onCardMove`.

---

## Parte 5 — Diferença conceitual Kanban × TaskBoard

| Aspecto | ArchbaseKanban | ArchbaseTaskBoard |
|---------|---------------|-----------------|
| **Propósito** | Primitivo genérico | Produto final de gestão de tarefas |
| **Card** | `renderCard` livre | `ArchbaseTaskCard` com layout fixo + slots |
| **Dados** | `BoardData` flat | `ArchbaseDataSource<ArchbaseTask>` |
| **Toolbar** | Não tem | Busca + filtros + botão criar |
| **Swimlanes** | Suporte básico | Integrado com `swimlaneField` automático |
| **Filtros** | Não tem | Multi-campo client-side + pills |
| **WIP limits** | Config por coluna | Config + validação visual automática |
| **Ações de card** | Via `renderCard` | `extraCardActions` + menu contextual |
| **Semântica** | Genérico | Tarefa/ticket com prioridade, assignee, prazo |

**Regra prática:** use `ArchbaseKanban` quando precisar de total controle sobre o
card e o modelo de dados. Use `ArchbaseTaskBoard` quando quiser uma gestão de
tarefas/pedidos/processos funcionando rapidamente.

---

## Parte 6 — Dependências resultantes

```json
// package.json do @archbase/advanced — resultado final
{
  "dependencies": {
    "@atlaskit/pragmatic-drag-and-drop": "^1.4.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "@mantine/core": ">=7.0.0",
    "@mantine/hooks": ">=7.0.0"
  }
}
```

O `react-kanban-kit` em si **não entra como dependência npm** — o source é copiado
e passa a ser código interno do `@archbase/advanced`. Isso garante:
- Controle total sobre modificações
- Sem risco de breaking change por atualização da lib original
- Theming Mantine sem conflito

A única dep nova real é `@atlaskit/pragmatic-drag-and-drop` (~4,7 kB gzip),
que é o engine de DnD — pequena, mantida pela Atlassian (Trello/Jira), usa
a browser Drag and Drop API nativa.
