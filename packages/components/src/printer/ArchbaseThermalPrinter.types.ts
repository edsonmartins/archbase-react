import type { CSSProperties, ReactNode } from 'react';

/**
 * Larguras de papel em mm
 */
export type PaperWidth = 58 | 80 | 112;

/**
 * Alinhamento do texto
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Estilo de barra
 */
export type BarStyle = 'single' | 'double' | 'dashed';

/**
 * Tamanhos de fonte (8dots/mm)
 */
export type FontSize = 'normal' | 'small' | 'large' | 'extra-large';

/**
 * Densidade de impressão
 */
export type PrintDensity = 8 | 12 | 15;

/**
 * Corte do papel
 */
export type CutMode = 'full' | 'partial' | 'none';

/**
 * Status da impressora
 */
export type PrinterStatus = 'idle' | 'printing' | 'error' | 'success';

/**
 * Dados de um item de receipt
 */
export interface ReceiptItem {
  /** Nome do item */
  name: string;
  /** Quantidade */
  quantity: number;
  /** Preço unitário */
  price: number;
  /** Desconto */
  discount?: number;
}

/**
 * Dados do pagamento
 */
export interface PaymentData {
  /** Método de pagamento */
  method: 'cash' | 'credit' | 'debit' | 'pix' | 'transfer';
  /** Valor pago */
  amount: number;
  /** Troco */
  change?: number;
}

/**
 * Dados do receipt/cupom
 */
export interface ReceiptData {
  /** Cabeçalho */
  header?: {
    /** Título/Logo */
    title?: string;
    /** Linhas de endereço */
    address?: string[];
    /** CNPJ */
    document?: string;
    /** Data */
    date?: Date;
    /** Número do cupom */
    number?: string;
    /** Operador */
    operator?: string;
  };
  /** Itens */
  items?: ReceiptItem[];
  /** Resumo */
  summary?: {
    /** Subtotal */
    subtotal?: number;
    /** Desconto total */
    discount?: number;
    /** Taxa de serviço */
    serviceFee?: number;
    /** Total */
    total: number;
  };
  /** Pagamentos */
  payments?: PaymentData[];
  /** Rodapé */
  footer?: {
    /** Mensagens */
    messages?: string[];
    /** QR Code (PIX) */
    qrCode?: string;
    /** Código de barras */
    barcode?: string;
  };
}

/**
 * Opções de impressão
 */
export interface PrintOptions {
  /** Largura do papel (mm) */
  paperWidth?: PaperWidth;
  /** Densidade de impressão */
  density?: PrintDensity;
  /** Número de cópias */
  copies?: number;
  /** Cortar após impressão */
  cut?: CutMode;
  /** Abrir gaveta de dinheiro */
  openCashDrawer?: boolean;
  /** Timeout de impressão (ms) */
  timeout?: number;
}

/**
 * Props do componente ArchbaseThermalPrinter
 */
export interface ArchbaseThermalPrinterProps {
  /** Dados do receipt */
  data: ReceiptData;

  /** --- Opções de Impressão --- */
  options?: PrintOptions;
  /** Impressora destino (deixe vazio para usar padrão) */
  printerId?: string;
  /** Executar impressão automaticamente ao montar */
  autoPrint?: boolean;

  /** --- Template Customizado --- */
  /** Template customizado para o receipt */
  template?: (data: ReceiptData) => ReactNode;

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;

  /** --- Eventos --- */
  onPrintStart?: () => void;
  onPrintComplete?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: PrinterStatus) => void;

  /** --- Preview --- */
  /** Mostrar preview antes de imprimir */
  showPreview?: boolean;
  /** Botões de ação no preview */
  previewActions?: boolean;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  title?: string;
}

/**
 * Props para componente de receipt
 */
export interface ReceiptProps {
  data: ReceiptData;
  paperWidth?: PaperWidth;
  align?: TextAlign;
  showLogo?: boolean;
  style?: CSSProperties;
  className?: string;
}

/**
 * Props para componente de Label
 */
export interface LabelProps {
  /** Conteúdo da etiqueta */
  content: string | string[];
  /** Código de barras */
  barcode?: string;
  /** QR Code */
  qrCode?: string;
  /** Largura da etiqueta (mm) */
  width?: number;
  /** Altura da etiqueta (mm) */
  height?: number;
  /** Número de cópias */
  copies?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * Props para componente de Barcode
 */
export interface BarcodeProps {
  /** Dados do código de barras */
  value: string;
  /** Tipo de código de barras */
  type?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF' | 'CODABAR';
  /** Altura (dots) */
  height?: number;
  /** Largura das barras (1-3) */
  width?: number;
  /** Mostrar texto abaixo */
  text?: boolean;
  /** Alinhamento do texto */
  textAlign?: TextAlign;
  style?: CSSProperties;
  className?: string;
}
