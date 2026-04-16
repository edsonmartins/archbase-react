# Archbase React v3 - Catálogo de Componentes

## Sumário

| Pacote | Componentes | Descrição |
|--------|:-----------:|-----------|
| @archbase/admin | ~25 | Layout administrativo, sidebar, navegação |
| @archbase/components | ~150+ | Editores, grids, viewers, feedback, filtros |
| @archbase/advanced | ~5 | Query builder, kanban |
| @archbase/layout | ~15 | Containers, dock, grid/space layout |
| @archbase/core | ~10 | Utilitários, validação, i18n, IoC |
| @archbase/data | ~10 | DataSource, API services, hooks |
| @archbase/template | ~10 | Templates de páginas e formulários |
| @archbase/security | ~10 | Autenticação, autorização, providers |
| @archbase/security-ui | ~8 | Modais e views de gestão de segurança |
| @archbase/ssr | ~5 | Server-side rendering |
| @archbase/feature-flags | ~3 | Feature flags e variantes |
| @archbase/tools | ~12 | Ferramentas de desenvolvimento e debug |

---

## 1. @archbase/admin

Componentes de layout administrativo com sidebar, header, navegação e ações.

### Layout Principal

| Componente | Descrição |
|------------|-----------|
| `ArchbaseAdminMainLayout` | Layout principal do painel administrativo com sidebar, header e área de conteúdo |
| `ArchbaseAdminLayoutHeader` | Header do layout administrativo com ações e navegação |
| `ArchbaseAdminLayoutFooter` | Footer do layout administrativo |
| `ArchbaseAdminTabContainer` | Container de abas para gerenciamento de múltiplas views abertas |
| `ArchbaseAdminLayoutContext` | Context provider para estado global do layout |

### Sidebar

| Componente | Descrição |
|------------|-----------|
| `ArchbaseMantineSidebar` | Sidebar moderna baseada em Mantine com múltiplas variantes |
| `StandardSidebar` | Variante padrão da sidebar com menu expandido |
| `MinimalSidebar` | Variante minimalista da sidebar |
| `RailSidebar` | Variante rail (apenas ícones) da sidebar |
| `SidebarItem` | Item individual de menu na sidebar |
| `SidebarGroup` / `SidebarSection` | Agrupamento de itens de menu |
| `SidebarSearch` | Campo de busca dentro da sidebar |
| `SidebarUserProfile` | Exibição de perfil do usuário na sidebar |
| `SidebarBadge` / `SidebarIndicator` | Badges e indicadores visuais |
| `SidebarGroupIcon` | Ícone para grupos de menu |
| `SidebarMenuSkeleton` | Skeleton de carregamento para menu |
| `SidebarGroupsSkeleton` | Skeleton de carregamento para grupos |
| `SidebarHeaderSkeleton` | Skeleton de carregamento para header |
| `SidebarUserProfileSkeleton` | Skeleton de carregamento para perfil |
| `SidebarErrorMessage` | Exibição de mensagem de erro na sidebar |

### Ações do Header

| Componente | Descrição |
|------------|-----------|
| `ArchbaseChangeLanguageAction` | Ação para troca de idioma |
| `ArchbaseColorSchemeAction` | Ação para troca de tema claro/escuro |
| `ArchbaseHeaderNavAction` | Ação de navegação no header |
| `CommandPaletteButton` | Botão de paleta de comandos (spotlight search) |

### Outros

| Componente | Descrição |
|------------|-----------|
| `ArchbaseMyProfileModal` | Modal de perfil do usuário |
| `ArchbaseNavigationProgress` | Indicador de progresso de navegação |
| `ArchbaseAliveAbleRoutes` | Componente de rotas keep-alive |
| `ArchbaseKeepAliveRoute` | Rota individual keep-alive |
| `ArchbaseDrawerContent` / `ArchbaseDrawerTrigger` | Componentes de drawer lateral |

### Hooks

| Hook | Descrição |
|------|-----------|
| `useSidebar` | Acessa o contexto da sidebar |
| `useSidebarOptional` | Acessa opcionalmente o contexto da sidebar |
| `useSidebarNavigation` | Navegação da sidebar |
| `useSidebarSearch` | Busca na sidebar |
| `useSidebarKeyboard` | Atalhos de teclado da sidebar |

---

## 2. @archbase/components

Maior pacote do monorepo com 150+ componentes de UI para formulários, grids, visualização e feedback.

### Editores de Formulário

| Componente | Descrição |
|------------|-----------|
| `ArchbaseEdit` | Componente base de edição de texto |
| `ArchbaseCheckbox` | Checkbox com binding a datasource |
| `ArchbaseDatePickerEdit` | Seletor de data |
| `ArchbaseDateTimePickerEdit` | Seletor de data e hora |
| `ArchbaseDatePickerRange` | Seletor de intervalo de datas |
| `ArchbaseDateTimePickerRange` | Seletor de intervalo de data e hora |
| `ArchbaseTimeEdit` | Editor de hora |
| `ArchbaseAsyncSelect` | Select com carregamento assíncrono de opções |
| `ArchbaseAsyncMultiSelect` | Multi-select assíncrono |
| `ArchbaseSelect` | Select/dropdown básico |
| `ArchbaseSelectItem` | Item de opção do select |
| `ArchbaseTreeSelect` | Select hierárquico em árvore |
| `ArchbaseChip` | Componente chip/tag |
| `ArchbaseChipGroup` | Grupo de chips |
| `ArchbaseChipItem` | Item individual de chip |
| `ArchbaseColorPicker` | Seletor de cor |
| `ArchbaseDualListbox` | Seletor de lista dupla (mover itens entre listas) |
| `ArchbaseImageEdit` | Editor de imagem |
| `ArchbaseAvatarEdit` | Upload e edição de avatar |
| `ArchbaseJsonEdit` | Editor de JSON com syntax highlighting |
| `ArchbaseLookupEdit` | Campo de busca com lookup |
| `ArchbaseLookupNumber` | Lookup numérico |
| `ArchbaseLookupSelect` | Lookup com select integrado |
| `ArchbaseMaskEdit` | Campo com máscara de entrada |
| `ArchbaseNumberEdit` | Campo numérico |
| `ArchbasePasswordEdit` | Campo de senha |
| `ArchbaseRadioGroup` | Grupo de radio buttons |
| `ArchbaseRadioItem` | Radio button individual |
| `ArchbaseRating` | Componente de avaliação (estrelas) |
| `ArchbaseRichTextEdit` | Editor de texto rico (WYSIWYG) |
| `ArchbaseMarkdownEdit` | Editor de markdown |
| `ArchbaseSwitch` | Toggle/switch on-off |
| `ArchbaseTextArea` | Campo de texto multilinha |
| `ArchbaseCronExpressionEditor` | Editor visual de expressões cron |
| `ArchbaseCronExpressionEdit` | Editor simplificado de cron |
| `ArchbaseKeyValueEditor` | Editor de pares chave-valor |
| `ArchbaseTimeRangeSelector` | Seletor de intervalo de horário |
| `ArchbaseOperatingHoursEditor` | Editor de horários de funcionamento |
| `ArchbaseCountdownProgress` | Barra de progresso com contagem regressiva |
| `ArchbaseFileAttachment` | Upload de arquivos com anexos |
| `ArchbaseTagInput` | Campo de entrada de tags |
| `ArchbasePhoneInput` | Campo de telefone com formatação |
| `ArchbaseMultiEmail` | Campo para múltiplos e-mails |
| `ArchbaseMentionInput` | Campo com menções (@) |
| `ArchbaseSignaturePad` | Pad de assinatura digital |
| `ArchbaseBarcodeScanner` | Scanner de código de barras |
| `ArchbaseSpreadsheet` | Planilha/grid editável |
| `ArchbaseLightGrid` | Grid leve e performático |
| `ArchbaseThemeEditor` | Editor visual de tema |

### Botões

| Componente | Descrição |
|------------|-----------|
| `ArchbaseActionButtons` | Grupo de botões de ação |
| `ArchbaseButton` | Botão (wrapper Mantine) |
| `ArchbaseActionIcon` | Botão de ícone (wrapper Mantine) |

### DataGrid

| Componente | Descrição |
|------------|-----------|
| `ArchbaseDataGrid` | Grid de dados principal com ordenação, filtros e paginação |
| `ArchbaseDataGridColumn` | Definição de coluna do grid |
| `ArchbaseDataGridToolbar` | Barra de ferramentas do grid |
| `ArchbaseDataGridPagination` | Controle de paginação do grid |
| `ArchbaseDetailPanel` | Painel de detalhes expansível em linha |
| `ArchbaseDetailModal` | Modal de detalhes ao expandir linha |
| `ArchbaseDetailDrawer` | Drawer de detalhes ao expandir linha |
| `ArchbaseDetailPopover` | Popover de detalhes ao passar o mouse |
| `ArchbaseDetailHoverCard` | Card de detalhes ao passar o mouse |
| `ArchbaseExpandButton` | Botão para expandir linha |
| `ArchbaseGridRowActions` | Botões de ação por linha |
| `GlobalSearchInput` | Campo de busca global do grid |
| `ArchbaseItemRender` | Renderizador customizado de itens |

### Lista e Árvore

| Componente | Descrição |
|------------|-----------|
| `ArchbaseList` | Componente de lista com binding a datasource |
| `ArchbaseListItem` | Item da lista |
| `ArchbaseListContext` | Context provider da lista |
| `ArchbaseListViewTable` | Visualização de lista em formato tabular |
| `ArchbaseTreeView` | Visualização em árvore hierárquica |

### Exibição

| Componente | Descrição |
|------------|-----------|
| `ArchbaseQRCode` | Gerador de QR Code |
| `ArchbaseDiffViewer` | Visualizador de diferenças de texto/código |
| `ArchbaseJsonTree` | Árvore de visualização JSON |
| `ArchbaseCodeViewer` | Visualizador de código com syntax highlighting |
| `ArchbaseText` | Texto (wrapper Mantine) |
| `ArchbaseTitle` | Título (wrapper Mantine) |
| `ArchbaseBadge` | Badge/etiqueta (wrapper Mantine) |
| `ArchbaseMantineImage` | Imagem (wrapper Mantine) |

### Charts e Timeline

| Componente | Descrição |
|------------|-----------|
| `ArchbaseTimeline` | Linha do tempo de eventos |
| `ArchbaseGantt` | Gráfico de Gantt para planejamento de projetos |
| `ArchbaseResourceTimeline` | Timeline de recursos baseada em vis-timeline |

### Feedback

| Componente | Descrição |
|------------|-----------|
| `ArchbaseAlert` | Alerta/mensagem de notificação |
| `ArchbaseDialog` | Diálogo/modal de confirmação |
| `CustomShowErrorModal` | Modal de exibição de erro |
| `ArchbaseNotifications` | Provider de notificações toast |
| `ArchbaseNotificationCenter` | Central de notificações |

### Filtros

| Componente | Descrição |
|------------|-----------|
| `ArchbaseCompositeFilters` | Construtor avançado de filtros compostos |
| `ArchbaseColumnSelector` | Seletor de visibilidade de colunas |
| `FilterPill` | Pill/chip de filtro ativo |

### Imagem

| Componente | Descrição |
|------------|-----------|
| `ArchbaseImage` | Componente de exibição de imagem |
| `ArchbaseImagePickerEditor` | Seletor e editor de imagem |
| `ArchbaseMicrosoftAvatar` | Avatar estilo Microsoft |

### Markdown

| Componente | Descrição |
|------------|-----------|
| `ArchbaseMarkdown` | Renderizador de markdown |
| `ArchbaseCodeBlock` | Bloco de código |
| `ArchbaseInlineCode` | Código inline |
| `ArchbaseLinkRenderer` | Renderizador de links para markdown |

### Masonry

| Componente | Descrição |
|------------|-----------|
| `ArchbaseMasonry` | Layout masonry (estilo Pinterest) |
| `ArchbaseMasonryResponsive` | Layout masonry responsivo |

### Navegação

| Componente | Descrição |
|------------|-----------|
| `ArchbaseNavLink` | Link de navegação (wrapper Mantine) |
| `ArchbaseBreadcrumbs` | Breadcrumbs/migalhas de pão (wrapper Mantine) |
| `ArchbasePagination` | Paginação (wrapper Mantine) |
| `ArchbaseFieldset` | Fieldset de formulário (wrapper Mantine) |

### Viewers e Documentos

| Componente | Descrição |
|------------|-----------|
| `ArchbasePDFViewer` | Visualizador de PDF com anotações |
| `ArchbasePDFViewerToolbar` | Toolbar do visualizador de PDF |
| `ArchbasePDFAnnotations` | Anotações em PDF |
| `ArchbasePDFAnnotationsList` | Lista de anotações do PDF |
| `ArchbaseXmlViewer` | Visualizador de XML |
| `ArchbasePdfBuilder` | Construtor de PDF (baseado em pdfme) |
| `ArchbaseDocViewer` | Visualizador de documentos genérico |

### Impressão

| Componente | Descrição |
|------------|-----------|
| `ArchbaseThermalPrinter` | Componente de impressão térmica |
| `QuickPrintButton` | Botão de impressão rápida |

### Vídeo

| Componente | Descrição |
|------------|-----------|
| `ArchbaseVideoPlayer` | Player de vídeo completo |

### JSON Schema

| Componente | Descrição |
|------------|-----------|
| `ArchbaseJsonSchemaEditor` | Editor visual de JSON Schema |

### Debug

| Componente | Descrição |
|------------|-----------|
| `ArchbaseJsonView` | Visualizador de JSON |
| `ArchbaseJsonPathPicker` | Seletor de JSONPath |
| `ArchbaseObjectInspector` | Inspetor de objetos |
| `ArchbaseDebugInspector` | Inspetor de debug |

### Onboarding

| Componente | Descrição |
|------------|-----------|
| `ArchbaseOnboardingTour` | Tour/walkthrough guiado para onboarding |

---

## 3. @archbase/advanced

Componentes avançados para construção de queries e kanban.

| Componente | Descrição |
|------------|-----------|
| `ArchbaseQueryBuilder` | Construtor visual de queries com suporte a RSQL |
| `ArchbaseQueryFilterDSL` | DSL para definição de filtros |
| `ArchbaseFilterOperator` | Operadores de filtro (igual, contém, entre, etc.) |
| `ArchbaseFilterCondition` | Condições de filtro compostas (AND/OR) |
| `ArchbaseRSQLConverter` | Conversor de filtros para RSQL |

---

## 4. @archbase/layout

Componentes de layout e containers para organização visual.

### Layout Básico

| Componente | Descrição |
|------------|-----------|
| `ArchbaseCard` | Card com sombra e bordas |
| `ArchbaseContainer` | Container/wrapper com largura máxima |
| `ArchbaseGroup` | Agrupamento horizontal de elementos |
| `ArchbaseStack` | Empilhamento vertical de elementos |

### Containers Avançados

| Componente | Descrição |
|------------|-----------|
| `ArchbaseDockableContainer` | Container dockable com drag-and-drop |
| `ArchbaseDockLayout` | Layout dock completo com painéis redimensionáveis |
| `ArchbaseDockLayoutPreset` | Presets salvos de layout dock |
| `ArchbaseFormContainer` | Container específico para formulários |
| `ArchbaseMosaicLayout` | Layout mosaico com painéis reorganizáveis |
| `ArchbaseResizableContainer` | Container com redimensionamento |
| `ArchbaseSplitPane` | Divisão de painéis (horizontal/vertical) |
| `ArchbaseWindowPanel` | Painel estilo janela com título e controles |

### Spaces/Grid

| Componente | Descrição |
|------------|-----------|
| `ArchbaseSpaceLayout` | Layout baseado em grid com áreas nomeadas |
| `ArchbaseSpaceItem` | Item dentro do space layout |

---

## 5. @archbase/core

Utilitários, serviços e hooks fundamentais (não são componentes visuais).

| Componente/Utilitário | Descrição |
|------------------------|-----------|
| `ArchbaseAppContext` | Context provider global da aplicação |
| `ArchbaseErrorBoundary` | Error boundary para captura de erros React |
| `ArchbaseExceptionHandler` | Handler centralizado de exceções |
| `ArchbaseValidator` | Framework de validação de dados |
| `ArchbaseLocalizer` / `ArchbaseI18n` | Internacionalização e localização |
| `ArchbaseIoCContainer` | Container de inversão de controle (IoC) |
| `ArchbaseRSQLBuilder` | Builder de queries RSQL |
| `ArchbaseRSQLParser` | Parser de queries RSQL |
| `ArchbaseJsonHelper` | Utilitários de manipulação JSON |
| `ArchbaseMask` | Utilitários de máscara de dados |

### Hooks

| Hook | Descrição |
|------|-----------|
| `useArchbaseAppContext` | Acessa o contexto global da aplicação |
| `useArchbaseForceUpdate` | Força re-renderização |
| `useArchbaseValidator` | Acessa o framework de validação |
| `useArchbaseLocalizer` | Acessa serviço de internacionalização |

---

## 6. @archbase/data

Camada de gerenciamento de dados e comunicação com APIs.

| Componente/Serviço | Descrição |
|---------------------|-----------|
| `ArchbaseDataSource` | DataSource v1 - gerenciamento de estado de dados |
| `ArchbaseDataSourceV2` | DataSource v2 com integração TanStack Query |
| `ArchbaseApiService` | Serviço base para chamadas de API REST |
| `ArchbaseRemoteApiService` | Serviço de API remota com cache |
| `ArchbaseRemoteDataSource` | DataSource com fetch remoto integrado |

### Hooks

| Hook | Descrição |
|------|-----------|
| `useArchbaseDataSource` | Cria e gerencia um DataSource |
| `useArchbaseRemoteDataSource` | DataSource com fetch automático |
| `useArchbaseDataSourceListener` | Listener de eventos do DataSource |
| `useArchbasePagination` | Gerenciamento de paginação |
| `useArchbaseQuery` | Hook de query com TanStack Query |
| `useArchbaseMutation` | Hook de mutation com TanStack Query |

---

## 7. @archbase/template

Templates pré-construídos para páginas e formulários.

| Componente | Descrição |
|------------|-----------|
| `ArchbaseFormTemplate` | Template completo de formulário CRUD |
| `ArchbaseFormModalTemplate` | Template de formulário em modal |
| `ArchbaseModalTemplate` | Template de modal genérico |
| `ArchbaseGridTemplate` | Template de grid/tabela com CRUD |
| `ArchbaseMasonryTemplate` | Template de layout masonry com CRUD |
| `ArchbasePanelTemplate` | Template de painel com CRUD |
| `ArchbaseSpaceTemplate` | Template de layout space/grid |
| `ArchbaseSearchTemplate` | Template de página de busca |
| `ArchbaseLookupDataTemplate` | Template de lookup de dados |
| `ArchbaseSmartActionButton` | Botão de ação inteligente contextual |
| `ArchbaseConditionalSecurityWrapper` | Wrapper condicional de segurança |
| `ArchbaseTemplateState` | Gerenciamento de estado dos templates |

---

## 8. @archbase/security

Autenticação, autorização e controle de acesso.

### Componentes

| Componente | Descrição |
|------------|-----------|
| `ArchbaseLogin` | Formulário de login |
| `ArchbaseResetPassword` | Formulário de reset de senha |
| `ArchbaseSecurityProvider` | Provider de contexto de segurança |
| `ArchbaseViewSecurityProvider` | Provider de segurança a nível de view |
| `ArchbaseProtectedComponent` | Wrapper de proteção de componente |
| `ArchbaseSecureActionButton` | Botão com verificação de permissão |
| `ArchbaseSecureFormField` | Campo de formulário com segurança |
| `withArchbaseSecurity` | HOC para adicionar segurança a componentes |

### Serviços

| Serviço | Descrição |
|---------|-----------|
| `ArchbaseAuthenticator` | Gerenciador de autenticação |
| `ArchbaseUserService` | Serviço de gerenciamento de usuários |
| `ArchbaseGroupService` | Serviço de gerenciamento de grupos |
| `ArchbaseProfileService` | Serviço de gerenciamento de perfis |
| `ArchbaseApiTokenService` | Serviço de tokens de API |
| `ArchbaseAccessTokenService` | Serviço de tokens de acesso |
| `ArchbaseResourceService` | Serviço de gerenciamento de recursos |
| `ArchbaseSecurityManager` | Gerenciador geral de segurança |
| `ArchbaseTenantManager` | Gerenciamento multi-tenant |
| `ArchbaseTokenManager` | Gerenciamento de tokens JWT |

---

## 9. @archbase/security-ui

Interfaces visuais para gerenciamento de segurança.

| Componente | Descrição |
|------------|-----------|
| `ArchbaseSecurityView` | View principal de gerenciamento de segurança |
| `ProfileModal` | Modal de gerenciamento de perfis |
| `UserModal` | Modal de gerenciamento de usuários |
| `GroupModal` | Modal de gerenciamento de grupos |
| `ApiTokenModal` | Modal de gerenciamento de tokens de API |
| `PermissionsSelectorModal` | Modal de seleção de permissões |
| `ArchbaseApiTokenView` | View de exibição de tokens de API |
| `ArchbaseDualListSelector` | Seletor dual-list de permissões |
| `RenderProfileUserItem` | Renderizador de item de usuário em perfil |

---

## 10. @archbase/ssr

Componentes e utilitários para Server-Side Rendering.

| Componente | Descrição |
|------------|-----------|
| `ArchbaseSSRProvider` | Provider para SSR com hidratação |
| `ClientOnly` | Renderiza conteúdo apenas no cliente |
| `ServerOnly` | Renderiza conteúdo apenas no servidor |
| `ArchbaseSSRDataSource` | DataSource compatível com SSR |
| `ArchbaseTanStackProvider` | Provider de integração TanStack para SSR |

### Hooks

| Hook | Descrição |
|------|-----------|
| `useArchbaseSSR` | Acessa contexto SSR |
| `useHydrationSafeState` | Estado seguro para hidratação |
| `useClientEffect` | useEffect apenas no cliente |
| `useSSRSafeMediaQuery` | Media query segura para SSR |

---

## 11. @archbase/feature-flags

Sistema de feature flags para ativação/desativação de funcionalidades.

| Componente | Descrição |
|------------|-----------|
| `ArchbaseFeatureFlagsProvider` | Provider de feature flags (integração Unleash) |
| `useArchbaseFeatureFlag` | Hook para verificar se uma feature está ativa |
| `useArchbaseVariant` | Hook para obter variante de teste A/B |

---

## 12. @archbase/tools

Ferramentas de desenvolvimento e depuração (não usar em produção).

| Componente | Descrição |
|------------|-----------|
| `ArchbaseConsoleLogger` | Logger avançado para console |
| `ArchbaseDebugPanel` | Painel de debug flutuante |
| `ArchbasePerformanceMonitor` | Monitor de performance em tempo real |
| `ArchbaseLocalStorageViewer` | Inspetor de localStorage |
| `ArchbaseNetworkMonitor` | Monitor de requisições de rede |
| `ArchbaseStateInspector` | Inspetor de estado da aplicação |
| `ArchbaseErrorBoundary` | Error boundary com detalhes de debug |
| `ArchbaseMemoryLeakDetector` | Detector de memory leaks |
| `ArchbaseDataSourceInspector` | Inspetor visual de DataSources |

### Hooks

| Hook | Descrição |
|------|-----------|
| `useArchbaseRenderTracker` | Rastreia re-renderizações de componentes |
| `useArchbaseWhyDidYouRender` | Identifica motivos de re-renderização |
| `useArchbaseDataSourceDebug` | Debug detalhado de DataSource |
| `useArchbaseDataSourceRegistry` | Registro global de DataSources |

---

## Estatísticas

- **Total de pacotes:** 12
- **Total de componentes React:** 200+
- **Editores de formulário:** 40+
- **Maior pacote:** @archbase/components (~150+ componentes)
- **Wrappers Mantine v9:** ~22 componentes
