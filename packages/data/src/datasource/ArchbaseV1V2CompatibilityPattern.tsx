/**
 * Padrão de Compatibilidade V1/V2 para Componentes DataSource
 * 
 * Este arquivo define o padrão obrigatório que TODOS os componentes
 * devem seguir para garantir compatibilidade entre V1 e V2.
 * 
 * Baseado na implementação bem-sucedida do ArchbaseEdit.
 */

import { useState, useCallback, useRef } from 'react';
import { DataSourceEvent, DataSourceEventNames } from './ArchbaseDataSource';
import { detectDataSourceVersion, MigrationMetrics } from '@archbase/core';

/**
 * Hook obrigatório para compatibilidade V1/V2
 * 
 * TODOS os componentes migrados DEVEM usar este hook.
 */
export function useArchbaseV1V2Compatibility<T>(
  componentName: string,
  dataSource: any,
  dataField?: string,
  initialValue?: T
) {
  // 1. DETECÇÃO AUTOMÁTICA DE VERSÃO (OBRIGATÓRIO)
  const isDataSourceV2 = dataSource && (
    'appendToFieldArray' in dataSource || 
    'updateFieldArrayItem' in dataSource
  );
  
  // Versão detectada automaticamente

  // 2. ESTADOS DUAIS V1/V2 (OBRIGATÓRIO)
  // V1: Estado tradicional + forceUpdate
  const [currentValue, setCurrentValue] = useState<T>(initialValue as T);
  const [, forceUpdateState] = useState(0);
  const forceUpdate = useCallback(() => {
    forceUpdateState(prev => prev + 1);
  }, []);

  // V2: Estado otimizado (sem forceUpdate)
  const [v2Value, setV2Value] = useState<T>(initialValue as T);
  const [v2ShouldUpdate, setV2ShouldUpdate] = useState(0);

  // 3. CARREGAMENTO CONDICIONAL DE VALORES (OBRIGATÓRIO)
  const loadDataSourceFieldValue = useCallback(() => {
    let fieldValue: any = initialValue;
    
    if (dataSource && dataField) {
      fieldValue = dataSource.getFieldValue(dataField);
      if (fieldValue === null || fieldValue === undefined) {
        fieldValue = initialValue;
      }
    }

    if (isDataSourceV2) {
      // V2: Atualização otimizada
      setV2Value(fieldValue);
      setV2ShouldUpdate(prev => prev + 1);
    } else {
      // V1: Comportamento original
      setCurrentValue(fieldValue);
    }
  }, [dataSource, dataField, initialValue, isDataSourceV2]);

  // 4. EVENT LISTENER CONDICIONAL (OBRIGATÓRIO)
  const dataSourceEvent = useCallback((event: DataSourceEvent<any>) => {
    if (dataSource && dataField) {
      // Eventos que requerem atualização do valor
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel ||
        event.type === DataSourceEventNames.afterEdit
      ) {
        loadDataSourceFieldValue();
        
        // CRÍTICO: forceUpdate apenas para V1
        if (!isDataSourceV2) {
          forceUpdate();
        }
        // V2 atualiza automaticamente via estado otimizado
      }
      
      // Tratamento de erros de campo
      if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
        // Tratar erro específico do campo
        console.warn(`[${componentName}] Field error:`, event.error);
      }
    }
  }, [dataSource, dataField, loadDataSourceFieldValue, forceUpdate, isDataSourceV2, componentName]);

  // 5. MANIPULAÇÃO DE MUDANÇAS CONDICIONAL (OBRIGATÓRIO)
  const handleValueChange = useCallback((newValue: T, event?: any) => {
    if (isDataSourceV2) {
      // V2: Otimizado com menos re-renders
      setV2Value(newValue);
      if (dataSource && !dataSource.isBrowsing() && dataField) {
        const currentFieldValue = dataSource.getFieldValue(dataField);
        if (currentFieldValue !== newValue) {
          dataSource.setFieldValue(dataField, newValue);
        }
      }
    } else {
      // V1: Comportamento original mantido
      setCurrentValue(newValue);
      if (dataSource && !dataSource.isBrowsing() && dataField) {
        const currentFieldValue = dataSource.getFieldValue(dataField);
        if (currentFieldValue !== newValue) {
          dataSource.setFieldValue(dataField, newValue);
        }
      }
    }
  }, [dataSource, dataField, isDataSourceV2]);

  // 6. MÉTRICAS E MONITORAMENTO (OPCIONAL MAS RECOMENDADO)
  const trackUsage = useCallback(() => {
    const version = detectDataSourceVersion(dataSource);
    MigrationMetrics.trackV2Usage(componentName, version);
  }, [componentName, dataSource]);

  // Chamar métricas uma vez no mount
  useRef(() => {
    if (process.env.NODE_ENV === 'production') {
      trackUsage();
    }
  }).current;

  return {
    // Detecção de versão
    isDataSourceV2,
    dataSourceVersion: detectDataSourceVersion(dataSource),
    
    // Estados
    currentValue: isDataSourceV2 ? v2Value : currentValue,
    v1State: { currentValue, setCurrentValue, forceUpdate },
    v2State: { v2Value, setV2Value, v2ShouldUpdate },
    
    // Funções
    loadDataSourceFieldValue,
    dataSourceEvent,
    handleValueChange,
    
    // Utilitários
    isReadOnly: dataSource ? dataSource.isBrowsing() : false,
    isEditing: dataSource ? dataSource.isEditing() : false,
    trackUsage
  };
}

/**
 * Padrão para props de componentes compatíveis V1/V2
 */
export interface ArchbaseV1V2CompatibleProps<T, ID> {
  // Props obrigatórias de DataSource
  dataSource?: any; // Aceita V1 ou V2
  dataField?: string;
  
  // Props de valor (para uso sem DataSource)
  value?: T;
  defaultValue?: T;
  
  // Props de comportamento
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  
  // Props de estilo
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  
  // Props de eventos (DEVEM ser preservadas identicamente)
  onChangeValue?: (value: T, event: any) => void;
  onFocusEnter?: React.FocusEventHandler<any>;
  onFocusExit?: React.FocusEventHandler<any>;
  
  // Props de referência
  innerRef?: React.RefObject<any>;
}

/**
 * Utilitários para validação de migração
 */
export const MigrationValidation = {
  /**
   * Valida se o componente está seguindo o padrão corretamente
   */
  validatePattern: (componentName: string, hooks: ReturnType<typeof useArchbaseV1V2Compatibility>) => {
    const issues: string[] = [];
    
    // Validar detecção de versão
    if (hooks.dataSourceVersion === 'NONE' && hooks.isDataSourceV2) {
      issues.push('DataSource version detection inconsistent');
    }
    
    // Validar estados
    if (hooks.isDataSourceV2 && hooks.v1State.currentValue === hooks.currentValue) {
      issues.push('V2 should use v2Value, not v1 currentValue');
    }
    
    if (!hooks.isDataSourceV2 && hooks.v2State.v2Value === hooks.currentValue) {
      issues.push('V1 should use currentValue, not v2Value');
    }
    
    if (issues.length > 0) {
      console.error(`[${componentName}] Migration pattern validation failed:`, issues);
      return false;
    }
    
    return true;
  },

  /**
   * Testa se o comportamento V1 está preservado
   */
  testV1Compatibility: (componentName: string, dataSource: any) => {
    if (!dataSource || detectDataSourceVersion(dataSource) !== 'V1') {
      return true; // Não aplicável
    }
    
    // Testes básicos de compatibilidade V1
    const hasRequiredMethods = [
      'isBrowsing',
      'isEditing', 
      'getFieldValue',
      'setFieldValue'
    ].every(method => typeof dataSource[method] === 'function');
    
    if (!hasRequiredMethods) {
      console.error(`[${componentName}] V1 DataSource missing required methods`);
      return false;
    }
    
    return true;
  }
};

/**
 * Exemplo de uso do padrão (para documentação)
 */
export const USAGE_EXAMPLE = `
// Em qualquer componente que use DataSource:

import { useArchbaseV1V2Compatibility } from '../core/patterns/ArchbaseV1V2CompatibilityPattern';

export function MyComponent<T, ID>({ dataSource, dataField, value, onChangeValue, ...props }) {
  // 1. USAR HOOK DE COMPATIBILIDADE (OBRIGATÓRIO)
  const {
    isDataSourceV2,
    currentValue,
    handleValueChange,
    dataSourceEvent,
    loadDataSourceFieldValue,
    isReadOnly
  } = useArchbaseV1V2Compatibility<T>(
    'MyComponent',
    dataSource,
    dataField,
    value
  );

  // 2. SETUP DOS LISTENERS (OBRIGATÓRIO)
  useArchbaseDataSourceListener({
    dataSource,
    listener: dataSourceEvent
  });

  // 3. CARREGAMENTO INICIAL (OBRIGATÓRIO)
  useEffect(() => {
    loadDataSourceFieldValue();
  }, [loadDataSourceFieldValue]);

  // 4. HANDLER DE MUDANÇA (OBRIGATÓRIO)
  const handleChange = useCallback((newValue: T, event: any) => {
    handleValueChange(newValue, event);
    
    // Callback externo preservado
    if (onChangeValue) {
      onChangeValue(newValue, event);
    }
  }, [handleValueChange, onChangeValue]);

  // 5. RENDERIZAÇÃO CONDICIONAL (OBRIGATÓRIO)
  return (
    <SomeInput
      value={currentValue} // Usa valor correto baseado na versão
      onChange={handleChange}
      readOnly={isReadOnly}
      {...props}
    />
  );
}
`;

export default useArchbaseV1V2Compatibility;
