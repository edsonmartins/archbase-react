# Archbase React v4.0.0 - Mantine 9 Migration 🚀

Esta é uma versão major que marca a migração completa para **Mantine 9.1.1** e inclui **~60 novos componentes**.

## ⚡ Breaking Changes

### Mantine 9 Migration
- **Grid**: `gutter` prop foi renomeada para `gap`
- **Text**: `color` prop foi renomeada para `c`
- **Collapse**: `in` prop foi renomeada para `expanded`
- **Select**: Assinatura de `onChange` atualizada

### Dependências Atualizadas
- `@mantine/core`: 8.x → **9.1.1**
- `@mantine/hooks`: 8.x → **9.1.1**
- `@mantine/dates`: 8.x → **9.1.1**
- `@mantine/modals`: 8.x → **9.1.1**
- `@mantine/notifications`: 8.x → **9.1.1**
- `@mantine/spotlight`: 8.x → **9.1.1**
- `react`: suporte para **React 19.2.x**

## ✨ Novos Componentes (~60)

### Editores de Entrada
| Componente | Descrição |
|------------|-----------|
| `ArchbaseAIPromptInput` | Input com integração para prompts de IA |
| `ArchbaseBarcodeScanner` | Scanner de código de barras via câmera |
| `ArchbaseCepInput` | Input de CEP com máscara e validação |
| `ArchbaseColorGradientPicker` | Seletor de gradientes de cores |
| `ArchbaseCpfCnpjInput` | Input de CPF/CNPJ com validação |
| `ArchbaseCurrencyInput` | Input monetário com formatação |
| `ArchbaseDualListbox` | Seleção com duas listas (disponíveis/selecionados) |
| `ArchbaseInPlaceEditor` | Editor inline (clique para editar) |
| `ArchbaseLightGrid` | Grid leve para edição tabular |
| `ArchbaseMentionInput` | Input com menções (@usuário) |
| `ArchbaseMultiEmail` | Editor de múltiplos emails |
| `ArchbaseMultiViewCalendar` | Calendário com múltiplas visualizações |
| `ArchbaseNumberStepper` | Input numérico com incremento/decremento |
| `ArchbaseOTPInput` | Input para códigos OTP (verificação) |
| `ArchbaseOperationHoursEditor` | Editor de horários de funcionamento |
| `ArchbasePhoneInput` | Input de telefone com máscara internacional |
| `ArchbaseRangeSlider` | Slider de intervalo |
| `ArchbaseSignaturePad` | Captura de assinatura digital |
| `ArchbaseSpeechToTextInput` | Input com reconhecimento de voz |
| `ArchbaseSpreadsheet` | Planilha completa com fórmulas |
| `ArchbaseTagInput` | Editor de tags com autocomplete |

### Visualização de Dados
| Componente | Descrição |
|------------|-----------|
| `ArchbaseBarcodeGenerator` | Gerador de códigos de barras (EAN13, EAN8, UPC, CODE128) |
| `ArchbaseCodeViewer` | Visualizador de código com syntax highlighting |
| `ArchbaseDiffViewer` | Comparador de diferenças de código |
| `ArchbaseJsonTree` | Visualizador de JSON em árvore |
| `ArchbaseQRCode` | Gerador de QR Codes |
| `ArchbaseXmlViewer` | Visualizador de XML |

### Gráficos e Métricas
| Componente | Descrição |
|------------|-----------|
| `ArchbaseArcGauge` | Gauge em arco (medidores circulares) |
| `ArchbaseGantt` | Gráfico de Gantt para cronogramas |
| `ArchbaseLinearGauge` | Gauge linear (barras de progresso avançadas) |
| `ArchbaseResourceTimeline` | Timeline de recursos (vis-timeline) |
| `ArchbaseSparkline` | Mini gráficos inline |

### Navegação
| Componente | Descrição |
|------------|-----------|
| `ArchbaseActionSheet` | Menu de ações deslizante (mobile-friendly) |
| `ArchbaseAppBar` | Barra de aplicação com ações |
| `ArchbaseBottomNavigation` | Navegação inferior (mobile) |
| `ArchbaseContextMenu` | Menu de contexto (clique direito) |
| `ArchbaseKeyboardShortcuts` | Sistema de atalhos de teclado |
| `ArchbaseSpeedDial` | Botão flutuante com ações rápidas |
| `ArchbaseSpotlight` | Busca global com atalhos |

### Containers e Layout
| Componente | Descrição |
|------------|-----------|
| `ArchbaseExpansionPanel` | Painéis expansíveis (accordion) |
| `ArchbaseFloatingPanel` | Painel flutuante arrastável |

### Formulários
| Componente | Descrição |
|------------|-----------|
| `ArchbaseFieldArray` | Array de campos dinâmicos |
| `ArchbaseFormWizard` | Assistente de formulário multi-etapas |
| `ArchbaseStepper` | Indicador de progresso em etapas |

### Feedback e UX
| Componente | Descrição |
|------------|-----------|
| `ArchbaseAnimationWrapper` | Wrapper para animações (fade, slide, etc.) |
| `ArchbaseChunkProgressBar` | Barra de progresso em chunks |
| `ArchbaseMarquee` | Texto rolante (marquee) |
| `ArchbaseNotificationCenter` | Central de notificações |
| `ArchbaseOnboardingTour` | Tour de introdução ao sistema |
| `ArchbaseRipple` | Efeito ripple (Material Design) |
| `ArchbaseSkeleton` | Skeletons para DataGrid, Form, Card, Kanban, List |
| `ArchbaseTooltipRich` | Tooltip avançado com conteúdo rico |

### Visualizadores
| Componente | Descrição |
|------------|-----------|
| `ArchbaseCarousel` | Carrossel de imagens/cards |
| `ArchbaseDocViewer` | Visualizador de documentos |
| `ArchbaseLightbox` | Visualizador de imagens em tela cheia |
| `ArchbasePdfBuilder` | Construtor de PDF |
| `ArchbasePhotoAlbum` | Álbum de fotos com layout responsivo |

### Listas e Dados
| Componente | Descrição |
|------------|-----------|
| `ArchbaseColumnSelector` | Seletor de colunas para grids |
| `ArchbaseDataGridExcelExport` | Exportação de DataGrid para Excel |
| `ArchbaseTreeList` | Lista em árvore hierárquica |
| `ArchbaseVirtualList` | Lista virtualizada para grandes volumes |

## 🔧 Melhorias Existentes

### ArchbaseImageEdit
- Integração com `react-image-picker-editor`
- Suporte a codificação/decodificação automática de base64
- Correções de SSR

### ArchbaseMultiSelect
- Nova opção de ordenação

### ArchbaseLogin
- Novas props para customização
- Correções no "Remember Me"

### Segurança (Security UI)
- Opção para alterar largura das colunas de ação
- Opção de adicionar ações customizadas nas tabelas
- Pré-preenchimento de perfil e grupos padrões na criação de usuário

### Templates
- `tabsVariant` padrão alterado para `outline` no TwoColumnFormTemplate

## 📚 Documentação

- 22+ novas páginas MDX de documentação
- 22+ novos demos para o docs-site
- Catálogo de componentes atualizado
- 8 novas rotas de página

## 🔒 Segurança

- GitHub Actions pinadas por SHA para mitigar ataques supply chain

## 📦 Migração

### De v3.x para v4.0.0

1. Atualize todas as dependências `@mantine/*` para `9.1.1`
2. Substitua `gutter` por `gap` em componentes Grid
3. Substitua `color` por `c` em componentes Text
4. Substitua `in` por `expanded` em componentes Collapse
5. Verifique handlers `onChange` de Select

### Exemplo de migração Grid:

```tsx
// Antes (v3.x)
<Grid gutter="md">

// Depois (v4.0.0)
<Grid gap="md">
```

---

**Full Changelog**: https://github.com/edsonmartins/archbase-react/compare/v3.0.25...v4.0.0
