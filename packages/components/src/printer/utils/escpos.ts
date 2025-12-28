import type { PaperWidth, PrintDensity, CutMode, TextAlign, FontSize, BarStyle } from '../ArchbaseThermalPrinter.types';

/**
 * Comandos ESC/POS básicos
 */
export const ESC = '\x1B';
export const GS = '\x1D';
export const DLE = '\x10';
export const CAN = '\x18';

/**
 * Códigos de alinhamento
 */
const ALIGN = {
  left: `${ESC}a\x00`,
  center: `${ESC}a\x01`,
  right: `${ESC}a\x02`,
};

/**
 * Códigos de tamanho de fonte
 */
const FONT_SIZE = {
  normal: `${ESC}!\x00`, // Normal
  small: `${ESC}!\x01`, // Altura metade
  large: `${ESC}!\x11`, // Largura e altura dobradas
  extraLarge: `${ESC}!\x11`, // 2x width, 2x height
};

/**
 * Códigos de barra
 */
const BAR_STYLE = {
  single: '-',
  double: '=',
  dashed: '-',
};

/**
 * Configurações de densidade por largura de papel
 */
const DENSITY_CONFIG: Record<PaperWidth, PrintDensity> = {
  58: 8,
  80: 8,
  112: 12,
};

/**
 * Formata número como moeda (BRL)
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata data para receipt
 */
export function formatDate(date?: Date): string {
  if (!date) {
    date = new Date();
  }
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gera linha de caracteres
 */
export function line(char: string = '-', length: number = 48): string {
  return char.repeat(Math.ceil(length / char.length)).substring(0, length);
}

/**
 * Gera linha divisória
 */
export function divider(barStyle: BarStyle = 'single', length: number = 48): string {
  const chars: Record<BarStyle, string> = {
    single: '-',
    double: '=',
    dashed: '-',
  };
  return line(chars[barStyle] || '-', length);
}

/**
 * Centraliza texto
 */
export function centerText(text: string, width: number = 48): string {
  const padding = Math.max(0, width - text.length);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

/**
 * Alinha texto à direita
 */
export function rightAlignText(text: string, width: number = 48): string {
  const padding = Math.max(0, width - text.length);
  return ' '.repeat(padding) + text;
}

/**
 * Cabeçalho ESC/POS para inicializar impressora
 */
export function escposInit(paperWidth: PaperWidth = 80, density: PrintDensity = 8): Uint8Array {
  const commands: string[] = [];

  // Reset
  commands.push(ESC + '@');

  // Tamanho de fonte normal
  commands.push(FONT_SIZE.normal);

  // Codificação de caracteres (UTF-8 ou CP850)
  commands.push(ESC + '\x74'); // Select character table

  return stringToUint8Array(commands.join(''));
}

/**
 * Define alinhamento
 */
export function escposAlign(align: TextAlign): Uint8Array {
  return stringToUint8Array(ALIGN[align] || ALIGN.left);
}

/**
 * Define tamanho da fonte
 */
export function escposFontSize(size: FontSize): Uint8Array {
  return stringToUint8Array(FONT_SIZE[size] || FONT_SIZE.normal);
}

/**
 * Define negrito (on/off)
 */
export function escposBold(enabled: boolean = true): Uint8Array {
  return stringToUint8Array(enabled ? ESC + '\x45\x01' : ESC + '\x45\x00');
}

/**
 * Define sublinhado (on/off)
 */
export function escposUnderline(enabled: boolean = true): Uint8Array {
  const value = enabled ? '\x01' : '\x00';
  return stringToUint8Array(ESC + '\x2D' + value);
}

/**
 * Alimenta linhas
 */
export function escposFeed(lines: number = 1): Uint8Array {
  return stringToUint8Array(ESC + 'd' + String.fromCharCode(Math.min(lines, 255)));
}

/**
 * Corte de papel
 */
export function escposCut(mode: CutMode = 'full'): Uint8Array {
  if (mode === 'none') {
    return new Uint8Array(0);
  }
  // 66 = full cut, 67 = partial cut
  const value = mode === 'full' ? '\x42' : '\x43';
  return stringToUint8Array(GS + 'V' + value + '\x00');
}

/**
 * Abre gaveta de dinheiro
 */
export function escposOpenCashDrawer(): Uint8Array {
  return stringToUint8Array(ESC + '\x70' + '\x00' + '\x3C' + '\x00');
}

/**
 * Gera QR Code
 */
export function escposQRCode(data: string, size: number = 8): Uint8Array {
  const commands: string[] = [];

  // Função QR Code
  commands.push(GS + '(k'); // QR code

  // Model 1
  commands.push('\x04'); // PL
  commands.push('\x00'); // PH
  commands.push('\x31'); // Model 1
  commands.push('\x50'); // Size

  // Error correction level L
  commands.push(GS + '(k');
  commands.push('\x03\x00');
  commands.push('\x31'); // Model
  commands.push('\x51'); // Error correction L
  commands.push('\x00');

  // Data
  const dataBytes = new TextEncoder().encode(data);
  commands.push(GS + '(k');
  commands.push(String.fromCharCode(dataBytes.length + 3)); // PL
  commands.push('\x00'); // PH
  commands.push('\x31'); // Model
  commands.push('\x80'); // Data
  commands.push(String.fromCharCode(...dataBytes));

  // Print QR code
  commands.push(GS + '(k');
  commands.push('\x03\x00');
  commands.push('\x32'); // Model
  commands.push(String.fromCharCode(size)); // Size
  commands.push('\x00');

  return stringToUint8Array(commands.join(''));
}

/**
 * Gera código de barras (CODE128)
 */
export function escposBarcode(data: string, height: number = 162): Uint8Array {
  const commands: string[] = [];

  // Barcode function
  commands.push(GS + 'k'); // Barcode

  // CODE128 (Type 73)
  commands.push('\x49'); // CODE128
  commands.push('\x00'); // Enable HRI

  // Height
  commands.push(String.fromCharCode(Math.min(height, 255)));

  // Data length
  commands.push(String.fromCharCode(data.length));

  // Data
  const dataBytes = new TextEncoder().encode(data);
  commands.push(String.fromCharCode(...dataBytes));

  return stringToUint8Array(commands.join(''));
}

/**
 * Finaliza e adiciona feed + cut
 */
export function escposFinalize(cutMode: CutMode = 'full', feedLines: number = 3): Uint8Array {
  const commands: string[] = [];

  // Feed lines before cut
  commands.push(ESC + 'd' + String.fromCharCode(feedLines));

  // Cut
  if (cutMode !== 'none') {
    const cutData = escposCut(cutMode);
    for (let i = 0; i < cutData.length; i++) {
      commands.push(String.fromCharCode(cutData[i]));
    }
  }

  return stringToUint8Array(commands.join(''));
}

/**
 * Converte string para Uint8Array (UTF-8)
 */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Converte array de strings para Uint8Array
 */
export function stringsToUint8Array(strings: string[]): Uint8Array {
  const encoder = new TextEncoder();
  const totalLength = strings.reduce((acc, str) => acc + encoder.encode(str).length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const str of strings) {
    const encoded = encoder.encode(str);
    result.set(encoded, offset);
    offset += encoded.length;
  }

  return result;
}

/**
 * Combina múltiplos comandos ESC/POS
 */
export function combineCommands(...commands: Uint8Array[]): Uint8Array {
  const totalLength = commands.reduce((acc, cmd) => acc + cmd.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const cmd of commands) {
    result.set(cmd, offset);
    offset += cmd.length;
  }

  return result;
}

/**
 * Calcula largura em caracteres baseada na largura do papel
 * Aproximadamente 48 caracteres para 80mm, 32 para 58mm
 */
export function getCharsWidth(paperWidth: PaperWidth): number {
  const charsPerMm = 1.5; // Aproximado para fonte 12cpi
  return Math.floor(paperWidth * charsPerMm);
}

/**
 * Gera receipt completo como Uint8Array
 */
export function generateReceiptEscpos(
  data: {
    header?: {
      title?: string;
      address?: string[];
      document?: string;
      date?: Date;
      number?: string;
      operator?: string;
    };
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
      discount?: number;
    }>;
    summary?: {
      subtotal?: number;
      discount?: number;
      serviceFee?: number;
      total: number;
    };
    payments?: Array<{
      method: string;
      amount: number;
    }>;
    footer?: {
      messages?: string[];
      qrCode?: string;
      barcode?: string;
    };
  },
  paperWidth: PaperWidth = 80,
  cutMode: CutMode = 'full'
): Uint8Array {
  const chars = getCharsWidth(paperWidth);
  const commands: Uint8Array[] = [];

  // Init
  commands.push(escposInit(paperWidth));

  // Header
  if (data.header) {
    // Title centered bold
    if (data.header.title) {
      commands.push(escposAlign('center'));
      commands.push(escposBold(true));
      commands.push(escposFontSize('large'));
      commands.push(stringToUint8Array(data.header.title + '\n'));
      commands.push(escposBold(false));
      commands.push(escposFontSize('normal'));
      commands.push(escposFeed(1));
    }

    // Address
    if (data.header.address) {
      commands.push(escposAlign('center'));
      for (const line of data.header.address) {
        commands.push(stringToUint8Array(line + '\n'));
      }
      commands.push(escposFeed(1));
    }

    // Document
    if (data.header.document) {
      commands.push(escposAlign('center'));
      commands.push(stringToUint8Array(data.header.document + '\n'));
    }

    // Date and cupom number
    commands.push(escposAlign('left'));
    const dateStr = formatDate(data.header.date);
    commands.push(stringToUint8Array(`DATA: ${dateStr}`));
    if (data.header.number) {
      commands.push(stringToUint8Array(`CUPOM: ${data.header.number}\n`));
    }
    if (data.header.operator) {
      commands.push(stringToUint8Array(`OPERADOR: ${data.header.operator}\n`));
    }

    commands.push(escposFeed(1));
    commands.push(escposBold(true));
    commands.push(stringToUint8Array(divider('double', chars) + '\n'));
    commands.push(escposBold(false));
  }

  // Items
  if (data.items && data.items.length > 0) {
    // Header row
    const itemWidth = Math.floor(chars * 0.5);
    const qtyWidth = 6;
    const priceWidth = chars - itemWidth - qtyWidth - 2;

    commands.push(escposBold(true));
    commands.push(stringToUint8Array(
      'ITEM'.padEnd(itemWidth, ' ') +
      'QTD'.padEnd(qtyWidth, ' ') +
      'VALOR\n'
    ));
    commands.push(escposBold(false));

    // Items
    for (const item of data.items) {
      const itemName = item.name.substring(0, itemWidth);
      const total = item.quantity * item.price - (item.discount || 0);

      commands.push(stringToUint8Array(
        itemName.padEnd(itemWidth, ' ') +
        String(item.quantity).padStart(qtyWidth, ' ') +
        formatCurrency(total).padStart(priceWidth, ' ') + '\n'
      ));

      if (item.discount) {
        commands.push(stringToUint8Array(
          '  Desc: ' + formatCurrency(item.discount) + '\n'
        ));
      }
    }

    commands.push(escposFeed(1));
    commands.push(escposBold(true));
    commands.push(stringToUint8Array(divider('double', chars) + '\n'));
    commands.push(escposBold(false));
  }

  // Summary
  if (data.summary) {
    const labelWidth = Math.floor(chars * 0.6);
    const valueWidth = chars - labelWidth - 1;

    if (data.summary.subtotal !== undefined) {
      commands.push(stringToUint8Array(
        'SUBTOTAL'.padEnd(labelWidth, ' ') +
        formatCurrency(data.summary.subtotal).padStart(valueWidth, ' ') + '\n'
      ));
    }

    if (data.summary.discount && data.summary.discount > 0) {
      commands.push(stringToUint8Array(
        'DESCONTO'.padEnd(labelWidth, ' ') +
        '-' + formatCurrency(data.summary.discount).padStart(valueWidth - 1, ' ') + '\n'
      ));
    }

    if (data.summary.serviceFee && data.summary.serviceFee > 0) {
      commands.push(stringToUint8Array(
        'SERVICO'.padEnd(labelWidth, ' ') +
        formatCurrency(data.summary.serviceFee).padStart(valueWidth, ' ') + '\n'
      ));
    }

    commands.push(escposBold(true));
    commands.push(stringToUint8Array(
      'TOTAL'.padEnd(labelWidth, ' ') +
      formatCurrency(data.summary.total).padStart(valueWidth, ' ') + '\n'
    ));
    commands.push(escposBold(false));
    commands.push(escposFeed(1));
  }

  // Payments
  if (data.payments && data.payments.length > 0) {
    const labelWidth = Math.floor(chars * 0.6);
    const valueWidth = chars - labelWidth - 1;

    commands.push(escposBold(true));
    commands.push(stringToUint8Array('PAGAMENTO\n'));
    commands.push(escposBold(false));

    for (const payment of data.payments) {
      commands.push(stringToUint8Array(
        payment.method.toUpperCase().padEnd(labelWidth, ' ') +
        formatCurrency(payment.amount).padStart(valueWidth, ' ') + '\n'
      ));
    }

    commands.push(escposFeed(1));
  }

  // Footer
  if (data.footer) {
    if (data.footer.messages) {
      commands.push(escposAlign('center'));
      for (const msg of data.footer.messages) {
        commands.push(stringToUint8Array(msg + '\n'));
      }
    }

    if (data.footer.qrCode) {
      commands.push(escposAlign('center'));
      commands.push(escposFeed(1));
      commands.push(escposQRCode(data.footer.qrCode));
      commands.push(escposFeed(1));
    }

    if (data.footer.barcode) {
      commands.push(escposAlign('center'));
      commands.push(escposFeed(1));
      commands.push(escposBarcode(data.footer.barcode));
      commands.push(escposFeed(2));
    }
  }

  // Finalize with feed and cut
  commands.push(escposFinalize(cutMode));

  return combineCommands(...commands);
}
