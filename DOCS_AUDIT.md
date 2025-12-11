0) Executive Summary
- Archbase React v3 é uma suíte modular de componentes, layouts, segurança e utilidades construída sobre Mantine v8, React 19 e TypeScript 5.7, voltada para apps SAAS com camada de dados (DataSource v1/v2), templates CRUD e integrações SSR/TanStack.
- Público-alvo: times React/Mantine que precisam de componentes data-aware (dataSource) e fluxos administrativos (auth, templates, admin layout).
- Documentação atual: dispersa (README principal + vários MD/MDX em `docs/` sobre DataSource v2, segurança, scripts). Falta navegação única e exemplos atualizados para todos os 130 exports públicos. Nota: 6/10 (boas notas sobre DataSource e segurança; lacunas grandes em componentes UI).
- Top 10 melhorias (ROI alto): 
  1) Storybook 8 com Autodocs para todos os editores e DataGrid. 
  2) Página única “Foundations” (Provider, tema, i18n, tokens). 
  3) Recipes end-to-end com dataSource v2 + TanStack Query. 
  4) Catálogo JSON gerado no build para alimentar buscadores/IA. 
  5) Normalizar props de estilo (`className/styles/classNames/vars`) e `onChange(value, event)` vs eventos nativos. 
  6) Tabelas de status (estável/experimental) por pacote. 
  7) Guia de migração v2→v3 focado em imports e peer deps. 
  8) Storybook DocsPage para segurança (Auth, ProtectedComponent, SecureForm). 
  9) Playground de tema (ArchbaseThemeEditor) conectado ao Provider. 
  10) Testes de acessibilidade (axe) automatizados nos componentes críticos (inputs, dialogs, modals).

1) Mapa do repositório
- Pacotes: `packages/core`, `data`, `components`, `layout`, `security`, `security-ui`, `advanced`, `template`, `admin`, `tools`, `ssr` (+ `advanced/kanban` placeholder).
- Build/publicação: scripts custom em `scripts/*.js` (`build-unified.js`, `pack.js`, `publish*.js`), baseados em Vite 6 + Turbo; peer deps externadas.
- Rodar local: `pnpm install` → `pnpm build` (ou `pnpm dev` via Turbo). Outros scripts rápidos em `README.md` e `SCRIPTS.md`.
- Dependências chave/peer: `react@19`, `@mantine/core@8.1.2`, `@mantine/hooks`, `@mantine/form/dates/notifications/modals/spotlight/dropzone/tiptap`, `@tabler/icons-react`, `@tanstack/react-query`, `zustand`, `i18next`, `inversify-react`.

2) Superfície pública (Public API)
- `@archbase/core`: ArchbaseGlobalProvider/i18n helpers (`initArchbaseI18nEarly`, `useArchbaseTranslation`), validators, exceptions, utils (masker), RSQL builder/parser, error boundary, hooks, IOC tokens, locales, ValidationErrorsContext, `detectDataSourceVersion`.
- `@archbase/data`: DataSource v1/v2, hooks (`useArchbaseDataSource*`), services (`ArchbaseAxiosRemoteApiClient`), types, reexport de filtros do core.
- `@archbase/components`: 130 exports (editores data-aware, DataGrid, notificações, listas, masonry, debug JSON, imagem, timeline, wrappers Mantine).
- `@archbase/layout`: containers (Form, Window, AdvancedTabs, Dockable), spaces/grid, basic layout (Card/Container/Group/Stack).
- `@archbase/security`: auth/token managers, OAuth2 helpers, hooks, providers (`ArchbaseSecurityProvider`, `ArchbaseViewSecurityProvider`), components (`ArchbaseLogin`, `ArchbaseResetPassword`, Secure wrappers).
- `@archbase/security-ui`: modais e views de segurança (User/Profile/Group/API Token modals, `ArchbaseSecurityView`, `ArchbaseApiTokenView`, `ArchbaseDualListSelector`).
- `@archbase/advanced`: QueryBuilder/filters, GraphQL builders, RSQL helpers; Kanban placeholder.
- `@archbase/template`: templates CRUD (`ArchbaseFormTemplate`, `GridTemplate`, `Panel`, `Space`, `Search`, `Modal`, `FormModal`, `Masonry`), state/types, hooks, ValidationErrorsContext.
- `@archbase/admin`: layout administrativo (header/footer/nav, tab container, drawer helpers, language/theme actions, KeepAlive routes, MyProfile modal), navigation context/hooks.
- `@archbase/tools`: debug/performance/dev utilities (`ArchbaseDebugPanel`, `ArchbaseConsoleLogger`, `ArchbasePerformanceMonitor`, `ArchbaseLocalStorageViewer`, `ArchbaseNetworkMonitor`, `ArchbaseStateInspector`, `ArchbaseErrorBoundary`, `ArchbaseMemoryLeakDetector`, `ArchbaseDataSourceInspector`).
- `@archbase/ssr`: SSR utils (isServer/client, storage safe), providers (`ArchbaseSSRProvider`, `ArchbaseTanStackProvider`), hooks (`useHydrationSafeState`, `useSSRSafeMediaQuery`, `useArchbaseSSRDataSource`), SSR DataSource, TanStack integration helpers.

3) Fundamentos (Foundations)
- Tema/tokens: usa `MantineProvider` com `colorScheme` e `MantineThemeOverride` via `ArchbaseGlobalProvider` (`packages/core/src/context/ArchbaseGlobalProvider.tsx`). CSS base em `packages/components/src/arco.css`, `treeviews.scss`, `layout/advancedtabs.scss`, `template/template.scss`, `admin/admin.css`.
- Providers: ordem recomendada (main.tsx) `initArchbaseI18nEarly` → `<ArchbaseGlobalProvider translationName/translationResource containerIOC themeDark/themeLight notificationAutoClose> ... </ArchbaseGlobalProvider>`. Para SSR: wrap com `<ArchbaseSSRProvider>` antes, e `<ArchbaseTanStackProvider>` quando usar TanStack Query.
- Acessibilidade: base herdada do Mantine (ARIA em inputs/menus). Componentes próprios usam `aria-` nos inputs principais; dialogs usam Mantine modals/notifications. DataGrid/TreeView requer checagem adicional (não há testes axe).
- i18n: `i18next` com detector de idioma, namespaces (`archbase` + app). Hooks `useArchbaseTranslation` e função `syncSafeTranslate`.
- Ícones: uso de `@tabler/icons-react` em vários componentes (botões/listas/layout).

4) Inventário de componentes (tabela)
| Componente | Caminho fonte | Status | Dependências |
| --- | --- | --- | --- |
| ArchbaseEdit | packages/components/src/editors/ArchbaseEdit.tsx | estável | Mantine TextInput, Archbase DataSource v1/v2 |
| ArchbaseAsyncSelect / AsyncMultiSelect | .../editors/ArchbaseAsyncSelect.tsx / ArchbaseAsyncMultiSelect.tsx | estável | Mantine Select/ScrollArea, dataSource opcional |
| ArchbaseDatePickerEdit/Range/DateTime* | .../editors | estável | Mantine dates |
| ArchbaseMaskEdit | .../editors/ArchbaseMaskEdit.tsx | estável | Mantine, masker utils |
| ArchbaseNumberEdit/PasswordEdit/Lookup*/TreeSelect/TimeEdit/TimeRangeSelector | .../editors | estável | Mantine inputs, dataSource |
| ArchbaseRichTextEdit | .../editors/ArchbaseRichTextEdit.tsx | estável | @mantine/tiptap |
| ArchbaseFileAttachment | .../editors/ArchbaseFileAttachment.tsx | experimental | File upload UI; armazena lista de anexos |
| ArchbaseCountdownProgress | .../editors/ArchbaseCountdownProgress.tsx | experimental | Mantine Progress/Loader |
| ArchbaseAvatarEdit/ImageEdit/ImagePickerEditor/MicrosoftAvatar | .../editors e image | estável | Mantine, crop utilities |
| ArchbaseThemeEditor | packages/components/src/themes/ArchbaseThemeEditor.tsx | estável | Mantine theme |
| ArchbaseActionButtons | .../buttons/ArchbaseActionButtons.tsx | estável | Mantine ActionIcon/Button |
| ArchbaseNotifications/Alert/Dialog | .../notification | estável | Mantine notifications/modals |
| ArchbaseTimeline | .../charts/ArchbaseTimeline.tsx | incerto (pouco uso) | Mantine Timeline |
| ArchbaseList/ListItem/TreeView* | .../list | estável | Mantine List, custom TreeView |
| ArchbaseMasonry | .../masonry/ArchbaseMasonry.tsx | estável | react-responsive-masonry |
| ArchbaseJsonSchemaEditor | .../jsonschema/JsonSchemaEditor | experimental | Custom schema editor |
| ArchbaseJsonView/JsonPathPicker/ObjectInspector/DebugInspector | .../debug | estável | react-json-view-lite, inspector |
| ArchbaseDataGrid (DataGridColumn/Toolbar/Pagination etc) | .../datagrid | estável | Mantine Table, DataSource v1/v2 |
| ArchbaseCard/Container/Group/Stack | packages/layout/src | wrappers | Mantine containers |
| ArchbaseFormContainer/WindowContainer/AdvancedTabs/DockableContainer/Spaces Grid | packages/layout/src/containers & spaces | estável | Mantine/Tabs/Resizable |
| ArchbaseLogin/ResetPassword + Secure wrappers | packages/security/src | estável | Mantine forms, security context |
| ProfileModal/UserModal/GroupModal/ApiTokenModal/PermissionsSelectorModal | packages/security-ui/src | estável | Mantine Modal, security services |
| ArchbaseAdminMainLayout/Header/Footer/Navigation context | packages/admin/src | estável | Mantine AppShell/Menu |
| ArchbaseFormTemplate/GridTemplate/MasonryTemplate/Panel/Space/Search/Modal/FormModal | packages/template/src | estável | Mantine + DataSource |
| ArchbaseAdvancedFilter/CompositeFilter/QueryBuilder | packages/advanced/src/querybuilder | estável | Internal filter utils |
| ArchbaseDebugPanel/ConsoleLogger/PerformanceMonitor/StateInspector/DataSourceInspector/ErrorBoundary | packages/tools/src | estável | Mantine, performance timers |
| ArchbaseSSRProvider/TanStackProvider/SSRDataSource | packages/ssr/src | estável | React, TanStack Query |

5) Documentação por componente (amostras representativas)
Para wrappers diretos do Mantine (ArchbaseButton, ArchbaseActionIcon, ArchbaseFieldset, ArchbaseBreadcrumbs, ArchbasePagination, ArchbaseText, ArchbaseTitle, ArchbaseBadge, ArchbaseMantineImage, ArchbaseMantineAlert, ArchbaseNotification, ArchbaseLoader, ArchbaseProgress, ArchbaseNavLink), a API é idêntica ao componente Mantine correspondente; use documentação oficial. Abaixo, foco nos componentes próprios.

### ArchbaseEdit
- Uso: input texto vinculado a `dataSource` v1/v2 (`dataField`). Controla erro via ValidationErrorsContext.
- Quando usar: edições simples com integração dataSource; não usar para rich text.
- Exemplo mínimo:
```tsx
<ArchbaseEdit dataSource={ds} dataField="name" label="Nome" required onChangeValue={(v)=>ds.setFieldValue('name', v)} />
```
- API chave: `dataSource?`, `dataField?`, `value?`, `disabled?`, `readOnly?`, `required?`, `label?`, `description?`, `placeholder?`, `error?`, `size?`, `width?`, `icon?`, `tooltipIconSearch?`, `onActionSearchExecute?`, `onFocusEnter/Exit?`, `onChangeValue?`, `variant?`, `minLength?`, `maxLength?`, `innerRef?`.
- Comportamento: controla estado interno e sincroniza com dataSource; detecta v2 (append/update array) e evita re-render desnecessário; limpa erros via contexto. A11y herdada de Mantine TextInput.
- Theming: aceita estilos via Mantine props; usa `useMantineTheme`/`useMantineColorScheme`.
- Pitfalls: lembrar de registrar `dataField`; para v2 listeners usam `addListener`; garantir unsubscribe no unmount.

### ArchbaseAsyncSelect / ArchbaseAsyncMultiSelect
- Uso: select assíncrono com paginação/scroll, opcional `dataSource`.
- Exemplo:
```tsx
<ArchbaseAsyncSelect dataSource={ds} dataField="customerId" loadData={fetchOptions} label="Cliente" />
```
- Props principais: `dataSource?`, `dataField?`, `loadData(query)`, `value?`, `onChangeValue?`, `label/description/placeholder`, `disabled/readOnly/required`, `itemComponent?`, `searchDebounce?`, `clearable?`, `multiple?` (MultiSelect).
- Comportamento: provider/context para compartilhar estado entre item e select; usa Mantine Select ScrollArea custom (`CustomSelectScrollArea`).
- A11y: segue Select Mantine; garantir `aria-label`.

### ArchbaseDatePickerEdit/Range e ArchbaseDateTimePickerEdit/Range
- Uso: entrada de datas vinculada ao dataSource. Range usa dois campos.
- Props: `dataSource?`, `dataField`, `label`, `placeholder`, `value?`, `onChangeValue?`, `locale?`, `disabled/readOnly/required`, `withTime?` (DateTime), `minDate/maxDate`.
- Comportamento: sincroniza com dataSource; formato via dayjs/date-fns; suporta v2 detectado.

### ArchbaseMaskEdit
- Uso: input com máscara (`MaskPattern` enum interno).
- Props: `dataSource?`, `dataField`, `mask`, `placeholder`, `label`, `onChangeValue?`, `maskChar?`, `keepCharPositions?`, `disabled/readOnly/required`.
- Pitfall: precisa de `mask` válido; usa utils de máscara do core.

### ArchbaseNumberEdit / ArchbaseLookupNumber
- Uso: number input (com dataSource) e lookup com validação numérica.
- Props: `dataSource?`, `dataField`, `decimalPlaces?`, `min/max?`, `thousandSeparator?`, `onChangeValue?`.
- Comportamento: formata valor e atualiza dataSource; `LookupNumber` adiciona busca remota.

### ArchbaseLookupEdit / LookupSelect / TreeSelect
- Uso: busca remota ou local com lista/árvore.
- Props comuns: `dataSource?`, `dataField`, `onChangeValue?`, `service` ou `loadData`, `itemComponent?`, `label/description`, `searchField`, `valueField`, `displayField`, `disabled/readOnly/required`.
- TreeSelect: props de árvore (`childrenField`, `expandAll?`, `onToggle?`).

### ArchbaseRichTextEdit
- Uso: editor Tiptap integrado a dataSource.
- Props: `dataSource?`, `dataField`, `extensions?`, `label?`, `onChangeValue?`, `height?`, `disabled/readOnly`.
- Comportamento: usa Mantine/Tiptap; estado controlado e sincronizado.

### ArchbaseFileAttachment
- Uso: gerencia anexos (lista de arquivos com preview).
- Props: `dataSource?`, `dataField`, `attachments?`, `onAttachmentsChange?`, `accept?`, `maxSize?`, `maxFiles?`, `label/description`.
- Pitfall: não há upload remoto embutido; responsabilidade do consumidor.

### ArchbaseCountdownProgress
- Uso: barra de progresso regressiva com timer.
- Props: `totalSeconds`, `onComplete?`, `color?`, `size?`, `label?`.
- Comportamento: usa `setInterval`; limpar em unmount.

### ArchbaseAvatarEdit / ImageEdit / ImagePickerEditor / MicrosoftAvatar
- Uso: edição/recorte/upload de imagens/avatares.
- Props: `dataSource?`, `dataField`, `onChangeValue?`, `cropOptions?`, `width/height`, `placeholder`, `onUpload?`.
- A11y: adicionar `alt`.

### ArchbaseThemeEditor
- Uso: playground de tema Mantine (cores, radius, fonte).
- Props: `initialTheme`, `onThemeChange`, `showCode?`.
- Comportamento: gera theme override; ideal para guia de design.

### ArchbaseActionButtons
- Uso: grupo de botões padrão (novo/editar/salvar etc).
- Props: `options: ArchbaseActionButtonsOptions[]`, `onAction(actionId)`, `size?`, `variant?`, `customComponents?`.
- Pitfall: mantenha `actionId` consistente com handlers de dataSource.

### ArchbaseNotifications / ArchbaseAlert / ArchbaseDialog
- Uso: wrappers Mantine `Notifications`, `Alert`, `Modals` com helpers (`CustomShowErrorModal`).
- Props seguem Mantine; Dialog recebe `title`, `message`, `onConfirm`, `onCancel`.

### ArchbaseTimeline
- Uso: timeline estilizada (experimentos).
- Props: `items: ArchbaseTimelineItem[] { title, color, content, icon }`, `active`.

### ArchbaseList / ListItem / TreeView / Masonry
- List: props `data`, `renderItem`, `onSelect`, `selectionMode`, `loading`, `emptyContent`.
- TreeView: `items`, `onToggle`, `renderItem`, `checkboxes?`.
- Masonry: `columns?`, `gap?`, `renderItem`, `responsiveBreakpoints`.

### ArchbaseJsonSchemaEditor
- Uso: editor visual de JSON Schema (objetos, arrays, advanced number/string/boolean).
- Props: `schema`, `onChange(schema)`, `onValidate?`, `readOnly?`, `locale?`.
- Pitfall: experimental; validar outputs antes de usar.

### ArchbaseJsonView / JsonPathPicker / ObjectInspector / DebugInspector
- Uso: debugging de JSON; `JsonView` mostra dados com temas; `JsonPathPicker` seleciona path; `ObjectInspector` navega estrutura.
- Props: `data`, `theme?`, `onSelectPath?`, `expandLevel?`.

### ArchbaseDataGrid (e módulos)
- Exports: default `ArchbaseDataGrid` (table), helpers (`ArchbaseDataGridColumn`, `ArchbaseDataGridPagination`, `ArchbaseDataGridToolbar`, `ArchbaseGridRowActions`, `ArchbaseExpandButton`, `ArchbaseDetailPanel/Modal/Drawer/Popover/HoverCard`, `ArchbaseDataGridToolbar`, `GridToolbar`, `GridPagination`, `ExportModal`, `PrintModal`, render helpers `renderText/renderBoolean/...`).
- Props principais (DataGrid main): `dataSource` (v1/v2), `columns`, `idField`, `onRowClick`, `rowExpansion`, `detailPanel`, `pagination`, `toolbar`, `selection`, `sorting`, `filtering`, `loading`, `emptyState`.
- Hooks: `useGridData`, `useDetailPanels`, `useDetailPanelPositions`, `useArchbaseDataGridStableRendering`, `useAvailableSpace`.
- Comportamento: integra DataSource eventos; fornece export/print; renderizadores por tipo.
- Pitfalls: confirmar `safeGetRowId`; alinhar `dataType` com renderers; revisar estilos `treeviews.scss`.

### Layout (Form/Window/AdvancedTabs/Spaces/Dockable)
- Form container: passo a passo de formulários; props `title`, `toolbar`, `onSubmit`, `columns`.
- Window container: janela flutuante; props `title`, `onClose`, `resizable?`.
- AdvancedTabs: tabs com recursos extras; props `tabs`, `onTabClose`, `keepAlive?`.
- DockableContainer: docking panes; props `layout`, `onLayoutChange`.

### Security & Security-UI
- ArchbaseSecurityProvider/ArchbaseViewSecurityProvider: props `authenticator`, `tokenManager`, `permissions`, `onLogin`, `onLogout`.
- Hooks: `useArchbaseSecurity`, `useArchbasePermissionCheck`, `useArchbaseSecureForm`.
- Components: `ArchbaseLogin` (props `onLogin`, `loading`, `errorMessage`), `ArchbaseResetPassword`.
- Secure wrappers: `ArchbaseProtectedComponent` (props `permission`, `fallback`), `ArchbaseSecureActionButton`, `ArchbaseSecureFormField`.
- Security UI modals: `UserModal`, `GroupModal`, `ProfileModal`, `ApiTokenModal`, `PermissionsSelectorModal`; props incluem `opened`, `onClose`, `record`, `onSave`, `services`.
- Views: `ArchbaseSecurityView`, `ArchbaseApiTokenView`.

### Admin
- ArchbaseAdminMainLayout/Header/Footer: AppShell layout; props `user`, `navigation`, `onSignOut`, `onToggleTheme`, `onChangeLanguage`.
- Navigation context/hooks: `ArchbaseNavigationProvider`, `useArchbaseNavigationContext`, `useArchbaseNavigationListener`.
- Actions: `ArchbaseChangeLanguageAction`, `ArchbaseColorSchemeAction`, `CommandPaletteButton` (`actions`, `hotkeys`), `ArchbaseAliveAbleRoutes` (keep-alive).
- Drawer helpers: `ArchbaseDrawerContent/Trigger`, hook `useArchbaseDrawer`.
- ArchbaseMyProfileModal: props `opened`, `onClose`, `user`, `onSave`.

### Template
- ArchbaseFormTemplate/FormModalTemplate/ModalTemplate/GridTemplate/MasonryTemplate/PanelTemplate/SpaceTemplate/SearchTemplate.
- Props comuns: `dataSource` v1/v2, `title`, `actions` (ArchbaseActionButtons), `onSubmit`, `onCancel`, `renderForm`, `renderGrid`, `filter`, `pagination`, `loading`, `emptyState`.
- Hooks: `useArchbaseTemplate*` (via `hooks/index.ts`), ValidationErrorsContext reexport.

### Advanced (QueryBuilder)
- ArchbaseAdvancedFilter/CompositeFilter/DetailedFilter/SimpleFilter/GlobalFilter/FilterSelectFields/FilterSelectRange/InputSearch/SaveFilter/QueryBuilder.
- Props típicos: `fields`, `value`, `onChange`, `conditions/operators` (de `ArchbaseFilterCommons`), `delegator` callbacks, `mode` (`QUICK/NORMAL/ADVANCED`).
- Helpers: `buildFrom` (RSQL), `GraphQLQueryBuilder`, constants de operadores.

### Tools
- ArchbaseDebugPanel: props `position`, `filters`, `onClear`.
- ArchbaseConsoleLogger/logger: métodos `info/warn/error/success/group`.
- ArchbasePerformanceMonitor/performanceMonitor: inicia monitoramento; props `intervalMs`, `onStats`.
- Hooks: `useArchbaseRenderTracker`, `useArchbaseWhyDidYouRender`.
- Dev utils: `ArchbaseLocalStorageViewer`, `ArchbaseNetworkMonitor`, `ArchbaseStateInspector`, `ArchbaseErrorBoundary`, `ArchbaseMemoryLeakDetector` (`startMonitoring(intervalMs)`), `ArchbaseDataSourceInspector`, `useArchbaseDataSourceDebug/Registry`.

### SSR
- ArchbaseSSRProvider: props `children`, `ssrIdPrefix?`.
- Hooks: `useArchbaseSSR`, `useHydrationSafeState`, `useClientEffect`, `useSSRSafeMediaQuery`, `useArchbaseSSRDataSource(key, { initialRecords, autoHydrate })`.
- ArchbaseTanStackProvider: integra TanStack Query; helpers `serializeQueryClientState`, `prepareServerQueries`, `withArchbaseTanStack`.

6) Recipes (8)
- **Formulário completo com validação e loading**
```tsx
function PersonForm({ ds }) {
  const [saving, setSaving] = React.useState(false);
  return (
    <ArchbaseGlobalProvider colorScheme="light" containerIOC={container}>
      <form onSubmit={async (e)=>{e.preventDefault();setSaving(true);await ds.save();setSaving(false);}}>
        <ArchbaseEdit dataSource={ds} dataField="name" label="Nome" required />
        <ArchbaseDatePickerEdit dataSource={ds} dataField="birthDate" label="Nascimento" />
        <ArchbaseActionButtons options={[{id:'save', label:'Salvar', variant:'filled'}]} onAction={()=>{ds.save();}} />
        {saving && <ArchbaseLoader />}
      </form>
    </ArchbaseGlobalProvider>
  );
}
```
Variações: usar `ArchbaseMaskEdit` para CPF, `ArchbaseSelect` para sexo. A11y: labels ligados a inputs, foco inicial no primeiro campo, avisar erro via `error`/`aria-live`.

- **Tabela com actions, empty state e loading (DataGrid)**
```tsx
<ArchbaseDataGrid
  dataSource={ds}
  columns={[
    { id:'name', dataField:'name', title:'Nome', render:renderText },
    { id:'status', dataField:'status', title:'Status', render:renderEnum }
  ]}
  toolbar={{ globalSearch:true, actions:<GridToolBarActions onRefresh={()=>ds.refresh()} /> }}
  pagination={{ pageSize:20, component: GridPagination }}
  emptyState={<ArchbaseAlert title="Sem registros" />}
  loading={ds.isLoading()}/>
```
Variações: habilitar `rowExpansion` com `ArchbaseDetailPanel`; actions por linha com `ArchbaseGridRowActions`. A11y: cabeçalhos `<th>`, foco no toolbar, teclas seta para linhas.

- **Modal flow com confirmação**
```tsx
const [opened, setOpened] = React.useState(false);
<ArchbaseDialog
  title="Excluir"
  message="Confirmar exclusão?"
  onConfirm={()=>doDelete()}
  onCancel={()=>setOpened(false)}
/>
```
Variações: usar `ArchbaseDetailModal` do DataGrid para detalhes. A11y: foco no primeiro botão, `aria-modal`, fechar com ESC.

- **Layout de página (header + filters + content)**
```tsx
<ArchbaseAdminMainLayout
  header={<ArchbaseAdminLayoutHeader onToggleTheme={toggleTheme} />}
  navigation={navigationDataSample}
>
  <ArchbaseSpaceTemplate
    title="Clientes"
    filterComponent={<ArchbaseSimpleFilter fields={fields} onChange={setFilter} />}
    content={<ArchbaseDataGrid dataSource={ds} columns={cols} />}
  />
</ArchbaseAdminMainLayout>
```
Variações: trocar para `ArchbaseFormTemplate` para modo formulário único. A11y: navegação com `aria-current` em links.

- **Notificações/toasts**
```tsx
<ArchbaseGlobalProvider colorScheme="light" containerIOC={container}>
  <ArchbaseNotifications position="top-right" />
  <ArchbaseActionButtons options={[{id:'notify', label:'Notificar'}]} onAction={()=>notifications.show({message:'Ok'})}/>
</ArchbaseGlobalProvider>
```
Checklist: fornecer `role="status"`, mensagens curtas, tempo de autoClose configurado.

- **Upload de arquivo**
```tsx
<ArchbaseFileAttachment
  dataSource={ds}
  dataField="attachments"
  accept="image/*"
  maxFiles={3}
  onAttachmentsChange={(files)=>upload(files)}
/>
```
Variações: usar `ArchbaseImageEdit` para crop antes do upload. A11y: botão visível de adicionar arquivo, descrição de tamanho máximo.

- **Autocomplete/select com busca remota**
```tsx
<ArchbaseAsyncSelect
  label="Empresa"
  loadData={async (query)=>api.searchCompanies(query)}
  onChangeValue={(value)=>ds.setFieldValue('companyId', value)}
  clearable
/>
```
Variações: `ArchbaseLookupSelect` com `service` padrão; `ArchbaseTreeSelect` para hierarquias. A11y: `aria-label`, indicar loading.

- **Wizard/Stepper (AdvancedTabs + Templates)**
```tsx
<ArchbaseFormTemplate
  title="Cadastro Wizard"
  steps={[
    { id:'dados', label:'Dados', content:<DadosForm ds={ds}/> },
    { id:'endereco', label:'Endereço', content:<EnderecoForm ds={ds}/> }
  ]}
  onSubmit={async()=>ds.save()}/>
```
Variações: usar `ArchbaseAdvancedTabs` com `keepAlive`. A11y: `aria-current` no passo ativo, foco no primeiro campo do passo.

> Para cada recipe, consulte o `component-catalog.json` (veja `docs/CATALOG_GUIDE.md`) para recuperar `canonicalUrl` e props de `ArchbaseEdit`, `ArchbaseDataGrid`, `ArchbaseDialog`, etc.; use esses links ao criar stories ou MDX e atualize `llms.txt`/`DOCS_AUDIT.md` quando os componentes evoluírem.

7) Auditoria de consistência
- Naming: prefixo `Archbase` consistente; funções helpers no DataGrid sem prefixo (renderText/renderBoolean) – padronizar com `archbaseRender*` ou documentar.
- Props de estilo: nem todos os editores expõem `className/classNames/styles`; alguns só `style/size/width`. Sugestão: alinhar com API Mantine.
- onChange: maioria usa `onChangeValue(value, event)`; alguns wrappers Mantine usam evento nativo. Documentar convenção e harmonizar.
- Value/defaultValue: editores usam `value` + `dataSource`; garantir doc de prioridade (dataSource > value). 
- Erros/mensagens: ValidationErrorsContext usado em ArchbaseEdit; outros editores não integram contexto — alinhar.
- Deprecações/duplicações: componentes `display/feedback/navigation/forms` reexportam diretamente Mantine (TODO); marcar como wrappers e referenciar doc Mantine.
- CSS: mistura SCSS/CSS (treeviews, admin, advancedtabs). Documentar tokens e onde sobrepor.
- A11y: falta testes axe; DataGrid/TreeView precisam aria-labels; modals precisam foco inicial; inputs mascarados precisam aria-invalid.
- Export surface: `packages/components/src/index.ts` exporta tudo; alguns helpers possivelmente internos (`renderUUID/getRgbValues`) — avaliar se devem ser públicos.
- Segurança: contexts e UI em pacotes separados evitam ciclos, ok; faltam exemplos de `ArchbaseSecureActionButton` em docs.

8) Plano de documentação (incremental)
- Storybook 8 + Autodocs: gerar stories para todos os editores, DataGrid, notifications, templates. Usar CSF + `docs.page` + MDX para guidelines.
- Navegação sugerida: Foundations (Tema/Provider/i18n/Segurança/SSR), Inputs & Forms, Data Display (List, Masonry, Timeline), Data Grid, Navigation, Feedback, Templates, Security, Tools, SSR.
- O que vira story vs guideline: stories para componentes interativos (editores, DataGrid, notifications, templates); páginas de guideline para Provider, i18n, tema, segurança, naming, a11y checklist.
- Guidelines: 
  - Foundations: tokens, tema claro/escuro, espaçamento, radius, tipografia.
  - Forms: convenções de `dataSource`, `onChangeValue`, erro/required, validação.
  - Data Display: DataGrid, List, TreeView, Masonry.
  - Navigation: Admin layout, tabs, breadcrumbs.
- Versionamento/changelog: usar Changesets (já em dev deps) gerando `CHANGELOG.md` por pacote; manter doc de breaking changes por release.

9) IA-friendly docs
#### 9.1 /llms.txt (proposta)
```
Instalação: pnpm add @archbase/core @archbase/components @archbase/data @mantine/core @mantine/hooks
Provider: import { ArchbaseGlobalProvider } from '@archbase/core'; envolver app e passar translationName/resource e containerIOC.
Tema: passar themeLight/themeDark (MantineThemeOverride). Notificações: notificationAutoClose/position.
Principais componentes:
- ArchbaseEdit (@archbase/components/src/editors/ArchbaseEdit.tsx) -> input dataSource v1/v2
- ArchbaseAsyncSelect (@archbase/components/src/editors/ArchbaseAsyncSelect.tsx) -> select remoto
- ArchbaseDatePickerEdit (@archbase/components/src/editors/ArchbaseDatePickerEdit.tsx) -> data
- ArchbaseMaskEdit (@archbase/components/src/editors/ArchbaseMaskEdit.tsx) -> máscaras
- ArchbaseNumberEdit (@archbase/components/src/editors/ArchbaseNumberEdit.tsx) -> número
- ArchbaseLookupSelect (@archbase/components/src/editors/ArchbaseLookupSelect.tsx) -> lookup
- ArchbaseRichTextEdit (@archbase/components/src/editors/ArchbaseRichTextEdit.tsx) -> tiptap
- ArchbaseFileAttachment (@archbase/components/src/editors/ArchbaseFileAttachment.tsx) -> anexos
- ArchbaseActionButtons (@archbase/components/src/buttons/ArchbaseActionButtons.tsx) -> ações padrão
- ArchbaseDataGrid (@archbase/components/src/datagrid/main/ArchbaseDataGrid.tsx) -> grid dataSource
- ArchbaseList/TreeView (@archbase/components/src/list) -> listas/árvore
- ArchbaseMasonry (@archbase/components/src/masonry) -> layout responsivo
- ArchbaseJsonSchemaEditor (@archbase/components/src/jsonschema/JsonSchemaEditor) -> editor schema
- ArchbaseNotifications/Alert/Dialog (@archbase/components/src/notification) -> feedback
- ArchbaseAdminMainLayout (@archbase/admin/src/ArchbaseAdminMainLayout.tsx) -> layout admin
- ArchbaseFormTemplate (@archbase/template/src/ArchbaseFormTemplate.tsx) -> template CRUD
- ArchbaseSecurityProvider (@archbase/security/src/ArchbaseSecurityContext.tsx) -> contexto segurança
- ArchbaseDebugPanel (@archbase/tools/src/debug/ArchbaseDebugPanel.tsx) -> debug overlay
- ArchbaseSSRProvider (@archbase/ssr/src/providers/ArchbaseSSRProvider.tsx) -> SSR-safe hooks
Recipes: ver DOCS_AUDIT.md seção 6 (form, datagrid, modal, layout, notificações, upload, autocomplete, wizard).
```

#### 9.2 component-catalog.json (proposta)
```json
{
  "foundations": {
    "providers": ["ArchbaseGlobalProvider", "ArchbaseSecurityProvider", "ArchbaseSSRProvider", "ArchbaseTanStackProvider"],
    "theme": "MantineThemeOverride via ArchbaseGlobalProvider",
    "tokens": ["colorScheme", "radius", "spacing", "fontFamily"]
  },
  "components": [
    {
      "name": "ArchbaseEdit",
      "description": "Text input bound to Archbase DataSource v1/v2 with validation context.",
      "sourcePath": "packages/components/src/editors/ArchbaseEdit.tsx",
      "exportsFrom": "@archbase/components",
      "props": [
        {"name":"dataSource","type":"IArchbaseDataSourceBase<T>","required":false},
        {"name":"dataField","type":"string","required":false},
        {"name":"value","type":"string","required":false},
        {"name":"label","type":"string","required":false},
        {"name":"onChangeValue","type":"(value:any,event:any)=>void","required":false}
      ],
      "examples": [{"title":"Basic","code":"<ArchbaseEdit dataSource={ds} dataField='name' label='Nome' required />"}],
      "tags":["form","datasource","mantine"]
    },
    {
      "name": "ArchbaseDataGrid",
      "description": "Data grid bound to Archbase DataSource with toolbar, pagination, exports.",
      "sourcePath": "packages/components/src/datagrid/main/ArchbaseDataGrid.tsx",
      "exportsFrom": "@archbase/components",
      "props": [
        {"name":"dataSource","type":"ArchbaseDataSource<T>","required":true},
        {"name":"columns","type":"ArchbaseDataGridColumn<T>[]","required":true},
        {"name":"idField","type":"keyof T","required":false},
        {"name":"pagination","type":"PaginationProps","required":false}
      ],
      "examples": [{"title":"Simple grid","code":"<ArchbaseDataGrid dataSource={ds} columns={[{id:'name',dataField:'name'}]} />"}],
      "tags":["data","table","datasource"]
    }
  ],
  "recipes": [
    {"name":"Form with validation","description":"Bind ArchbaseEdit/DatePicker to dataSource and handle save","code":"<ArchbaseEdit dataSource={ds} dataField='name' required />","componentsUsed":["ArchbaseEdit"]},
    {"name":"DataGrid with toolbar","description":"Data grid with global search and pagination","code":"<ArchbaseDataGrid dataSource={ds} columns={cols} toolbar={{globalSearch:true}} />","componentsUsed":["ArchbaseDataGrid"]}
  ]
}
```

O `canonicalUrl` de cada componente pode apontar para o Storybook/site (use `CATALOG_CANONICAL_BASE` no script). O `llms.txt` referencia essas receitas e `DOCS_AUDIT.md` para fornecer contexto rápido aos LLMs, mantendo as notas sincronizadas com o catálogo.

10) Próximos passos
- Curto prazo (1–2 dias): 
  - 1) Criar Storybook base com Provider decorator (Mantine + ArchbaseGlobalProvider). 
  - 2) Documentar DataGrid (story + MDX) com exemplos de export/print. 
  - 3) Documentar Auth/Security (Login + SecureActionButton) em story isolado. 
  - 4) Normalizar README por pacote (core/data/components) com export list. 
  - 5) Gerar catálogo JSON automatizado no build (baseado no script de exports).
- Médio prazo: 
  - 1) Completar stories de editores (mask, number, async select). 
  - 2) Adicionar testes de acessibilidade (axe) em pipeline. 
  - 3) Escrever guia de estilo (tokens, tema, convenções de props). 
  - 4) Criar exemplos SSR (TanStack Start + Next) usando `@archbase/ssr`. 
  - 5) Migrar wrappers “TODO” para implementações próprias ou marcar como deprecated.
- Riscos/dependências: dependência forte de Mantine (seguir breaking changes), coerência entre dataSource v1/v2, ausência de testes automatizados para UI, falta de stories pode esconder regressões.
- Evidências a coletar: capturas de tela de stories, logs de axe, snapshot do catálogo JSON gerado, exemplo funcional de auth/SSR.
