import type { MantineDemo } from '@mantinex/demo';
import { InfographicRendererUsage } from './InfographicRendererUsage';
import { InfographicRendererWithDSL } from './InfographicRendererWithDSL';
import { useInfographicDemo } from './useInfographicDemo';
import { InfographicWithUtilities } from './InfographicWithUtilities';
import { InfographicGallery } from './InfographicGallery';
import { BusinessMetricsInfographic } from './BusinessMetricsInfographic';
import { ProjectManagementInfographic } from './ProjectManagementInfographic';
import { TechStackInfographic } from './TechStackInfographic';
import { HealthAndEducationInfographic } from './HealthAndEducationInfographic';

// Código para demonstração de uso básico
const usageCode = `
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const specification = \\\`infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Passo 1
      desc: Planejamento
    - label: Passo 2
      desc: Desenvolvimento
    - label: Passo 3
      desc: Testes
    - label: Passo 4
      desc: Deploy
  \\\`;

  return (
    <InfographicRenderer
      width="100%"
      height="300px"
      specification={specification}
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: InfographicRendererUsage,
  code: usageCode,
};

// Código para demonstração com templates DSL
const dslTemplatesCode = `
import { useState } from 'react';
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const [template, setTemplate] = useState('list-row-simple-horizontal-arrow');

  const spec = \\\`infographic \\\${template}
data
  items:
    - label: Q1
      desc: Planejamento
    - label: Q2
      desc: Execução
  \\\`;

  return (
    <InfographicRenderer
      width="100%"
      height="300px"
      specification={spec}
    />
  );
}
`;

export const dslTemplates: MantineDemo = {
  type: 'code',
  component: InfographicRendererWithDSL,
  code: dslTemplatesCode,
};

// Código para demonstração do hook
const useInfographicCode = `
import { useEffect } from 'react';
import { useInfographic } from '@archbase/graphics';

function Demo() {
  const { infographic, render, isLoading, error } = useInfographic({
    width: '100%',
    height: '300px',
  });

  useEffect(() => {
    if (infographic) {
      render(\\\`infographic timeline-simple-vertical
data
  items:
    - label: Jan
      desc: Inicio
    - label: Fev
      desc: Desenvolvimento
  \\\`);
    }
  }, [infographic, render]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return <div ref={containerRef} />;
}
`;

export const hookUsage: MantineDemo = {
  type: 'code',
  component: useInfographicDemo,
  code: useInfographicCode,
};

// Código para demonstração com utilitários
const utilitiesCode = `
import {
  createProcessInfographic,
  createTimelineInfographic,
  createMetricCard,
  InfographicRenderer
} from '@archbase/graphics';

function Demo() {
  const processSpec = createProcessInfographic([
    { label: 'Discovery', desc: 'Requisitos' },
    { label: 'Design', desc: 'Prototipos' },
    { label: 'Development', desc: 'Implementacao' },
    { label: 'Testing', desc: 'QA' },
    { label: 'Launch', desc: 'Deploy' },
  ]);

  return (
    <InfographicRenderer
      width="100%"
      height="300px"
      specification={processSpec}
    />
  );
}
`;

export const utilities: MantineDemo = {
  type: 'code',
  component: InfographicWithUtilities,
  code: utilitiesCode,
};

// Galeria de templates
const galleryCode = `
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const templates = [
    {
      name: 'Lista Horizontal',
      spec: \\\`infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Passo 1
      desc: Descrição
    - label: Passo 2
      desc: Descrição
  \\\`,
    },
    // ... mais templates
  ];

  return (
    <InfographicRenderer
      width="100%"
      height="300px"
      specification={templates[0].spec}
    />
  );
}
`;

export const gallery: MantineDemo = {
  type: 'code',
  component: InfographicGallery,
  code: galleryCode,
};

// Métricas de negócio
const businessMetricsCode = `
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const revenueSpec = \\\`infographic card-simple
data
  items:
    - label: Receita Mensal
      value: R$ 1.250.000
      desc: Crescimento de 23%
  \\\`;

  return <InfographicRenderer specification={revenueSpec} />;
}
`;

export const businessMetrics: MantineDemo = {
  type: 'code',
  component: BusinessMetricsInfographic,
  code: businessMetricsCode,
};

// Gerenciamento de projetos
const projectManagementCode = `
import { createProcessInfographic, createTimelineInfographic, InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const sdlcSpec = createProcessInfographic([
    { label: 'Planejamento', desc: 'Definição de escopo' },
    { label: 'Análise', desc: 'Levantamento técnico' },
    { label: 'Design', desc: 'Arquitetura e UI/UX' },
    { label: 'Desenvolvimento', desc: 'Implementação' },
    { label: 'Testes', desc: 'QA e validação' },
    { label: 'Deploy', desc: 'Produção' },
  ]);

  return <InfographicRenderer specification={sdlcSpec} />;
}
`;

export const projectManagement: MantineDemo = {
  type: 'code',
  component: ProjectManagementInfographic,
  code: projectManagementCode,
};

// Stack tecnológico
const techStackCode = `
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const frontendSpec = \\\`infographic card-simple
data
  items:
    - label: React
      value: Framework UI
      desc: Componentes reutilizáveis
    - label: TypeScript
      value: Tipagem Estática
      desc: Código type-safe
  \\\`;

  return <InfographicRenderer specification={frontendSpec} />;
}
`;

export const techStack: MantineDemo = {
  type: 'code',
  component: TechStackInfographic,
  code: techStackCode,
};

// Saúde e educação
const healthEducationCode = `
import { InfographicRenderer } from '@archbase/graphics';

function Demo() {
  const healthSpec = \\\`infographic card-simple
data
  items:
    - label: Frequência Cardíaca
      value: 72 bpm
      desc: Em repouso
    - label: IMC
      value: 22,5
      desc: Peso saudável
  \\\`;

  return <InfographicRenderer specification={healthSpec} />;
}
`;

export const healthEducation: MantineDemo = {
  type: 'code',
  component: HealthAndEducationInfographic,
  code: healthEducationCode,
};
