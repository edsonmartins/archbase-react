import React from 'react';
/**
 * Props para o componente de pesquisa global
 */
export interface GlobalSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    debounceTime?: number;
}
/**
 * Componente para barra de pesquisa global integrado com Mantine
 * Usa debounce para evitar chamadas excessivas durante a digitação
 */
export declare const GlobalSearchInput: React.FC<GlobalSearchInputProps>;
export default GlobalSearchInput;
//# sourceMappingURL=global-search-input.d.ts.map