import React from 'react';
export interface ArchbaseAsyncSelectContextValue {
    /** Function para notificar o select que o dropdown chegou ao final da lista*/
    handleDropdownScrollEnded?: () => void;
}
declare const ArchbaseAsyncSelectContext: React.Context<ArchbaseAsyncSelectContextValue>;
declare const ArchbaseAsyncSelectProvider: React.Provider<ArchbaseAsyncSelectContextValue>;
export { ArchbaseAsyncSelectProvider, ArchbaseAsyncSelectContext };
//# sourceMappingURL=ArchbaseAsyncSelect.context.d.ts.map