# Archbase React — Catálogo de Novos Componentes

> Documento de referência para planejamento e implementação de componentes ausentes.  
> Auditado contra **Mantine v9** (`@mantine/core` + extensões oficiais + community) em Abril/2026.  
> Cada entrada define: o que é, por que fazer, como implementar, e a fonte correta do primitivo.

---

## Convenções

| Símbolo | Significado |
|---------|-------------|
| 🟢 `@mantine/core` | Primitivo já existe no core — wrapper Archbase com DataSource binding |
| 🔷 `@mantine/x` | Extensão oficial Mantine — instalar pacote + wrapper Archbase |
| 🟣 Community ext | Extensão da comunidade Mantine-native — instalar + wrapper |
| 🔵 Lib pequena | Lib < 20 kB MIT; copiar source ou dep direta |
| 🟡 Construir | Nenhum equivalente no ecossistema Mantine — implementar do zero |
| 🟠 Peer dep opcional | Lib maior necessária mas opcional — app instala só se usar |

> **Nota sobre Mantine v9:** A v9 lançou vários componentes novos que não existiam na v7/v8:
> `FloatingWindow`, `Scroller`, `OverflowList`, `TableOfContents`, `AngleSlider`,
> `FloatingIndicator`, `Marquee`. Verificar qual versão o Archbase usa antes de construir equivalentes.

---

## 1. Formulários & Inputs

### 1.1 `ArchbaseStepper` / `ArchbaseFormWizard`
**Símbolo:** 🟢 `@mantine/core` — `Stepper`
**Pacote sugerido:** `@archbase/components`

**O que é:** Componente multi-step para formulários complexos. Exibe indicador de etapas no topo (ou lateral), controla navegação entre steps com validação por etapa, e integra com DataSource do Archbase.

**Por que fazer:** Presente em praticamente 100% dos onboardings e cadastros complexos B2B. Sem ele, cada dev reconstrói do zero usando estado local.

**Como implementar:**
- `Stepper` do Mantine já tem: horizontal/vertical, ícones, estados `completed`/`error`, `allowStepSelect`, step completado customizável
- Hook `useArchbaseFormWizard`: gerencia step atual, validação por step via `ArchbaseValidator`, persistência no DataSource
- `ArchbaseFormWizard`: composição de `Stepper` + botões Anterior/Próximo/Finalizar automáticos + step de revisão opcional
- Props: `steps[]` com `{ title, description, icon, component, validate }`, `datasource`, `onComplete`, `allowStepSelect`

**Dependência nova:** nenhuma.

---

### 1.2 `ArchbaseOTPInput`
**Símbolo:** 🟢 `@mantine/core` — `PinInput`
**Pacote sugerido:** `@archbase/components`

**O que é:** Campo de entrada de código OTP/2FA com N dígitos separados, autocomplete de SMS, paste automático, suporte a teclado.

**Por que fazer:** Padrão obrigatório para 2FA/MFA em qualquer app com autenticação segura.

**Como implementar:**
- `PinInput` do Mantine já tem: `length`, `mask`, `type`, `placeholder`, `oneTimeCode`, `manageFocus` (auto-avança entre campos)
- Wrapper Archbase: binding ao DataSource, variante com temporizador de reenvio (`ResendCountdown`), estado de erro
- Props: `length` (padrão 6), `mask`, `type`, `onComplete`, `datasource`, `resendDelay`, `onResend`

**Dependência nova:** nenhuma.

---

### 1.3 `ArchbaseCurrencyInput`
**Símbolo:** 🟢 `@mantine/core` — `NumberInput` com defaults BRL
**Pacote sugerido:** `@archbase/components`

**O que é:** Campo monetário com formatação automática BRL (R$ 1.234,56), validação de limites, integração com datasource.

**Por que fazer:** `NumberInput` do Mantine suporta `prefix`, `thousandSeparator`, `decimalScale` — mas sem defaults brasileiros automáticos. Um wrapper dedicado elimina boilerplate em todos os projetos.

**Como implementar:**
- Wrapper de `NumberInput` com defaults pré-configurados: `prefix="R$ "`, `thousandSeparator="."`, `decimalSeparator=","`, `decimalScale={2}`, `fixedDecimalScale`
- Binding ao DataSource com conversão automática string→number
- Props adicionais: `currency` (padrão `'BRL'`), `allowNegative`, `max`, `min`

**Dependência nova:** nenhuma.

---

### 1.4 `ArchbaseCpfCnpjInput`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Campo de documento brasileiro com detecção automática CPF/CNPJ pela quantidade de dígitos, máscara dinâmica e validação dos dígitos verificadores.

**Por que fazer:** Obrigatório em qualquer cadastro B2B no Brasil. Nenhum equivalente no Mantine.

**Como implementar:**
- Base: `TextInput` do Mantine com `ArchbaseMaskEdit` aplicando máscara dinâmica
- Ao digitar: `length <= 11` → máscara CPF (`000.000.000-00`); `length > 11` → máscara CNPJ (`00.000.000/0000-00`)
- Algoritmos de validação (~30 linhas cada) implementados internamente — referência: `cpf-cnpj-validator` (MIT), copiar funções, não importar o pacote
- Props: `type` (`'cpf'` | `'cnpj'` | `'auto'`), `onValidate`, `allowInvalid`, `showValidationIcon`

**Dependência nova:** nenhuma (algoritmos copiados internamente).

---

### 1.5 `ArchbaseCepInput`
**Símbolo:** 🔵 Lib pequena — `cep-promise`
**Pacote sugerido:** `@archbase/components`

**O que é:** Campo de CEP com busca automática de endereço ao completar 8 dígitos.

**Por que fazer:** Elimina digitação manual de endereço em 100% dos cadastros. Valor imediato em projetos de food service (cadastro de clientes, pontos de entrega).

**Como implementar:**
- `cep-promise` (~2 kB, MIT, zero deps) como `dependency` direta — pequeno o suficiente para bundlar
- Campo: `ArchbaseMaskEdit` com máscara `00000-000`
- No `onBlur` com 8 dígitos: chama `cep(value)` → dispara `onAddressFound(addr)`
- Loading state durante a consulta via `rightSection` spinner
- Props: `onAddressFound: (addr: CepAddress) => void`, `loadingIndicator` (padrão true)

**Dependência nova:** `cep-promise` ~2 kB, MIT, zero deps transitivas.

---

### 1.6 `ArchbaseRangeSlider`
**Símbolo:** 🟢 `@mantine/core` — `RangeSlider`
**Pacote sugerido:** `@archbase/components`

**O que é:** Slider duplo para seleção de faixas (preço mínimo/máximo, quantidade, datas).

**Como implementar:**
- Wrapper de `RangeSlider` do Mantine — já tem `marks`, `step`, `minRange`, `label` (format), `labelAlwaysOn`
- Binding ao DataSource: field que armazena `[min, max]`
- Props: `min`, `max`, `step`, `marks`, `labelFormat`, `minRange`, `datasource`, `dataField`

**Dependência nova:** nenhuma.

---

### 1.7 `ArchbaseFieldArray`
**Símbolo:** 🟡 Construir (sobre peer deps existentes)
**Pacote sugerido:** `@archbase/components`

**O que é:** Grupos de campos repetíveis com botões add/remove/reorder via drag. Ex: itens de pedido, endereços múltiplos, contatos.

**Por que fazer:** Nenhum equivalente no Mantine. Requisito core em formulários B2B complexos.

**Como implementar:**
- `useFieldArray` do `react-hook-form` (já é peer dep) para gerenciar o array
- Reorder via `@dnd-kit/sortable` — o mesmo engine que o Mantine usa internamente
- Renderização: lista de grupos com handle de drag, botão remover por linha, botão adicionar no final
- Props: `name`, `renderItem`, `emptyState`, `addLabel`, `maxItems`, `minItems`

**Dependência nova:** `@dnd-kit/sortable` (provavelmente já transitivo via Mantine — verificar).

---

### 1.8 `ArchbaseNumberStepper`
**Símbolo:** 🟢 `@mantine/core` — `NumberInput` com controls
**Pacote sugerido:** `@archbase/components`

**O que é:** Input numérico com botões + e − integrados, step, min/max.

**Como implementar:**
- Wrapper de `NumberInput` com `hideControls={false}` + defaults decimais BR
- Binding DataSource, validação de range
- Props: `step`, `min`, `max`, `decimalScale`, `suffix`, `prefix`, `clampBehavior`

**Dependência nova:** nenhuma.

---

### 1.9 `ArchbaseColorGradientPicker`
**Símbolo:** 🟢 `@mantine/core` — `ColorPicker` + `AlphaSlider` + `HueSlider`
**Pacote sugerido:** `@archbase/components`

**O que é:** Picker de cor avançado com saturation/brightness picker, hue slider, alpha slider, paleta de swatches e input hex/rgb/hsl.

**Como implementar:**
- Mantine v9 tem `ColorPicker`, `HueSlider` e `AlphaSlider` como primitivos separados — compor em um picker completo
- Variante `ArchbaseFlatColorPicker`: só paleta de cores fixas (paleta corporativa)
- Binding DataSource para persistir valor hex/rgba

**Dependência nova:** nenhuma.

---

### 1.10 `ArchbaseSpeechToTextInput`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Botão de microfone integrável a qualquer input. Ao clicar, transcreve a voz em tempo real via Web Speech API nativa.

**Por que fazer:** Tendência em apps mobile-first (vendedores em campo). Zero dependência — Web Speech API é nativa nos browsers modernos.

**Como implementar:**
- Hook `useArchbaseSpeechToText`: encapsula `window.SpeechRecognition`, gerencia estado `listening`/`transcript`/`error`
- `ArchbaseSpeechToTextButton`: `ActionIcon` do Mantine com ícone de microfone + indicador de gravação animado (pulse via CSS)
- Composição com qualquer input via `rightSection`
- Fallback: se browser não suportar, botão desabilitado + `Tooltip` explicativo
- Props: `lang` (padrão `'pt-BR'`), `continuous`, `onTranscript`, `onError`

**Dependência nova:** nenhuma — Web Speech API nativa.

---

### 1.11 `ArchbaseSmartPasteButton`
**Símbolo:** 🟠 Peer dep opcional — `@ai-sdk/react`
**Pacote sugerido:** `@archbase/components`

**O que é:** Botão que lê o clipboard (texto de e-mail, NF, WhatsApp) e usa AI para extrair e preencher campos do formulário.

**Como implementar:**
- Lê `navigator.clipboard.readText()`
- Chama LLM via `@ai-sdk/react` (peer dep opcional) com schema JSON dos campos do form atual
- LLM retorna mapeamento campo→valor; componente aplica via `onExtracted(fields)`
- Fallback sem AI: cola o texto no campo focado
- Props: `formSchema`, `onExtracted`, `api`, `model`

**Dependência nova:** `@ai-sdk/react` como `peerDependenciesMeta: { optional: true }`.

---

### 1.12 `ArchbaseMultiViewCalendar`
**Símbolo:** 🔷 `@mantine/dates` — `DateRangePicker` com `numberOfColumns`
**Pacote sugerido:** `@archbase/components`

**O que é:** Dois ou mais calendários side-by-side para seleção de ranges longos.

**Como implementar:**
- `@mantine/dates` `DateRangePicker` já tem `numberOfColumns={2}` para dois meses lado a lado
- Wrapper Archbase: binding DataSource para `[startDate, endDate]`, localização pt-BR, presets rápidos (últimos 7 dias, mês atual, etc.)
- Props: `numberOfColumns` (padrão 2), `presets[]`, `datasource`, `startField`, `endField`

**Dependência nova:** `@mantine/dates` (extensão oficial — verificar se já presente).

---

## 2. Navegação & Layout

### 2.1 `ArchbaseAppBar`
**Símbolo:** 🟢 `@mantine/core` — `AppShell.Header`
**Pacote sugerido:** `@archbase/admin`

**O que é:** Barra de app superior responsiva para apps sem sidebar completa.

**Como implementar:**
- `AppShell.Header` com `height`, `withBorder`, `zIndex` configuráveis
- Slots: `leftSection` (logo/back), `centerSection` (título ou busca), `rightSection` (ações/avatar)
- Responsivo: colapsa ações em hamburger em telas pequenas via `useMediaQuery`

**Dependência nova:** nenhuma.

---

### 2.2 `ArchbaseBottomNavigation`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/admin`

**O que é:** Barra de navegação inferior com 3–5 ícones + rótulos. Padrão PWA/mobile.

**Como implementar:**
- `Group` do Mantine com itens igualmente distribuídos + `position: fixed; bottom: 0`
- `padding-bottom: env(safe-area-inset-bottom)` para iPhone
- Props: `items[]` com `{ icon, label, value, badge? }`, `value`, `onChange`, `height`

**Dependência nova:** nenhuma.

---

### 2.3 `ArchbaseRibbon`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Toolbar estilo Microsoft Office com abas, grupos de botões com ícones grandes/pequenos e separadores.

**Como implementar:**
- Abas: `Tabs` do Mantine com `variant="outline"`
- Grupos: `Group` com `Divider` verticais
- Botões grandes (32px + label abaixo): `Stack` + `ActionIcon`; pequenos (16px): `ActionIcon` em `Group`
- Estado minimizado: colapsa para mostrar só as tabs (duplo clique)
- Props: `tabs[]` com `{ id, label, groups[] }`, `minimized`, `onMinimize`

**Dependência nova:** nenhuma.

---

### 2.4 `ArchbaseContextMenu`
**Símbolo:** 🟣 Community ext — `mantine-contextmenu`
**Pacote sugerido:** `@archbase/components`

**O que é:** Menu de contexto por clique direito em qualquer elemento.

**Por que fazer:** Core para grids e listas. A extensão community `mantine-contextmenu` resolve 100% e é Mantine-native (sem theme clash).

**Como implementar:**
- Instalar `mantine-contextmenu` (MIT, mantida ativamente, temas Mantine automáticos)
- Hook `useArchbaseContextMenu()`: retorna `{ onContextMenu, ContextMenu }` para aplicar em qualquer elemento
- Props: `items[]` com `{ key, icon, title, onClick, color?, divider? }`

**Dependência nova:** `mantine-contextmenu` — dep direta, Mantine-native, sem theme clash.

---

### 2.5 `ArchbaseTileLayout`
**Símbolo:** 🟠 Peer dep opcional — `react-grid-layout`
**Pacote sugerido:** `@archbase/components`

**O que é:** Grid de tiles drag-and-drop e redimensionáveis para dashboards customizáveis.

**Como implementar:**
- `react-grid-layout` (~21 kB, MIT, ~21k stars, usado pelo Grafana) como peer dep opcional
- Wrapper aplica tokens Mantine nos handles de resize e no placeholder de drop
- Serialização do layout em JSON para persistência
- Props: `cols` (padrão 12), `rowHeight`, `layout[]`, `onLayoutChange`, `children`, `draggableHandle`

**Dependência nova:** `react-grid-layout` como `peerDependenciesMeta: { optional: true }`.

---

### 2.6 `ArchbaseExpansionPanel`
**Símbolo:** 🟢 `@mantine/core` — `Accordion`
**Pacote sugerido:** `@archbase/components`

**O que é:** Painéis expansíveis com API simplificada — aceita `panels[]` em vez de composição manual.

**Como implementar:**
- Wrapper de `Accordion` — já tem `multiple`, chevron customizável, `variant`, disabled, `transitionDuration`
- Props: `panels[]` com `{ id, title, icon?, content, disabled? }`, `multiple`, `defaultValue`, `value`, `onChange`

**Dependência nova:** nenhuma.

---

### 2.7 `ArchbaseActionSheet`
**Símbolo:** 🟢 `@mantine/core` — `Drawer position="bottom"`
**Pacote sugerido:** `@archbase/components`

**O que é:** Bottom sheet de ações emergindo da parte inferior da tela.

**Como implementar:**
- `Drawer` com `position="bottom"` + `size="auto"` já é exatamente um bottom sheet
- Em desktop: renderizar como `Menu` posicionado via `useMediaQuery`
- Props: `items[]`, `title?`, `cancelLabel`, `opened`, `onClose`

**Dependência nova:** nenhuma.

---

### 2.8 `ArchbaseCarousel`
**Símbolo:** 🔷 `@mantine/carousel`
**Pacote sugerido:** `@archbase/components`

**O que é:** Carrossel de conteúdo com snap points, setas, dots e touch swipe.

**Como implementar:**
- `@mantine/carousel` (Embla Carousel) já tem: `withControls`, `withIndicators`, `loop`, `autoplay`, `slideSize`, `slideGap`, `orientation`
- Wrapper Archbase com defaults razoáveis e binding a DataSource para itens

**Dependência nova:** `@mantine/carousel` (extensão oficial — verificar se já presente).

---

### 2.9 `ArchbaseSpotlight`
**Símbolo:** 🔷 `@mantine/spotlight`
**Pacote sugerido:** `@archbase/admin`

**O que é:** Command palette (Ctrl+K) com busca de ações, navegação e comandos.

**Por que fazer:** Mantine tem `@mantine/spotlight` completo — só falta integração com rotas e permissões do Archbase.

**Como implementar:**
- `@mantine/spotlight` com `actions[]`, busca fuzzy, ícones, grupos, keyboard navigation
- `ArchbaseSpotlight`: integração com `ArchbaseSecurityManager` (filtra ações por permissão) e React Router
- Props: `actions[]`, `shortcut` (padrão `'mod+K'`), `searchPlaceholder`, `nothingFound`

**Dependência nova:** `@mantine/spotlight` (extensão oficial — verificar se já presente).

---

### 2.10 `ArchbaseFileManager`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Explorador de arquivos com painel de árvore + grid de arquivos, upload, download, preview.

**Como implementar:**
- Compor: `ArchbaseTreeView` (painel esquerdo) + `ArchbaseDataGrid` ou grid de cards (painel direito)
- Upload: `@mantine/dropzone` (extensão oficial) — sem theme clash
- Preview: `ArchbaseImage` + `ArchbasePDFViewer` (já existentes)
- `FileManagerProvider`: callbacks `onUpload`, `onDelete`, `onMove`, `onRename`, `onCreateFolder`

**Dependência nova:** `@mantine/dropzone` (extensão oficial — provavelmente já presente).

---

## 3. Data Display & Grids

### 3.1 `ArchbaseTreeList`
**Símbolo:** 🟠 Peer dep já existente — TanStack Table
**Pacote sugerido:** `@archbase/components`

**O que é:** Grid de dados tabular com estrutura hierárquica (pai/filho expansível). Diferente do `ArchbaseTreeView` — este tem colunas.

**Por que fazer:** Visualizar produtos por categoria, hierarquia de contas, BOM (Bill of Materials).

**Como implementar:**
- `@tanstack/react-table` (já é peer dep) com `getSubRows` + `getExpandedRowModel()` nativamente
- UI: ícone expand/collapse, indentação por `row.depth`, linha de conexão hierárquica opcional
- API idêntica ao `ArchbaseDataGrid` + `getSubRows`, `expandedByDefault`, `maxDepth`

**Dependência nova:** nenhuma — TanStack Table já é peer dep.

---

### 3.2 `ArchbaseVirtualList`
**Símbolo:** 🟢 `@mantine/core` — `Scroller` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Lista virtualizada — renderiza apenas items visíveis. Suporta 100 mil+ itens.

**Como implementar:**
- Mantine v9 tem `Scroller` nativo — verificar API antes de usar `@tanstack/react-virtual`
- Fallback se `Scroller` não cobrir: `@tanstack/react-virtual` (~6 kB) como peer dep opcional
- Mantém mesma API do `ArchbaseList` atual com prop `virtual={true}`
- Props: `itemHeight`, `overscan`, `renderItem`

**Dependência nova:** possivelmente nenhuma (Scroller v9).

---

### 3.3 `ArchbaseTaskBoard`
**Símbolo:** 🟡 Construir (sobre `ArchbaseKanban`)
**Pacote sugerido:** `@archbase/advanced`

**O que é:** Board de tarefas semântico com cards prontos (assignee, prazo, prioridade, tags), toolbar de filtros e swimlanes.

**Como implementar:** Ver documento `archbase-kanban-taskboard-spec.md`.

**Dependência nova:** `@atlaskit/pragmatic-drag-and-drop` (~4,7 kB) via `ArchbaseKanban`.

---

### 3.4 `ArchbaseOrgChart`
**Símbolo:** 🔵 Source adapt — `react-organizational-chart`
**Pacote sugerido:** `@archbase/components`

**O que é:** Organograma hierárquico com nós conectados por linhas, collapse de branches.

**Como implementar:**
- Copiar source de `react-organizational-chart` (~200 linhas SVG, MIT)
- Substituir cores hardcoded por `useMantineTheme().colors`
- Adicionar: collapse de branches, `renderNode` customizável, zoom/pan via CSS transform

**Dependência nova:** nenhuma (source copiado internamente).

---

### 3.5 `ArchbaseSparkline`
**Símbolo:** 🔷 `@mantine/charts` — `Sparkline`
**Pacote sugerido:** `@archbase/components`

**O que é:** Mini gráfico inline (linha, área) para células de tabela e cards de KPI.

**Como implementar:**
- `@mantine/charts` tem `Sparkline` nativo — wrapper simples com DataSource binding e defaults de cor via tema
- Props: `data[]`, `color`, `curveType`, `fillOpacity`, `trendColors` (verde/vermelho automático por direção)

**Dependência nova:** `@mantine/charts` (extensão oficial — verificar se já presente).

---

### 3.6 `ArchbaseInPlaceEditor`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Texto clicável que vira input ao receber foco. Enter salva, Esc cancela. Suporta text, number, select, date.

**Como implementar:**
- Estado: `viewing` ↔ `editing`
- Viewing: `Text` do Mantine com `cursor: pointer` + hover highlight
- Editing: input Mantine correspondente ao `type` (TextInput, NumberInput, Select, DateInput)
- Salvar em `onBlur` e `onKeyDown Enter`; cancelar em `onKeyDown Escape`
- Props: `value`, `type`, `onSave`, `options` (para select), `validate`, `datasource`, `dataField`

**Dependência nova:** nenhuma.

---

### 3.7 `ArchbaseDataGridExcelExport`
**Símbolo:** 🟠 Peer dep opcional — `xlsx` (SheetJS)
**Pacote sugerido:** `@archbase/components`

**O que é:** Exportação do `ArchbaseDataGrid` para XLSX com formatação, colunas visíveis e filtros aplicados.

**Por que fazer:** Requisito universal em B2B. AG Grid cobra $999/dev, MUI cobra Premium. Ser gratuito é diferenciador.

**Como implementar:**
- `xlsx` (SheetJS, Apache-2.0) como peer dep opcional
- `ArchbaseDataGridExportButton` no toolbar do grid
- Exporta: colunas visíveis, rows filtradas ou todas, headers com labels das colunas
- Formatação: datas, números decimais, booleanos como Sim/Não
- Props: `filename`, `sheetName`, `includeFiltered`, `dateFormat`

**Dependência nova:** `xlsx` como `peerDependenciesMeta: { optional: true }`.

---

### 3.8 `ArchbaseOverflowList`
**Símbolo:** 🟢 `@mantine/core` — `OverflowList` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Container que move itens que não cabem automaticamente para um menu "mais". Útil em toolbars e tabs.

**Como implementar:**
- `OverflowList` do Mantine v9 resolve nativamente
- Wrapper com defaults para toolbars do `ArchbaseDataGrid` e `ArchbaseFormContainer`

**Dependência nova:** nenhuma (Mantine v9).

---

### 3.9 `ArchbaseTableOfContents`
**Símbolo:** 🟢 `@mantine/core` — `TableOfContents` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Âncoras de seção com scroll spy automático — destaca o item da seção visível na tela.

**Como implementar:** Wrapper simples do `TableOfContents` do Mantine v9 com integração ao tema Archbase.

**Dependência nova:** nenhuma (Mantine v9).

---

## 4. Indicadores & Gauges

### 4.1 `ArchbaseArcGauge` / `ArchbaseRadialGauge`
**Símbolo:** 🟡 Construir (SVG puro) — `@mantine/charts` cobre casos simples
**Pacote sugerido:** `@archbase/components`

**O que é:** Medidor semicircular (arc) ou completo (radial) com ponteiro/agulha, zonas coloridas e animação.

**Por que fazer:** Dashboards operacionais: taxa de entrega, SLA, capacidade, NPS.

**Como implementar:**
- `@mantine/charts` tem `RadialBarChart` e `SemiCircleProgress` — suficientes para casos sem agulha
- Para gauge com **agulha/ponteiro**: SVG puro ~60 linhas usando `stroke-dasharray`/`stroke-dashoffset` + `rotate()`
- Cores de zonas via `useMantineTheme()` — zero theme clash
- Props: `value`, `min`, `max`, `zones[]` com `{ from, to, color }`, `label`, `animate`, `showPointer`

**Dependência nova:** nenhuma.

---

### 4.2 `ArchbaseLinearGauge`
**Símbolo:** 🟡 Construir (SVG puro)
**Pacote sugerido:** `@archbase/components`

**O que é:** Medidor linear horizontal/vertical com zonas coloridas e indicador de posição.

**Como implementar:**
- SVG puro: barra segmentada + ponteiro triangular + ticks de escala (~80 linhas)
- Cores via `useMantineTheme()`
- Props: `value`, `min`, `max`, `orientation`, `zones[]`, `ticks`, `label`

**Dependência nova:** nenhuma.

---

### 4.3 `ArchbaseChunkProgressBar`
**Símbolo:** 🟢 `@mantine/core` — `Progress` com `sections`
**Pacote sugerido:** `@archbase/components`

**O que é:** Barra de progresso segmentada em N chunks.

**Como implementar:**
- `Progress` do Mantine tem `sections[]` para múltiplos segmentos coloridos
- Calcula automaticamente `sections` a partir de `value` e `chunkCount`
- Props: `value`, `chunkCount`, `gap` (padrão 2px), `color`, `completedColor`, `animated`

**Dependência nova:** nenhuma.

---

### 4.4 `ArchbaseSkeleton` (templates compostos)
**Símbolo:** 🟢 `@mantine/core` — `Skeleton`
**Pacote sugerido:** `@archbase/components`

**O que é:** Templates compostos de skeleton que simulam os próprios componentes Archbase durante o loading.

**Como implementar:**
- `ArchbaseDataGridSkeleton`: N linhas de `Skeleton` simulando um grid
- `ArchbaseFormSkeleton`: campos de formulário (label + input por linha)
- `ArchbaseCardSkeleton`: avatar circular + linhas de texto
- `ArchbaseKanbanSkeleton`: colunas com cards em skeleton

**Dependência nova:** nenhuma.

---

### 4.5 `ArchbaseFunnelChart`
**Símbolo:** 🔷 `@mantine/charts` — `FunnelChart`
**Pacote sugerido:** `@archbase/components`

**O que é:** Gráfico de funil para pipeline de vendas, conversão de leads.

**Como implementar:** `@mantine/charts` tem `FunnelChart` nativo — wrapper com DataSource binding e localização pt-BR.

**Dependência nova:** `@mantine/charts` (extensão oficial).

---

### 4.6 `ArchbaseHeatmapChart`
**Símbolo:** 🔷 `@mantine/charts` — `Heatmap`
**Pacote sugerido:** `@archbase/components`

**O que é:** Heatmap para matrizes de risco, utilização, calendário de contribuição.

**Como implementar:** `@mantine/charts` tem `Heatmap` nativo — wrapper com DataSource binding.

**Dependência nova:** `@mantine/charts` (extensão oficial).

---

### 4.7 `ArchbaseRadarChart`
**Símbolo:** 🔷 `@mantine/charts` — `RadarChart`
**Pacote sugerido:** `@archbase/components`

**O que é:** Radar/spider chart para comparação de múltiplas dimensões.

**Como implementar:** `@mantine/charts` tem `RadarChart` nativo — wrapper com DataSource binding.

**Dependência nova:** `@mantine/charts` (extensão oficial).

---

## 5. AI & Inteligência

### 5.1 `ArchbaseAIPromptInput`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Textarea especializada para prompts AI: Shift+Enter nova linha, Enter envia, histórico de prompts (↑↓), contador de tokens, sugestões rápidas.

**Como implementar:**
- Base: `Textarea` do Mantine com `autosize`
- Hook `useArchbasePromptHistory`: array de prompts + navegação por teclado
- Props: `onSubmit`, `loading`, `placeholder`, `suggestions[]`, `maxLength`, `showCounter`

**Dependência nova:** nenhuma.

---

### 5.2 `ArchbaseAIChatInterface`
**Símbolo:** 🟠 Peer dep opcional — `@ai-sdk/react`
**Pacote sugerido:** `@archbase/components`

**O que é:** Interface completa de chat AI com streaming, typing indicator, copy e ações por mensagem.

**Como implementar:**
- UI: 100% Mantine — `ScrollArea` + `Stack` de mensagens + `ArchbaseAIPromptInput`
- Mensagens: `Avatar` + `Paper` + `ArchbaseMarkdown`
- Streaming: `useChat` do `@ai-sdk/react` (peer dep opcional)
- Props: `api`, `initialMessages[]`, `systemPrompt`, `onFinish`, `renderMessage`

**Dependência nova:** `@ai-sdk/react` como `peerDependenciesMeta: { optional: true }`.

---

### 5.3 `ArchbaseInlineAIAssist`
**Símbolo:** 🟠 Peer dep opcional — `@ai-sdk/react`
**Pacote sugerido:** `@archbase/components`

**O que é:** Selecionar texto em qualquer campo → ícone AI aparece → popover com ações (melhorar, traduzir, resumir).

**Como implementar:**
- `useArchbaseInlineAIAssist(ref)`: monitora seleção de texto
- Ao detectar seleção: `Popover` do Mantine com ações AI
- Props: `actions[]` com `{ label, icon, prompt }`, `api`

**Dependência nova:** `@ai-sdk/react` como `peerDependenciesMeta: { optional: true }`.

---

### 5.4 `ArchbaseSmartTextArea`
**Símbolo:** 🟠 Peer dep opcional — `@ai-sdk/react`
**Pacote sugerido:** `@archbase/components`

**O que é:** Textarea com botão "melhorar com AI". Mostra diff antes de aceitar.

**Como implementar:**
- Base: `ArchbaseTextArea` + `ActionIcon` de AI no canto inferior direito
- Ao clicar: envia para LLM → exibe `ArchbaseDiffViewer` (já existe!) com original × melhorado
- Props: `api`, `prompt`, `onAccept`, `onReject`

**Dependência nova:** `@ai-sdk/react` como `peerDependenciesMeta: { optional: true }`.

---

## 6. Animação & UX Polish

### 6.1 `ArchbaseSpeedDial`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Floating Action Button que expande sub-ações em leque ao clicar.

**Como implementar:**
- `ActionIcon` do Mantine como botão principal com `position: fixed`
- Sub-ações: `ActionIcon` com posicionamento absoluto + CSS `transform` animado com stagger por index
- `Transition` do Mantine para animação; `useClickOutside` para fechar
- Props: `actions[]` com `{ icon, label, onClick, color? }`, `direction`, `icon`, `color`, `size`, `position`

**Dependência nova:** nenhuma.

---

### 6.2 `ArchbaseAnimationWrapper`
**Símbolo:** 🟢 `@mantine/core` — `Transition`
**Pacote sugerido:** `@archbase/components`

**O que é:** Wrapper que adiciona animação de entrada/saída (fade, slide, scale, pop) a qualquer filho.

**Como implementar:**
- `Transition` do Mantine tem presets completos: `fade`, `slide-up`, `slide-down`, `scale`, `pop`, `rotate-left`...
- `ArchbaseAnimationWrapper`: composição simples com prop `visible`
- `ArchbaseAnimatedList`: stagger automático em lista de filhos via `delay` incremental
- Props: `preset`, `duration`, `delay`, `visible`, `onEntered`, `onExited`

**Dependência nova:** nenhuma.

---

### 6.3 `ArchbaseMarquee`
**Símbolo:** 🟢 `@mantine/core` — `Marquee` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Texto/conteúdo animado horizontalmente em loop contínuo.

**Como implementar:** `Marquee` do Mantine v9 — wrapper simples com binding ao tema.

**Dependência nova:** nenhuma (Mantine v9).

---

### 6.4 `ArchbaseFloatingWindow`
**Símbolo:** 🟢 `@mantine/core` — `FloatingWindow` (v9)
**Pacote sugerido:** `@archbase/layout`

**O que é:** Janela flutuante com drag + resize. Avaliar se substitui o `ArchbaseWindowPanel` atual.

**Como implementar:** `FloatingWindow` do Mantine v9 — verificar API e integrar ao sistema de dock do Archbase.

**Dependência nova:** nenhuma (Mantine v9).

---

### 6.5 `ArchbaseBarcodeGenerator`
**Símbolo:** 🔵 Lib pequena — `JsBarcode`
**Pacote sugerido:** `@archbase/components`

**O que é:** Geração de códigos de barras SVG para Code128, EAN-13, EAN-8, UPC-A.

**Por que fazer:** O Archbase já tem `ArchbaseBarcodeScanner` (leitura). O par leitura+geração é essencial para estoque e logística.

**Como implementar:**
- `JsBarcode` (~3 kB, MIT) como `dependency` direta
- Output SVG via `ref` no elemento `<svg>`
- Props: `value`, `format`, `width`, `height`, `displayValue`, `background`, `lineColor`

**Dependência nova:** `JsBarcode` ~3 kB, MIT.

---

### 6.6 `ArchbaseRipple`
**Símbolo:** 🟡 Construir
**Pacote sugerido:** `@archbase/components`

**O que é:** Efeito ripple (onda) ao clicar em qualquer elemento, estilo Material Design.

**Como implementar:**
- HOC ou wrapper que ao `onClick` cria `<span>` absoluto com `@keyframes ripple`
- Remove o `<span>` após `animationend`
- Cor via `useMantineTheme().colors.primary[3]` com opacidade
- Props: `color`, `duration` (padrão 600ms), `centered`

**Dependência nova:** nenhuma.

---

### 6.7 `ArchbaseTooltipRich`
**Símbolo:** 🟢 `@mantine/core` — `HoverCard`
**Pacote sugerido:** `@archbase/components`

**O que é:** Tooltip com conteúdo rico: título, descrição, imagem opcional, link "saiba mais".

**Como implementar:**
- `HoverCard` do Mantine com delay, portal, `withArrow`
- Layout interno padronizado: `title`, `description`, `image?`, `link?`
- Props: `title`, `description`, `image?`, `link?`, `linkLabel?`, `openDelay`, `closeDelay`

**Dependência nova:** nenhuma.

---

### 6.8 `ArchbaseAngleSlider`
**Símbolo:** 🟢 `@mantine/core` — `AngleSlider` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Slider circular para seleção de ângulo (0–360°). Útil em editores visuais.

**Como implementar:** `AngleSlider` do Mantine v9 — wrapper simples com binding DataSource.

**Dependência nova:** nenhuma (Mantine v9).

---

### 6.9 `ArchbaseFloatingIndicator`
**Símbolo:** 🟢 `@mantine/core` — `FloatingIndicator` (v9)
**Pacote sugerido:** `@archbase/components`

**O que é:** Indicador animado que desliza para o item ativo em tabs, pills ou navegação segmentada.

**Como implementar:** `FloatingIndicator` do Mantine v9 — integrar ao sistema de tabs do Archbase.

**Dependência nova:** nenhuma (Mantine v9).

---

### 6.10 `useArchbaseFileSaver`
**Símbolo:** 🟡 Construir (hook puro)
**Pacote sugerido:** `@archbase/core`

**O que é:** Hook para download de arquivos gerados no frontend: Blob, texto, JSON, CSV.

**Como implementar:**
- `saveFile(content, filename, mimeType)`: cria Blob → `URL.createObjectURL` → click programático em `<a>` → `revokeObjectURL`
- ~15 linhas, zero dependência
- Integrado com `ArchbaseDataGridExcelExport` e `ArchbasePdfBuilder`

**Dependência nova:** nenhuma.

---

## 7. Templates Avançados

### 7.1 `ArchbaseFormWizardTemplate`
**Símbolo:** 🟢 `@mantine/core` (base)
**Pacote sugerido:** `@archbase/template`

**O que é:** Template de página completo para formulários multi-step com navegação, validação por step e revisão final.

**Como implementar:**
- Compor `ArchbaseStepper` + steps com `ArchbaseValidator` + botões Anterior/Próximo/Finalizar
- Step de revisão opcional: `ArchbaseFormWizardSummary` mostra todos os valores preenchidos
- Suporte a save parcial (rascunho entre steps)
- Props: `steps[]` com `{ title, component, validate }`, `datasource`, `onComplete`, `allowDraftSave`

---

### 7.2 `ArchbaseSearchTemplate` (aprimorado)
**Símbolo:** 🟢 `@mantine/core` (base)
**Pacote sugerido:** `@archbase/template`

**O que é:** Versão aprimorada do `ArchbaseSearchTemplate` existente com painel de filtros colapsável, filtros ativos como pills removíveis, view toggle (grid/lista/cards) e ordenação.

---

## 8. Utilitários & Hooks

### 8.1 `useArchbaseClipboard`
**Símbolo:** 🟢 `@mantine/core` — `CopyButton` + `useClipboard`
**Pacote sugerido:** `@archbase/core`

**Como implementar:** Wrapper de `useClipboard` do Mantine com padrão visual de ícone `copy`→`check` por 2 segundos. Zero dependência nova.

---

### 8.2 `useArchbaseConfirm`
**Símbolo:** 🔷 `@mantine/modals`
**Pacote sugerido:** `@archbase/core`

**O que é:** Hook imperativo: `const confirmed = await confirm('Deseja excluir?')`.

**Como implementar:** `@mantine/modals` `openConfirmModal()` — wrapper com defaults em pt-BR e integração com `ArchbaseI18n`.

**Dependência nova:** `@mantine/modals` (extensão oficial — provavelmente já presente).

---

### 8.3 `useArchbaseDebouncedCallback`
**Símbolo:** 🟢 `@mantine/hooks`
**Pacote sugerido:** `@archbase/core`

**Como implementar:** Re-exportar `useDebouncedCallback` do `@mantine/hooks` com nome Archbase para consistência.

---

### 8.4 `ArchbaseKeyboardShortcuts`
**Símbolo:** 🟡 Construir (sobre `useHotkeys` do Mantine)
**Pacote sugerido:** `@archbase/components`

**O que é:** Sistema de registro de atalhos globais + modal de ajuda (tecla `?`).

**Como implementar:**
- `ArchbaseKeyboardShortcutsProvider`: registra atalhos via `useHotkeys` do Mantine
- `ArchbaseKeyboardShortcutsModal`: `Modal` com `Table` listando atalhos por grupo; abre com `?`
- `useArchbaseRegisterShortcut(keys, handler, description, group)`: hook de registro

**Dependência nova:** nenhuma (`useHotkeys` já é do `@mantine/hooks`).

---

## Roadmap de implementação

| # | Componente | Símbolo | Esforço | Valor |
|---|-----------|---------|---------|-------|
| 1 | `ArchbaseStepper` / `ArchbaseFormWizard` | 🟢 Mantine | Baixo | ⭐⭐⭐⭐⭐ |
| 2 | `ArchbaseCurrencyInput` | 🟢 Mantine | Baixo | ⭐⭐⭐⭐⭐ |
| 3 | `ArchbaseCpfCnpjInput` | 🟡 Construir | Baixo | ⭐⭐⭐⭐⭐ |
| 4 | `ArchbaseCepInput` | 🔵 cep-promise | Baixo | ⭐⭐⭐⭐⭐ |
| 5 | `ArchbaseOTPInput` | 🟢 PinInput | Baixo | ⭐⭐⭐⭐ |
| 6 | `ArchbaseRangeSlider` | 🟢 Mantine | Baixo | ⭐⭐⭐⭐ |
| 7 | `ArchbaseDataGridExcelExport` | 🟠 SheetJS | Médio | ⭐⭐⭐⭐⭐ |
| 8 | `ArchbaseTreeList` | 🟠 TanStack | Médio | ⭐⭐⭐⭐⭐ |
| 9 | `ArchbaseInPlaceEditor` | 🟡 Construir | Médio | ⭐⭐⭐⭐ |
| 10 | `ArchbaseContextMenu` | 🟣 Community | Baixo | ⭐⭐⭐⭐ |
| 11 | `ArchbaseSparkline` | 🔷 @mantine/charts | Baixo | ⭐⭐⭐⭐ |
| 12 | `ArchbaseChunkProgressBar` | 🟢 Mantine | Baixo | ⭐⭐⭐ |
| 13 | `ArchbaseExpansionPanel` | 🟢 Accordion | Baixo | ⭐⭐⭐ |
| 14 | `ArchbaseArcGauge` | 🟡 SVG puro | Médio | ⭐⭐⭐⭐ |
| 15 | `ArchbaseLinearGauge` | 🟡 SVG puro | Médio | ⭐⭐⭐ |
| 16 | `ArchbaseSkeleton` (templates) | 🟢 Mantine | Baixo | ⭐⭐⭐⭐ |
| 17 | `ArchbaseAnimationWrapper` | 🟢 Transition | Baixo | ⭐⭐⭐ |
| 18 | `ArchbaseFieldArray` | 🟡 Construir | Médio | ⭐⭐⭐⭐ |
| 19 | `ArchbaseSpeedDial` | 🟡 Construir | Médio | ⭐⭐⭐ |
| 20 | `ArchbaseBarcodeGenerator` | 🔵 JsBarcode | Baixo | ⭐⭐⭐⭐ |
| 21 | `ArchbaseTileLayout` | 🟠 react-grid-layout | Médio | ⭐⭐⭐⭐ |
| 22 | `ArchbaseTaskBoard` | 🟡 Construir | Alto | ⭐⭐⭐⭐ |
| 23 | `ArchbaseSpotlight` | 🔷 @mantine/spotlight | Baixo | ⭐⭐⭐⭐ |
| 24 | `ArchbaseAIPromptInput` | 🟡 Construir | Médio | ⭐⭐⭐⭐ |
| 25 | `ArchbaseAIChatInterface` | 🟠 @ai-sdk/react | Alto | ⭐⭐⭐⭐ |
| 26 | `ArchbaseAppBar` | 🟢 AppShell.Header | Baixo | ⭐⭐⭐ |
| 27 | `ArchbaseBottomNavigation` | 🟡 Construir | Médio | ⭐⭐⭐ |
| 28 | `ArchbaseMultiViewCalendar` | 🔷 @mantine/dates | Baixo | ⭐⭐⭐ |
| 29 | `ArchbaseOrgChart` | 🔵 Source adapt | Médio | ⭐⭐⭐ |
| 30 | `ArchbaseFileManager` | 🟡 Construir | Alto | ⭐⭐⭐ |
| 31 | `ArchbaseColorGradientPicker` | 🟢 Mantine | Médio | ⭐⭐⭐ |
| 32 | `ArchbaseFunnelChart` | 🔷 @mantine/charts | Baixo | ⭐⭐⭐ |
| 33 | `ArchbaseHeatmapChart` | 🔷 @mantine/charts | Baixo | ⭐⭐⭐ |
| 34 | `ArchbaseRadarChart` | 🔷 @mantine/charts | Baixo | ⭐⭐⭐ |
| 35 | `useArchbaseConfirm` | 🔷 @mantine/modals | Baixo | ⭐⭐⭐⭐ |
| 36 | `ArchbaseKeyboardShortcuts` | 🟡 Construir | Médio | ⭐⭐⭐ |
| 37 | `ArchbaseRibbon` | 🟡 Construir | Alto | ⭐⭐ |
| 38 | `ArchbaseSpeechToTextInput` | 🟡 Construir | Médio | ⭐⭐⭐ |
| 39 | `ArchbaseSmartPasteButton` | 🟠 @ai-sdk/react | Alto | ⭐⭐⭐ |
| 40 | `ArchbaseFloatingWindow` | 🟢 Mantine v9 | Baixo | ⭐⭐⭐ |

---

## Resumo da auditoria Mantine v9

| Categoria | Qtd | Proporção |
|-----------|-----|-----------|
| 🟢 `@mantine/core` — só wrapper | 16 | 40% |
| 🔷 Extensão oficial Mantine | 9 | 22% |
| 🟣 Community extension Mantine-native | 1 | 2% |
| 🔵 Lib pequena < 20 kB | 3 | 8% |
| 🟡 Construir do zero | 9 | 22% |
| 🟠 Peer dep opcional | 3 | 6% |

**Conclusão:** ~64% dos componentes propostos já têm base nativa no ecossistema Mantine. O trabalho real é o **wrapper Archbase** — DataSource binding, i18n pt-BR, integração com `ArchbaseValidator` e padrão de API consistente — não reimplementar UI do zero.

Os 9 que precisam ser construídos genuinamente: `CpfCnpjInput`, `FieldArray`, `BottomNavigation`, `Ribbon`, `FileManager`, `InPlaceEditor`, `ArcGauge com ponteiro`, `SpeedDial`, `Ripple`, `SpeechToText`, `AiPromptInput`, `KeyboardShortcuts`.

---

*Auditado contra Mantine v9.0.0 em Abril/2026. Revisar a cada release major do Mantine e TanStack.*
