import React, { ReactNode } from 'react';
export interface ActionButtonsCustomComponentsDefinition {
    largeButtonType?: React.ElementType;
    largeButtonProps?: any;
    mediumButtonType?: React.ElementType;
    mediumButtonProps?: any;
    smallButtonType?: React.ElementType;
    smallButtonProps?: any;
}
export interface ArchbaseAction {
    /** Id da Action */
    id: string;
    /** Ícone do Action Button */
    icon?: ReactNode;
    /** Cor do Action Button */
    color?: string;
    /** Título da Action Button */
    label: string;
    /** Ação a ser executada ao clicar no Action Button */
    executeAction: () => void;
    /** Indicador se o Action Button está habilitado para executar a ação */
    enabled: boolean;
    /** Detalhamento da ação para ajudar o usuário*/
    hint?: string;
}
export interface ArchbaseActionButtonsOptions {
    /** Limite que determina a partir de quantos px o botão maior será renderizado*/
    largerBreakPoint?: string;
    /** Limite que determina a partir de quantos px o botão menor será renderizado*/
    smallerBreakPoint?: string;
    /** Espaçamento do botão maior */
    largerSpacing?: string;
    /** Espaçamento do botão menor */
    smallerSpacing?: string;
    /** Variação do botão maior */
    largerButtonVariant?: string;
    /** Variação do botão menor */
    smallerButtonVariant?: string;
    /** Variação do item do menu */
    menuItemVariant?: string;
    /** Variação do botão do menu */
    menuButtonVariant?: string;
    /** Cor do botão do menu */
    menuButtonColor?: string;
    /** Posição do dropdown do menu */
    menuDropdownPosition?: 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start' | 'top-end' | 'top-start';
    /** Posição do menu */
    menuPosition?: 'right' | 'left';
    menuItemApplyActionColor?: boolean;
}
export interface ArchbaseActionButtonsProps {
    /** Lista de ações */
    actions: ArchbaseAction[];
    /**  Variação padrão para todo o componente, que será sobrescrito pela variação mais específica de options */
    variant?: string;
    /** Opções de personalização */
    options?: ArchbaseActionButtonsOptions;
    /** Definição dos componentes personalizados */
    customComponents?: ActionButtonsCustomComponentsDefinition;
}
export declare function ArchbaseActionButtons({ actions, variant, customComponents, options }: ArchbaseActionButtonsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseActionButtons.d.ts.map