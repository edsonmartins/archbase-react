import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Interface para jsPDF com autoTable
interface JsPDFCustom extends jsPDF {
  autoTable: (options: any) => void;
}

// Interface para configurações de impressão
export interface PrintConfig {
  title?: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'Letter';
  showHeader?: boolean;
  showFooter?: boolean;
  headerText?: string;
  footerText?: string;
  showPageNumbers?: boolean;
  showDate?: boolean;
  logo?: string;
  selectedColumns?: string[];
}

// Função principal de impressão corrigida
export function printData<T>(
  data: T[],
  columns: any[],
  config: PrintConfig
): void {
  try {
    // Verificar se jsPDF está disponível
    if (typeof jsPDF !== 'function') {
      console.error('jsPDF não está disponível');
      return;
    }

    // Criar instância de PDF
    const doc = new jsPDF({
      orientation: config.orientation || 'landscape',
      unit: 'mm',
      format: config.pageSize || 'A4'
    }) as JsPDFCustom;

    // Garantir que autoTable está disponível
    if (typeof doc.autoTable !== 'function') {
      console.error('jspdf-autotable não está disponível');
      return;
    }

    // Calcular dimensões da página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let currentY = margin;

    // Adicionar logo se fornecido
    if (config.logo) {
      try {
        doc.addImage(config.logo, 'JPEG', margin, currentY, 30, 15);
        currentY += 20;
      } catch (error) {
        console.warn('Erro ao adicionar logo:', error);
      }
    }

    // Adicionar cabeçalho
    if (config.showHeader) {
      if (config.title) {
        doc.setFontSize(18);
        doc.text(config.title, pageWidth / 2, currentY, { align: 'center' });
        currentY += 10;
      }

      if (config.subtitle) {
        doc.setFontSize(14);
        doc.text(config.subtitle, pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
      }

      if (config.headerText) {
        doc.setFontSize(12);
        doc.text(config.headerText, pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
      }

      if (config.showDate) {
        doc.setFontSize(10);
        doc.text(
          format(new Date(), 'dd/MM/yyyy HH:mm'),
          pageWidth - margin,
          margin,
          { align: 'right' }
        );
      }
    }

    // Preparar dados para a tabela
    const selectedColumns = columns.filter((col) => 
      !config.selectedColumns || config.selectedColumns.includes(col.field)
    );
    
    const headers = selectedColumns.map((col) => col.headerName || col.field);
    
    const tableData = data.map((row) =>
      selectedColumns.map((col) => {
        // Extrair valor
        let value;
        
        // Usar valueGetter se disponível
        if (typeof col.valueGetter === 'function') {
          try {
            value = col.valueGetter(undefined, row, col);
          } catch (e) {
            console.error('Erro ao obter valor via valueGetter:', e);
            value = '';
          }
        } 
        // Suporte para caminhos aninhados
        else if (col.field && col.field.includes('.')) {
          const parts = col.field.split('.');
          let result : any | undefined = row;
          for (const part of parts) {
            if (result && typeof result === 'object') {
              result = result[part];
            } else {
              result = undefined;
              break;
            }
          }
          value = result;
        } 
        // Acesso direto
        else {
          value = row[col.field];
        }

        // Formatação baseada no tipo de dados
        if (value !== null && value !== undefined) {
          if (col.dataType === 'date') {
            try {
              const dateValue = new Date(value);
              if (!isNaN(dateValue.getTime())) {
                value = format(dateValue, 'dd/MM/yyyy');
              }
            } catch (e) {
              console.error('Error formatting date:', e);
            }
          } else if (col.dataType === 'datetime') {
            try {
              const dateValue = new Date(value);
              if (!isNaN(dateValue.getTime())) {
                value = format(dateValue, 'dd/MM/yyyy HH:mm');
              }
            } catch (e) {
              console.error('Error formatting datetime:', e);
            }
          } else if (col.dataType === 'boolean') {
            value = value ? '✓' : '✗';
          } else if (col.dataType === 'currency') {
            try {
              value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(Number(value));
            } catch (e) {
              console.error('Error formatting currency:', e);
            }
          } else if (col.dataType === 'number') {
            try {
              value = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(Number(value));
            } catch (e) {
              console.error('Error formatting number:', e);
            }
          }
        }
        
        return value !== null && value !== undefined ? value : '';
      })
    );

    // Configurar a tabela com jspdf-autotable
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: 255,
        fontSize: 10,
        font: 'helvetica',
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: selectedColumns.reduce((acc, col, index) => {
        if (col.dataType === 'number' || col.dataType === 'currency') {
          acc[index] = { halign: 'right' };
        } else if (
          col.dataType === 'boolean' ||
          col.dataType === 'date' ||
          col.dataType === 'datetime'
        ) {
          acc[index] = { halign: 'center' };
        }
        return acc;
      }, {} as Record<number, { halign: 'left' | 'right' | 'center' }>),
      didDrawPage: function (data: any) {
        // Adicionar rodapé em cada página
        if (config.showFooter) {
          const bottom = doc.internal.pageSize.getHeight() - 10;

          if (config.footerText) {
            doc.setFontSize(8);
            doc.text(config.footerText, margin, bottom - 5);
          }

          if (config.showPageNumbers) {
            doc.setFontSize(8);
            
            // Obter o número da página de maneira segura
            let pageNumber = 1;
            try {
              // Tente diferentes maneiras de obter o número da página
              if (typeof doc.getNumberOfPages === 'function') {
                pageNumber = doc.getNumberOfPages();
              } else if (doc.internal.pages) {
                // As páginas começam em 1, então a contagem real é length - 1
                pageNumber = Math.max(1, doc.internal.pages.length - 1);
              }
            } catch (e) {
              console.warn('Não foi possível obter o número da página:', e);
            }
            
            const pageInfo = `Página ${pageNumber}`;
            doc.text(pageInfo, pageWidth - margin, bottom - 5, { align: 'right' });
          }

          if (config.showDate) {
            doc.setFontSize(8);
            const dateText = `Data: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`;
            doc.text(dateText, pageWidth / 2, bottom - 5, { align: 'center' });
          }
        }
      }
    });

    // Abrir em nova janela
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.');
  }
}