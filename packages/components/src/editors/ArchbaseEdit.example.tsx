/**
 * Exemplo prático: ArchbaseEdit híbrido suportando V1 e V2
 * 
 * Este exemplo demonstra como o mesmo componente ArchbaseEdit
 * funciona transparentemente com ambas as versões do DataSource
 */

import React from 'react';
import { ArchbaseEdit } from './ArchbaseEdit';
import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseRemoteDataSourceV2 } from '@archbase/data';

interface Pessoa {
  id: number;
  nome: string;
  email: string;
  idade: number;
}

export const ArchbaseEditExamples = () => {
  // ===== EXEMPLO 1: DataSource V1 (Comportamento Original) =====
  const dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('pessoas-v1', {
    records: [
      { id: 1, nome: 'João Silva', email: 'joao@test.com', idade: 30 },
      { id: 2, nome: 'Maria Santos', email: 'maria@test.com', idade: 25 }
    ],
    grandTotalRecords: 2,
    currentPage: 0,
    totalPages: 1,
    pageSize: 10
  });

  // ===== EXEMPLO 2: DataSource V2 (Comportamento Otimizado) =====
  const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
    name: 'pessoas-v2',
    records: [
      { id: 1, nome: 'João Silva V2', email: 'joao.v2@test.com', idade: 30 },
      { id: 2, nome: 'Maria Santos V2', email: 'maria.v2@test.com', idade: 25 }
    ]
  });

  // ===== EXEMPLO 3: RemoteDataSource V2 =====
  // (Para este exemplo, seria necessário um serviço real)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* === SEÇÃO V1: Comportamento Original === */}
      <section style={{ border: '2px solid #1976d2', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#1976d2', marginTop: 0 }}>
          DataSource V1 - Comportamento Original
        </h2>
        <p>
          <strong>Como funciona:</strong> Force update em cada mudança de evento, 
          listeners tradicionais, estado local do componente.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <ArchbaseEdit<Pessoa, number>
            label="Nome (V1)"
            dataSource={dataSourceV1}
            dataField="nome"
            placeholder="Digite o nome..."
            description="Campo usando DataSource V1"
            onChangeValue={(value, event) => {
              console.log('V1 - Nome alterado:', value);
            }}
          />
          
          <ArchbaseEdit<Pessoa, number>
            label="Email (V1)"
            dataSource={dataSourceV1}
            dataField="email"
            placeholder="Digite o email..."
            description="Campo usando DataSource V1"
            onChangeValue={(value, event) => {
              console.log('V1 - Email alterado:', value);
            }}
          />
        </div>
        
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Características V1:</strong>
          <ul>
            <li>Re-render com forceUpdate() em eventos</li>
            <li>Estado local em cada componente (currentValue)</li>
            <li>Listeners de campo específicos</li>
            <li>Compatibilidade total com código existente</li>
          </ul>
        </div>
      </section>

      {/* === SEÇÃO V2: Comportamento Otimizado === */}
      <section style={{ border: '2px solid #4caf50', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#4caf50', marginTop: 0 }}>
          DataSource V2 - Comportamento Otimizado com Immer
        </h2>
        <p>
          <strong>Como funciona:</strong> Detecta automaticamente que é V2, 
          usa estado otimizado, menos re-renders, imutabilidade garantida.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <ArchbaseEdit<Pessoa, number>
            label="Nome (V2)"
            dataSource={dataSourceV2 as any} // TypeScript cast para compatibilidade
            dataField="nome"
            placeholder="Digite o nome..."
            description="Campo usando DataSource V2 (detectado automaticamente)"
            onChangeValue={(value, event) => {
              console.log('V2 - Nome alterado:', value);
            }}
          />
          
          <ArchbaseEdit<Pessoa, number>
            label="Email (V2)"
            dataSource={dataSourceV2 as any}
            dataField="email"
            placeholder="Digite o email..."
            description="Campo usando DataSource V2 (detectado automaticamente)"
            onChangeValue={(value, event) => {
              console.log('V2 - Email alterado:', value);
            }}
          />
        </div>
        
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <strong>Vantagens V2:</strong>
          <ul>
            <li>✅ Detecta automaticamente V2 via duck typing</li>
            <li>✅ Estado otimizado (v2Value) para menos re-renders</li>
            <li>✅ Imutabilidade garantida por Immer</li>
            <li>✅ Performance melhorada</li>
            <li>✅ Zero breaking changes no código existente</li>
          </ul>
        </div>
      </section>

      {/* === SEÇÃO: Comparação Visual === */}
      <section style={{ border: '2px solid #ff9800', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#ff9800', marginTop: 0 }}>
          Demonstração: Sem Breaking Changes
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Código V1 (continua funcionando):</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`// Código existente - ZERO mudanças
const dataSource = new ArchbaseDataSource('pessoas', {
  records: pessoasList
});

return (
  <ArchbaseEdit
    dataSource={dataSource}
    dataField="nome"
    label="Nome"
  />
);`}
            </pre>
          </div>
          
          <div>
            <h4>Código V2 (performance otimizada):</h4>
            <pre style={{ backgroundColor: '#e8f5e8', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`// Apenas muda o DataSource - componente igual
const dataSource = new ArchbaseDataSourceV2({
  name: 'pessoas',
  records: pessoasList
});

return (
  <ArchbaseEdit
    dataSource={dataSource}  // ← Detecta V2 automaticamente
    dataField="nome"
    label="Nome"
  />
);`}
            </pre>
          </div>
        </div>
        
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
          <strong>🎯 Estratégia de Detecção:</strong>
          <pre style={{ margin: '10px 0', fontSize: '12px' }}>
{`// Detecção automática via duck typing
const isDataSourceV2 = dataSource && (
  'appendToFieldArray' in dataSource || 
  'updateFieldArrayItem' in dataSource
);

// Comportamento condicional transparente
if (isDataSourceV2) {
  // Usa estado otimizado V2
  setV2Value(changedValue);
} else {
  // Mantém comportamento V1 original
  setCurrentValue(changedValue);
  forceUpdate();
}`}
          </pre>
        </div>
      </section>

      {/* === SEÇÃO: Debug/Monitoramento === */}
      <section style={{ border: '2px solid #9c27b0', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#9c27b0', marginTop: 0 }}>
          Debug: Monitoramento em Tempo Real
        </h2>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h4>DataSource V1 Status:</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>Records: {dataSourceV1.getTotalRecords()}</li>
              <li>Current Index: {dataSourceV1.getCurrentIndex()}</li>
              <li>State: {dataSourceV1.isBrowsing() ? 'Browsing' : dataSourceV1.isEditing() ? 'Editing' : 'Inserting'}</li>
              <li>Current Record: {JSON.stringify(dataSourceV1.getCurrentRecord()?.nome || 'N/A')}</li>
            </ul>
          </div>
          
          <div style={{ flex: 1 }}>
            <h4>DataSource V2 Status:</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>Records: {dataSourceV2.getTotalRecords()}</li>
              <li>Current Index: {dataSourceV2.getCurrentIndex()}</li>
              <li>State: {dataSourceV2.isBrowsing() ? 'Browsing' : dataSourceV2.isEditing() ? 'Editing' : 'Inserting'}</li>
              <li>Current Record: {JSON.stringify(dataSourceV2.getCurrentRecord()?.nome || 'N/A')}</li>
              <li><strong>✨ V2 Features:</strong> Array ops, Immer, Optimized</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchbaseEditExamples;
