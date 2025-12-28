import type { CSSProperties, ReactNode } from 'react';
import type { DataGroup, DataItem, IdType } from 'vis-timeline/peer';

/**
 * Tipos de dados para itens da timeline
 */
export type TimelineItemType = 'box' | 'point' | 'range' | 'background';

/**
 * Item básico da timeline
 */
export interface TimelineItem {
  /** ID único do item */
  id: string | number;
  /** Conteúdo a ser exibido */
  content: string | ReactNode;
  /** Data/hora de início */
  start: Date | string | number;
  /** Data/hora de fim (para ranges) */
  end?: Date | string | number;
  /** Tipo do item */
  type?: TimelineItemType;
  /** Grupo ao qual pertence */
  group?: string | number;
  /** ClassName customizado */
  className?: string;
  /** Estilo inline */
  style?: CSSProperties;
  /** Tooltip */
  title?: string;
  /** Editável */
  editable?: boolean;
  /** Dados adicionais */
  data?: any;
}

/**
 * Grupo da timeline
 */
export interface TimelineGroup {
  /** ID único do grupo */
  id: string | number;
  /** Conteúdo do grupo */
  content: string | ReactNode;
  /** Order do grupo */
  order?: number;
  /** ClassName customizado */
  className?: string;
  /** Estilo inline */
  style?: CSSProperties;
  /** Título */
  title?: string;
}

/**
 * Opções de zoom da timeline
 */
export interface TimelineZoomOptions {
  /** Zoom mínimo (ms por pixel) */
  min?: number;
  /** Zoom máximo (ms por pixel) */
  max?: number;
  /** Habilitar zoom com scroll */
  zoomKey?: string | null;
}

/**
 * Opções de movimento (pan)
 */
export interface TimelineMoveOptions {
  /** Habilitar movimento arrastando */
  moveable?: boolean;
  /** Habilitar movimento com setas */
  moveOnKey?: boolean;
}

/**
 * Configuração de orientação da timeline
 */
export type TimelineOrientation = 'bottom' | 'top' | 'none' | 'both';

/**
 * Modo de layout
 */
export type TimelineLayout = 'box' | 'list';

/**
 * Opções de formatação de data
 */
export interface TimelineDateFormatOptions {
  /** Formato para datas longas */
  long?: string;
  /** Formato para datas curtas */
  short?: string;
  /** Locale para formatação */
  locale?: string;
}

/**
 * Eventos da timeline
 */
export interface TimelineEvents {
  /** Ao clicar em um item */
  onItemClick?: (item: TimelineItem) => void;
  /** Ao clicar duas vezes em um item */
  onItemDoubleClick?: (item: TimelineItem) => void;
  /** Ao clicar no fundo */
  onCanvasClick?: (time: Date) => void;
  /** Ao clicar duas vezes no fundo */
  onCanvasDoubleClick?: (time: Date) => void;
  /** Ao alterar a seleção */
  onSelect?: (items: TimelineItem[] | TimelineGroup[]) => void;
  /** Ao mudar o range visível */
  onRangeChange?: (start: Date, end: Date) => void;
  /** Ao arrastar um item */
  onItemDrag?: (item: TimelineItem, callback: () => void) => void;
  /** Ao mover um item */
  onItemMove?: (item: TimelineItem, callback: () => void) => void;
  /** Ao remover um item */
  onItemRemove?: (item: TimelineItem, callback: () => void) => void;
  /** Ao adicionar um item */
  onItemAdd?: (item: TimelineItem, callback: () => void) => void;
  /** Ao mudar os grupos */
  onGroupDrag?: (group: TimelineGroup, callback: () => void) => void;
}

/**
 * Props do componente ArchbaseVisTimeline
 */
export interface ArchbaseVisTimelineProps<T extends TimelineItem = TimelineItem> {
  /** Itens da timeline */
  items?: T[];
  /** Grupos da timeline */
  groups?: TimelineGroup[];
  /** Opções da timeline */
  options?: TimelineOptions;

  /** --- Dados --- */
  /** Período inicial */
  start?: Date | string | number;
  /** Período final */
  end?: Date | string | number;
  /** Período inicial e final */
  range?: [Date | string | number, Date | string | number];

  /** --- Layout --- */
  /** Largura */
  width?: string | number;
  /** Altura */
  height?: string | number;
  /** Altura mínima */
  minHeight?: string | number;
  /** Orientação da timeline */
  orientation?: TimelineOrientation;
  /** Modo de layout */
  layout?: TimelineLayout;

  /** --- Funcionalidades --- */
  /** Habilitar edição de itens */
  editable?: boolean | { updateTime?: boolean; updateGroup?: boolean; add?: boolean; remove?: boolean };
  /** Habilitar seleção */
  selectable?: boolean;
  /** Seleção múltipla */
  multiselect?: boolean;
  /** Habilitar zoom */
  zoomable?: boolean | TimelineZoomOptions;
  /** Habilitar movimento */
  moveable?: boolean | TimelineMoveOptions;
  /** Mostrar linha de tempo atual */
  showCurrentTime?: boolean;
  /** Mostrar barra de zoom personalizada */
  showCustomTime?: boolean;
  /** Mostrar dados em milissegundos */
  showMajorLabels?: boolean;
  /** Mostrar labels menores */
  showMinorLabels?: boolean;

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;
  /** Cor de fundo */
  backgroundColor?: string;
  /** Cor dos itens */
  itemColor?: string;
  /** Cor dos grupos */
  groupColor?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;
  noData?: ReactNode;

  /** --- Eventos --- */
  onLoad?: () => void;
  onError?: (error: Error) => void;
  /** Eventos customizados da timeline */
  on?: TimelineEvents;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  title?: string;

  /** --- Outros --- */
  /** Ref para o elemento da timeline */
  timelineRef?: React.RefObject<any> | ((instance: any) => void);
}

/**
 * Opções completas da timeline (estilo vis-timeline)
 */
export interface TimelineOptions {
  /** Altura */
  height?: string | number;
  /** Largura */
  width?: string | number;
  /** Altura mínima */
  minHeight?: string | number;
  /** Largura mínima */
  minWidth?: string | number;
  /** Orientação */
  orientation?: TimelineOrientation;
  /** Direção */
  direction?: 'past' | 'future';
  /** Auto-redimensionar */
  autoResize?: boolean;
  /** Modo de layout */
  layout?: TimelineLayout;
  /** Margem entre itens */
  margin?: {
    item?: { horizontal: number; vertical: number };
    axis?: number;
  };
  /** Padding */
  padding?: number;
  /** Scrollbars */
  showTooltips?: boolean;
  /** Tooltip follows mouse */
  tooltipOnItemUpdateTime?: boolean | { followMouse: boolean };
  /** Zoom */
  zoomKey?: string;
  /** Zoom min/max */
  zoomMin?: number;
  zoomMax?: number;
  /** Move */
  moveable?: boolean;
  /** Move on key */
  moveOnKey?: boolean;
  /** Group editável */
  groupEditable?: boolean;
  /** Edições */
  editable?: boolean | {
    add?: boolean;
    remove?: boolean;
    updateTime?: boolean;
    updateGroup?: boolean;
    overrideItems?: boolean;
  };
  /** Seleção */
  selectable?: boolean;
  /** Seleção múltipla */
  multiselect?: boolean;
  /** Multi select por grupos */
  multiselectPerGroup?: boolean;
  /** Linha de tempo atual */
  showCurrentTime?: boolean;
  /** Tempo customizado */
  showCustomTime?: boolean;
  /** Locale */
  locale?: string;
  /** Formatos de data */
  format?: TimelineDateFormatOptions | {
    minorLabels: any;
    majorLabels: any;
  };
  /** Moment locale */
  moment?: (locale: string) => any;
  /** Click para usar */
  clickToUse?: boolean;
  /** Show background para grupos */
  groupOrder?: string | ((a: any, b: any) => number);
  /** Snap */
  snap?: ((date: Date, scale: string, step: number) => Date) | null;
  /** Stack */
  stack?: boolean;
  /** Throttle redrawing */
  throttleRedraw?: number;
  /** Visible frame template */
  visibleFrameTemplate?: (item: any) => string;
  /** Horizontal scroll */
  horizontalScroll?: boolean;
  /** Vertical scroll */
  verticalScroll?: boolean;
}
