/**
 * # ArchbaseDependencyProvider Component
 *
 * O `ArchbaseDependencyProvider` é um componente React que facilita a comunicação entre componentes em uma aplicação,
 * permitindo que se registrem como ouvintes de dependências específicas e sejam notificados sobre atualizações,
 * acompanhadas de dados relevantes.
 *
 * ## Uso
 *
 * Para utilizar, envolva os componentes com `ArchbaseDependencyProvider`. Dentro dos componentes filhos,
 * utilize o hook `useArchbaseDependency` para registrar ouvintes para dependências específicas ou para notificar
 * sobre atualizações de dependências.
 *
 * ## Exemplo
 *
 * ```jsx
 * import React from 'react';
 * import { ArchbaseDependencyProvider, useArchbaseDependency } from './ArchbaseDependencyManager';
 *
 * const App = () => (
 *   <ArchbaseDependencyProvider>
 *     <ChildComponent />
 *     <SiblingComponent />
 *   </ArchbaseDependencyProvider>
 * );
 *
 * const ChildComponent = () => {
 *   const { registerListener } = useArchbaseDependency();
 *
 *   useEffect(() => {
 *     const handleDataChange = (newData, extra) => {
 *       console.log('Data updated:', newData, 'Additional info:', extra);
 *     };
 *
 *     registerListener('key', handleDataChange);
 *   }, []);
 *
 *   return <div>Child Component</div>;
 * };
 *
 * const SiblingComponent = () => {
 *   const { enqueueUpdate } = useArchbaseDependency();
 *
 *   const updateData = () => {
 *     enqueueUpdate('key', 'updatedValue', { extraData: 'extraInfo' });
 *   };
 *
 *   return <button onClick={updateData}>Update Data</button>;
 * };
 * ```
 *
 * Este exemplo mostra como `SiblingComponent` pode notificar `ChildComponent` sobre atualizações,
 * usando o `ArchbaseDependencyProvider` para gerenciar a dependência 'key' entre eles.
 */
import React, { ReactNode } from 'react';
type UpdateQueueItem = {
    key: string;
    value: any;
    data: any;
};
interface ArchbaseDependencyProviderProps {
    children: ReactNode;
}
export declare const ArchbaseDependencyProvider: React.FC<ArchbaseDependencyProviderProps>;
export declare const useArchbaseDependency: () => {
    registerListener: (key: string, listener: Function) => void;
    removeListener: (key: string, listener: Function) => void;
    enqueueUpdate: (update: UpdateQueueItem) => void;
};
export {};
//# sourceMappingURL=ArchbaseDepencyManager.d.ts.map