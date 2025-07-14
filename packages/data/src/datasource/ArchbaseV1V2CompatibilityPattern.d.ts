/**
 * Padrão de Compatibilidade V1/V2 para Componentes DataSource
 *
 * Este arquivo define o padrão obrigatório que TODOS os componentes
 * devem seguir para garantir compatibilidade entre V1 e V2.
 *
 * Baseado na implementação bem-sucedida do ArchbaseEdit.
 */
import { DataSourceEvent } from './ArchbaseDataSource';
/**
 * Hook obrigatório para compatibilidade V1/V2
 *
 * TODOS os componentes migrados DEVEM usar este hook.
 */
export declare function useArchbaseV1V2Compatibility<T>(componentName: string, dataSource: any, dataField?: string, initialValue?: T): {
    isDataSourceV2: boolean;
    dataSourceVersion: string;
    currentValue: T;
    v1State: {
        currentValue: T;
        setCurrentValue: import("react").Dispatch<import("react").SetStateAction<T>>;
        forceUpdate: () => void;
    };
    v2State: {
        v2Value: T;
        setV2Value: import("react").Dispatch<import("react").SetStateAction<T>>;
        v2ShouldUpdate: number;
    };
    loadDataSourceFieldValue: () => void;
    dataSourceEvent: (event: DataSourceEvent<any>) => void;
    handleValueChange: (newValue: T, event?: any) => void;
    isReadOnly: any;
    isEditing: any;
    trackUsage: () => void;
};
/**
 * Padrão para props de componentes compatíveis V1/V2
 */
export interface ArchbaseV1V2CompatibleProps<T, ID> {
    dataSource?: any;
    dataField?: string;
    value?: T;
    defaultValue?: T;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    style?: React.CSSProperties;
    width?: string | number;
    height?: string | number;
    onChangeValue?: (value: T, event: any) => void;
    onFocusEnter?: React.FocusEventHandler<any>;
    onFocusExit?: React.FocusEventHandler<any>;
    innerRef?: React.RefObject<any>;
}
/**
 * Utilitários para validação de migração
 */
export declare const MigrationValidation: {
    /**
     * Valida se o componente está seguindo o padrão corretamente
     */
    validatePattern: (componentName: string, hooks: ReturnType<typeof useArchbaseV1V2Compatibility>) => boolean;
    /**
     * Testa se o comportamento V1 está preservado
     */
    testV1Compatibility: (componentName: string, dataSource: any) => boolean;
};
/**
 * Exemplo de uso do padrão (para documentação)
 */
export declare const USAGE_EXAMPLE = "\n// Em qualquer componente que use DataSource:\n\nimport { useArchbaseV1V2Compatibility } from '../core/patterns/ArchbaseV1V2CompatibilityPattern';\n\nexport function MyComponent<T, ID>({ dataSource, dataField, value, onChangeValue, ...props }) {\n  // 1. USAR HOOK DE COMPATIBILIDADE (OBRIGAT\u00D3RIO)\n  const {\n    isDataSourceV2,\n    currentValue,\n    handleValueChange,\n    dataSourceEvent,\n    loadDataSourceFieldValue,\n    isReadOnly\n  } = useArchbaseV1V2Compatibility<T>(\n    'MyComponent',\n    dataSource,\n    dataField,\n    value\n  );\n\n  // 2. SETUP DOS LISTENERS (OBRIGAT\u00D3RIO)\n  useArchbaseDataSourceListener({\n    dataSource,\n    listener: dataSourceEvent\n  });\n\n  // 3. CARREGAMENTO INICIAL (OBRIGAT\u00D3RIO)\n  useEffect(() => {\n    loadDataSourceFieldValue();\n  }, [loadDataSourceFieldValue]);\n\n  // 4. HANDLER DE MUDAN\u00C7A (OBRIGAT\u00D3RIO)\n  const handleChange = useCallback((newValue: T, event: any) => {\n    handleValueChange(newValue, event);\n    \n    // Callback externo preservado\n    if (onChangeValue) {\n      onChangeValue(newValue, event);\n    }\n  }, [handleValueChange, onChangeValue]);\n\n  // 5. RENDERIZA\u00C7\u00C3O CONDICIONAL (OBRIGAT\u00D3RIO)\n  return (\n    <SomeInput\n      value={currentValue} // Usa valor correto baseado na vers\u00E3o\n      onChange={handleChange}\n      readOnly={isReadOnly}\n      {...props}\n    />\n  );\n}\n";
export default useArchbaseV1V2Compatibility;
//# sourceMappingURL=ArchbaseV1V2CompatibilityPattern.d.ts.map