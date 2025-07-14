import React from 'react';
export interface ArchbaseSelectContextValue {
    /** Function para notificar o select que o dropdown chegou ao final da lista*/
    handleDropdownScrollEnded?: () => void;
}
declare const ArchbaseSelectContext: React.Context<ArchbaseSelectContextValue>;
declare const ArchbaseSelectProvider: React.Provider<ArchbaseSelectContextValue>;
export { ArchbaseSelectContext, ArchbaseSelectProvider };
//# sourceMappingURL=ArchbaseSelect.context.d.ts.map