import { Button, Menu } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import {
  resultToCsv,
  type AnalyticsMeta,
  type MemberLabeler,
  type NormalizedResult,
  type ValueFormatter,
} from '@archbase/analytics-core';

export interface ExportButtonProps {
  /** Resultado atual; `null`/vazio desabilita o botao. */
  result: NormalizedResult | null;
  meta: AnalyticsMeta;
  formatter: ValueFormatter;
  labeler?: MemberLabeler;
  locale: string;
  /** Prefixo do nome do arquivo. Default `analytics`. */
  filenamePrefix?: string;
  labels?: { export?: string; csvFormatted?: string; csvRaw?: string };
}

/** Envolve o CSV num Blob com BOM UTF-8 (Excel respeita acentos) e dispara o
 *  download por um anchor temporario. */
function baixarCsv(nome: string, csv: string) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function carimbo(): string {
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`;
}

/**
 * Botao de exportacao do resultado em CSV (formatado ou valores crus). A
 * serializacao vive em `resultToCsv` (nucleo, pura e testavel); aqui fica so o
 * gesto de download, especifico do navegador.
 */
export function ExportButton({
  result,
  meta,
  formatter,
  labeler,
  locale,
  filenamePrefix = 'analytics',
  labels,
}: ExportButtonProps) {
  const temDados = !!result && result.rows.length > 0;
  const exportar = (raw: boolean) => {
    if (!result) return;
    baixarCsv(`${filenamePrefix}-${carimbo()}.csv`, resultToCsv(result, { formatter, labeler, meta, locale, raw }));
  };
  return (
    <Menu shadow="md" position="bottom-end" disabled={!temDados}>
      <Menu.Target>
        <Button
          size="compact-sm"
          variant="default"
          leftSection={<IconDownload size={14} />}
          disabled={!temDados}
        >
          {labels?.export ?? 'Exportar'}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>CSV</Menu.Label>
        <Menu.Item onClick={() => exportar(false)}>
          {labels?.csvFormatted ?? 'Formatado (como na tela)'}
        </Menu.Item>
        <Menu.Item onClick={() => exportar(true)}>
          {labels?.csvRaw ?? 'Valores crus (planilha)'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
