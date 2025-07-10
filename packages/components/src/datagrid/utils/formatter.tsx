import { format } from 'date-fns';

/**
 * Função para formatar valor com base no tipo de dados
 */
export function getFormattedValueByDataType(
  value: any, 
  dataType: string, 
  appContext: any, 
  maskOptions?: any
): string | number | boolean | null {
  if (value === null || value === undefined) {
    return '';
  }

  switch (dataType) {
    case 'text':
      if (maskOptions) {
        // Aplicar máscara se disponível via libs externas
        return String(value);
      }
      return String(value);

    case 'integer':
      return Number.isNaN(Number(value)) ? 0 : Number(value);
      
    case 'currency':
      try {
        const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numValue);
      } catch (e) {
        return Number.isNaN(Number(value)) ? 0 : Number(value);
      }
      
    case 'boolean':
      return Boolean(value);
      
    case 'date':
      try {
        if (!value) return '';
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, appContext.dateFormat || 'dd/MM/yyyy');
      } catch (e) {
        return 'Data inválida';
      }
      
    case 'datetime':
      try {
        if (!value) return '';
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, appContext.dateTimeFormat || 'dd/MM/yyyy HH:mm:ss');
      } catch (e) {
        return 'Data/hora inválida';
      }
      
    case 'time':
      try {
        if (!value) return '';
        
        if (typeof value === 'string') {
          return value; // Se já vier formatado como string
        }
        
        if (value instanceof Date) {
          return format(value, 'HH:mm:ss');
        }
        
        // Se for número, assume que são milissegundos desde meia-noite
        if (typeof value === 'number') {
          const hours = Math.floor(value / 3600000);
          const minutes = Math.floor((value % 3600000) / 60000);
          const seconds = Math.floor((value % 60000) / 1000);
          
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        return 'Hora inválida';
      } catch (e) {
        return 'Hora inválida';
      }
      
    case 'enum':
      const enumValues = maskOptions; // Neste caso, maskOptions contém os valores de enum
      if (Array.isArray(enumValues)) {
        const option = enumValues.find(opt => opt.value === value);
        return option ? option.label : String(value);
      }
      return String(value);
      
    default:
      return String(value);
  }
}

/**
 * Função para formatar valor para exportação
 */
export function getFormattedValueForExport(
  value: any, 
  dataType: string, 
  appContext: any, 
  dateFormat?: string
): string {
  // Adicione logs ou validações para garantir que a formatação está correta

  if (value === null || value === undefined) {
    return '';
  }

  switch (dataType) {
    case 'currency':
      try {
        const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numValue);
      } catch (e) {
        return String(value);
      }
      
    case 'boolean':
      return value ? 'Sim' : 'Não';
      
    case 'date':
      try {
        if (!value) return '';
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, dateFormat || appContext.dateFormat || 'dd/MM/yyyy');
      } catch (e) {
        return 'Data inválida';
      }
      
    case 'datetime':
      try {
        if (!value) return '';
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, appContext.dateTimeFormat || 'dd/MM/yyyy HH:mm:ss');
      } catch (e) {
        return 'Data/hora inválida';
      }
      
    default:
      return String(value);
  }
}

/**
 * Formata um valor decimal com número específico de casas decimais
 */
export function formatDecimal(
  value: number | string | undefined, 
  decimalPlaces: number = 2,
  useThousandSeparator: boolean = true
): string {
  if (value === undefined || value === null || value === '') return '';
  
  try {
    const numValue = typeof value === 'string' ? Number(value) : value;
    
    if (Number.isNaN(numValue)) return '0';
    
    if (useThousandSeparator) {
      return new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces 
      }).format(numValue);
    } else {
      return numValue.toFixed(decimalPlaces);
    }
  } catch (e) {
    console.error('Error formatting decimal:', e);
    return String(value);
  }
}

/**
 * Formata um valor como moeda
 */
export function formatCurrency(
  value: number | string | undefined, 
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  if (value === undefined || value === null || value === '') return '';
  
  try {
    const numValue = typeof value === 'string' ? Number(value) : value;
    
    if (Number.isNaN(numValue)) return '';
    
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: currency 
    }).format(numValue);
  } catch (e) {
    console.error('Error formatting currency:', e);
    return String(value);
  }
}

/**
 * Formata um valor como data
 */
export function formatDate(
  value: string | Date | undefined,
  dateFormat: string = 'dd/MM/yyyy'
): string {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, dateFormat);
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Data inválida';
  }
}

/**
 * Formata um valor como data e hora
 */
export function formatDateTime(
  value: string | Date | undefined,
  dateTimeFormat: string = 'dd/MM/yyyy HH:mm:ss'
): string {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, dateTimeFormat);
  } catch (e) {
    console.error('Error formatting datetime:', e);
    return 'Data/hora inválida';
  }
}

/**
 * Formata um valor como hora
 */
export function formatTime(
  value: string | Date | number | undefined,
  timeFormat: string = 'HH:mm:ss'
): string {
  if (value === undefined || value === null) return '';
  
  try {
    if (typeof value === 'string') {
      // Verifica se é uma hora no formato HH:mm:ss
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return value;
      }
      
      // Tenta converter de string para Date
      return format(new Date(value), timeFormat);
    }
    
    if (value instanceof Date) {
      return format(value, timeFormat);
    }
    
    // Se for número, assume que são milissegundos desde meia-noite
    if (typeof value === 'number') {
      const hours = Math.floor(value / 3600000);
      const minutes = Math.floor((value % 3600000) / 60000);
      const seconds = Math.floor((value % 60000) / 1000);
      
      if (timeFormat === 'HH:mm:ss') {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else if (timeFormat === 'HH:mm') {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    
    return String(value);
  } catch (e) {
    console.error('Error formatting time:', e);
    return 'Hora inválida';
  }
}

/**
 * Formata um valor booleano
 */
export function formatBoolean(
  value: boolean | undefined | null,
  trueLabel: string = 'Sim',
  falseLabel: string = 'Não'
): string {
  if (value === undefined || value === null) return '';
  return value ? trueLabel : falseLabel;
}

/**
 * Formata um valor enum com base em opções
 */
export function formatEnum(
  value: any,
  options: { value: any; label: string }[]
): string {
  if (value === undefined || value === null) return '';
  
  const option = options.find(opt => opt.value === value);
  return option ? option.label : String(value);
}
