import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { format } from 'date-fns';

// Tipos de exportação suportados
export type ExportFormat = 'csv' | 'excel' | 'pdf';

// Configurações de exportação
export interface ExportConfig {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  encoding?: string;
  sheetName?: string;
  selectedColumns?: string[];
  dateFormat?: string;
  numberFormat?: string;
}

// Função auxiliar para obter valor da célula
const getCellValue = (row: any, column: any): any => {
  if (!column || !column.field) return '';
  
  // Lidar com caminhos aninhados (ex: user.address.street)
  if (column.field.includes('.')) {
    const parts = column.field.split('.');
    let value = row;
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return '';
      }
    }
    return value;
  }
  
  // Usar valueGetter se disponível
  if (column.valueGetter) {
    try {
      return column.valueGetter(undefined, row, column);
    } catch (e) {
      console.error('Error in valueGetter:', e);
      return '';
    }
  }
  
  // Acesso direto à propriedade
  return row[column.field];
};

// Função principal de exportação
export async function exportData(
  data: any[],
  columns: any[],
  config: ExportConfig
): Promise<void> {
  const selectedColumns = config.selectedColumns || columns.map(col => col.field);
  const exportColumns = columns.filter(col => selectedColumns.includes(col.field));

  // Preparar os dados
  const exportData = data.map(row => {
    const exportRow: any = {};
    exportColumns.forEach(col => {
      let value = getCellValue(row, col);
      
      // Formatação baseada no tipo de dados
      if (value !== null && value !== undefined) {
        if ((col.dataType === 'date' || col.type === 'date') && config.dateFormat) {
          try {
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
              value = format(dateValue, config.dateFormat);
            }
          } catch (e) {
            console.error('Error formatting date:', e);
          }
        } else if ((col.dataType === 'number' || col.dataType === 'currency') && config.numberFormat) {
          try {
            value = new Intl.NumberFormat(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              style: col.dataType === 'currency' ? 'currency' : 'decimal',
              currency: 'BRL'
            }).format(value);
          } catch (e) {
            console.error('Error formatting number:', e);
          }
        } else if (col.dataType === 'boolean') {
          value = value ? 'Sim' : 'Não';
        }
      }
      
      exportRow[col.headerName || col.field] = value !== null && value !== undefined ? value : '';
    });
    return exportRow;
  });

  // Exportar no formato selecionado
  switch (config.format) {
    case 'csv':
      await exportToCSV(exportData, config);
      break;
    case 'excel':
      await exportToExcel(exportData, config);
      break;
    case 'pdf':
      await exportToPDF(exportData, config);
      break;
  }
}

// Exportação para CSV
async function exportToCSV(data: any[], config: ExportConfig): Promise<void> {
  const delimiter = config.delimiter || ',';
  const headers = Object.keys(data[0]);
  
  let csv = config.includeHeaders 
    ? headers.join(delimiter) + '\n'
    : '';

  csv += data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== null && value !== undefined ? value : '';
    }).join(delimiter)
  ).join('\n');

  const blob = new Blob([csv], { 
    type: `text/csv;charset=${config.encoding || 'utf-8'};` 
  });
  
  saveAs(blob, `${config.filename || 'export'}.csv`);
}

// Exportação para Excel
async function exportToExcel(data: any[], config: ExportConfig): Promise<void> {
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(data, {
    header: Object.keys(data[0])
  });

  // Adicionar estilos e formatação
  const range = utils.decode_range(ws['!ref'] || 'A1');
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "CCCCCC" } }
  };

  // Aplicar estilos ao cabeçalho
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = ws[utils.encode_cell({ r: 0, c: col })];
    if (cell) {
      cell.s = headerStyle;
    }
  }

  utils.book_append_sheet(wb, ws, config.sheetName || 'Sheet1');
  
  const wbout = write(wb, { 
    bookType: 'xlsx', 
    type: 'array',
    bookSST: false,
    compression: true
  });
  
  const blob = new Blob([wbout], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, `${config.filename || 'export'}.xlsx`);
}

// Exportação para PDF (placeholder - necessita implementação específica)
async function exportToPDF(data: any[], config: ExportConfig): Promise<void> {
  console.warn('Exportação para PDF ainda não implementada. Considere usar a função printData em seu lugar.');
  // Implementar lógica de exportação PDF ou usar a função printData
}