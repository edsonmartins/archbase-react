type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;
/**
 * useArchbaseTextSelection(ref)
 *
 * @description
 * hook para obter informações sobre a seleção de texto atual
 *
 */
export declare function useArchbaseTextSelection(target?: HTMLElement): {
    clientRect: ClientRect;
    isCollapsed: boolean;
    textContent: string;
};
export {};
//# sourceMappingURL=useArchbaseTextSelection.d.ts.map