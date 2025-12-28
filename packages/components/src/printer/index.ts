/**
 * ArchbaseThermalPrinter - Thermal Printer Component
 *
 * Impressão térmica ESC/POS para receipts, labels e códigos de barras.
 * Suporta impressoras térmicas padrão de mercado (58mm, 80mm, 112mm).
 */

// Main component
export { ArchbaseThermalPrinter, QuickPrintButton } from './ArchbaseThermalPrinter';

// Types
export type {
  ArchbaseThermalPrinterProps,
  ReceiptData,
  ReceiptItem,
  PaymentData,
  PrintOptions,
  PrinterStatus,
  PaperWidth,
  CutMode,
  PrintDensity,
  TextAlign,
  FontSize,
  BarStyle,
  ReceiptProps,
  LabelProps,
  BarcodeProps,
} from './ArchbaseThermalPrinter.types';

// Utils
export {
  formatCurrency as formatCurrencyReceipt,
  formatDate as formatDateReceipt,
  line,
  divider,
  centerText,
  rightAlignText,
  escposInit,
  escposAlign,
  escposFontSize,
  escposBold,
  escposUnderline,
  escposFeed,
  escposCut,
  escposOpenCashDrawer,
  escposQRCode,
  escposBarcode,
  escposFinalize,
  stringToUint8Array,
  stringsToUint8Array,
  combineCommands,
  getCharsWidth,
  generateReceiptEscpos,
} from './utils/escpos';
