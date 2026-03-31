import type { MantineDemo } from '@mantinex/demo';
import { ListViewTableUsage } from './ListViewTableUsage';
import { ListViewTableCustomRender } from './ListViewTableCustomRender';

// Uso Básico
const usageCode = `
import { ArchbaseListViewTable } from '@archbase/components';

interface FileSystemItem {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  modified: string;
}

function Demo() {
  const data: FileSystemItem[] = [
    { id: '1', name: 'Documents', size: 0, type: 'folder', modified: '2025-01-15' },
    { id: '2', name: 'report.pdf', size: 2456000, type: 'file', modified: '2025-01-14' },
  ];

  const columns = [
    { key: 'name' as const, title: 'Nome', width: 300 },
    { key: 'size' as const, title: 'Tamanho', width: 100 },
  ];

  return (
    <ArchbaseListViewTable
      data={data}
      columns={columns}
      rowKey="id"
      height={400}
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ListViewTableUsage,
  code: usageCode,
};

// Render Customizado
const customRenderCode = `
import { ArchbaseListViewTable } from '@archbase/components';
import { Badge } from '@mantine/core';

function Demo() {
  const columns = [
    {
      key: 'name' as const,
      title: 'Produto',
      renderCell: (record: Product) => (
        <strong>{record.name}</strong>
      ),
    },
    {
      key: 'stock' as const,
      title: 'Estoque',
      renderCell: (record: Product) => (
        <Badge color={record.stock < 10 ? 'red' : 'green'}>
          {record.stock}
        </Badge>
      ),
    },
  ];

  return <ArchbaseListViewTable data={data} columns={columns} />;
}
`;

export const customRender: MantineDemo = {
  type: 'code',
  component: ListViewTableCustomRender,
  code: customRenderCode,
};

// =============================================
// ArchbaseQRCode
// =============================================
import { ArchbaseQRCodeUsage } from './ArchbaseQRCodeUsage';

const qrCodeUsageCode = `
import { ArchbaseQRCode } from '@archbase/components';

function Demo() {
  return (
    <ArchbaseQRCode
      value="https://archbase.com.br"
      size={200}
      level="M"
      bgColor="#ffffff"
      fgColor="#000000"
    />
  );
}
`;

export const qrCodeUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseQRCodeUsage,
  code: qrCodeUsageCode,
};

// =============================================
// ArchbaseCodeViewer
// =============================================
import { ArchbaseCodeViewerUsage } from './ArchbaseCodeViewerUsage';

const codeViewerUsageCode = `
import { ArchbaseCodeViewer } from '@archbase/components';

const code = \`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Contagem: {count}
    </button>
  );
}\`;

function Demo() {
  return (
    <ArchbaseCodeViewer
      code={code}
      language="tsx"
      showLineNumbers
      showCopyButton
    />
  );
}
`;

export const codeViewerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseCodeViewerUsage,
  code: codeViewerUsageCode,
};

// =============================================
// ArchbaseDiffViewer
// =============================================
import { ArchbaseDiffViewerUsage } from './ArchbaseDiffViewerUsage';

const diffViewerUsageCode = `
import { ArchbaseDiffViewer } from '@archbase/components';

const oldCode = \`function saudacao(nome) {
  console.log("Olá, " + nome);
  return nome;
}\`;

const newCode = \`function saudacao(nome: string): string {
  const mensagem = \\\`Olá, \\\${nome}!\\\`;
  console.log(mensagem);
  return mensagem;
}\`;

function Demo() {
  return (
    <ArchbaseDiffViewer
      oldValue={oldCode}
      newValue={newCode}
      splitView={true}
      leftTitle="Versão Anterior"
      rightTitle="Versão Atual"
    />
  );
}
`;

export const diffViewerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseDiffViewerUsage,
  code: diffViewerUsageCode,
};

// =============================================
// ArchbaseJsonTree
// =============================================
import { ArchbaseJsonTreeUsage } from './ArchbaseJsonTreeUsage';

const jsonTreeUsageCode = `
import { ArchbaseJsonTree } from '@archbase/components';

const data = {
  nome: 'Archbase React',
  versao: '3.0.0',
  dependencias: {
    react: '^18.0.0',
    mantine: '^7.0.0',
  },
  recursos: ['DataSource', 'Validação', 'Templates'],
};

function Demo() {
  return (
    <ArchbaseJsonTree
      data={data}
      defaultExpanded={true}
      maxDepth={3}
      clickToExpandNode
    />
  );
}
`;

export const jsonTreeUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseJsonTreeUsage,
  code: jsonTreeUsageCode,
};

// =============================================
// ArchbaseXmlViewer
// =============================================
import { ArchbaseXmlViewerUsage } from './ArchbaseXmlViewerUsage';

const xmlViewerUsageCode = `
import { ArchbaseXmlViewer } from '@archbase/components';

const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<configuracao>
  <aplicacao nome="Archbase" versao="3.0.0">
    <modulos>
      <modulo nome="components" ativo="true" />
      <modulo nome="security" ativo="true" />
    </modulos>
  </aplicacao>
</configuracao>\`;

function Demo() {
  return (
    <ArchbaseXmlViewer
      xml={xml}
      formatXml
      showLineNumbers
      showCopyButton
    />
  );
}
`;

export const xmlViewerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseXmlViewerUsage,
  code: xmlViewerUsageCode,
};

// =============================================
// ArchbaseGantt
// =============================================
import { ArchbaseGanttUsage } from './ArchbaseGanttUsage';

const ganttUsageCode = `
import { ArchbaseGantt } from '@archbase/components';

interface ProjectTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
}

function Demo() {
  const tasks: ProjectTask[] = [
    { id: '1', name: 'Levantamento de Requisitos', startDate: '2025-03-01', endDate: '2025-03-07', progress: 100, dependencies: [] },
    { id: '2', name: 'Design de Interface', startDate: '2025-03-08', endDate: '2025-03-14', progress: 80, dependencies: ['1'] },
    { id: '3', name: 'Desenvolvimento Backend', startDate: '2025-03-10', endDate: '2025-03-25', progress: 45, dependencies: ['1'] },
    { id: '4', name: 'Desenvolvimento Frontend', startDate: '2025-03-15', endDate: '2025-03-28', progress: 30, dependencies: ['2'] },
    { id: '5', name: 'Testes e QA', startDate: '2025-03-26', endDate: '2025-04-02', progress: 0, dependencies: ['3', '4'] },
    { id: '6', name: 'Deploy em Produção', startDate: '2025-04-03', endDate: '2025-04-05', progress: 0, dependencies: ['5'] },
  ];

  const dataSource = useDataSource({ records: tasks, idField: 'id' });

  return (
    <ArchbaseGantt
      dataSource={dataSource}
      idField="id"
      nameField="name"
      startDateField="startDate"
      endDateField="endDate"
      progressField="progress"
      dependenciesField="dependencies"
      viewMode="Week"
      locale="pt-BR"
      showTaskList
      onTaskChange={(task) => console.log('Tarefa alterada:', task)}
    />
  );
}
`;

export const ganttUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseGanttUsage,
  code: ganttUsageCode,
};

// =============================================
// ArchbaseResourceTimeline
// =============================================
import { ArchbaseResourceTimelineUsage } from './ArchbaseResourceTimelineUsage';

const resourceTimelineUsageCode = `
import { ArchbaseResourceTimeline } from '@archbase/components';

function Demo() {
  const resources = [
    { id: '1', label: 'Ana Silva - Desenvolvedora' },
    { id: '2', label: 'Carlos Souza - Designer' },
    { id: '3', label: 'Maria Oliveira - QA' },
  ];

  const events = [
    { id: 'e1', resourceId: '1', label: 'Sprint Planning', start: '2025-03-24 09:00', end: '2025-03-24 11:00' },
    { id: 'e2', resourceId: '1', label: 'Desenvolvimento API', start: '2025-03-24 13:00', end: '2025-03-26 18:00' },
    { id: 'e3', resourceId: '2', label: 'UI/UX Prototipação', start: '2025-03-24 09:00', end: '2025-03-25 18:00' },
    { id: 'e4', resourceId: '2', label: 'Design Review', start: '2025-03-26 14:00', end: '2025-03-26 16:00' },
    { id: 'e5', resourceId: '3', label: 'Testes Regressão', start: '2025-03-25 09:00', end: '2025-03-27 18:00' },
    { id: 'e6', resourceId: '3', label: 'Relatório de Bugs', start: '2025-03-28 09:00', end: '2025-03-28 12:00' },
  ];

  const resourceDS = useDataSource({ records: resources, idField: 'id' });
  const eventDS = useDataSource({ records: events, idField: 'id' });

  return (
    <ArchbaseResourceTimeline
      resourceDataSource={resourceDS}
      eventDataSource={eventDS}
      resourceIdField="id"
      resourceLabelField="label"
      eventStartField="start"
      eventEndField="end"
      eventResourceIdField="resourceId"
      eventLabelField="label"
      viewMode="week"
      editable
      onEventClick={(event) => console.log('Evento clicado:', event)}
    />
  );
}
`;

export const resourceTimelineUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseResourceTimelineUsage,
  code: resourceTimelineUsageCode,
};

// =============================================
// ArchbaseSpreadsheet
// =============================================
import { ArchbaseSpreadsheetUsage } from './ArchbaseSpreadsheetUsage';

const spreadsheetUsageCode = `
import { ArchbaseSpreadsheet } from '@archbase/components';

function Demo() {
  const columns = [
    { field: 'produto', title: 'Produto', width: 200 },
    { field: 'quantidade', title: 'Quantidade', width: 120 },
    { field: 'precoUnitario', title: 'Preço Unitário', width: 150 },
  ];

  const rows = [
    { id: '1', produto: 'Notebook Dell', quantidade: 10, precoUnitario: 4500.00 },
    { id: '2', produto: 'Monitor LG 27"', quantidade: 15, precoUnitario: 1800.00 },
    { id: '3', produto: 'Teclado Mecânico', quantidade: 30, precoUnitario: 350.00 },
    { id: '4', produto: 'Mouse Wireless', quantidade: 50, precoUnitario: 120.00 },
    { id: '5', produto: 'Webcam HD', quantidade: 20, precoUnitario: 280.00 },
  ];

  const dataSource = useDataSource({ records: rows, idField: 'id' });

  return (
    <ArchbaseSpreadsheet
      dataSource={dataSource}
      columns={columns}
      editable
      showToolbar
      showFormulaBar
      height={400}
      locale="pt-BR"
    />
  );
}
`;

export const spreadsheetUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseSpreadsheetUsage,
  code: spreadsheetUsageCode,
};
