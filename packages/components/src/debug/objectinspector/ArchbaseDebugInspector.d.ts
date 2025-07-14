export interface ArchbaseDebugInspectorProps {
    /** Título a ser exibido */
    title?: string;
    /** Título a ser exibido*/
    icon?: string | HTMLImageElement;
    /** Comando para abrir e fechar o Object Inspector */
    debugObjectInspectorHotKey?: string;
    /** Lista de objetos a serem inspecionados */
    objectsToInspect?: ArchbaseObjectToInspect[];
    /** Indica se o Object Inspector será visível inicialmente ou não */
    visible?: boolean;
    /** Altura inicial do Object Inspector */
    height?: number;
    /** Largura inicial do Object Inspector */
    width?: number;
}
export interface ArchbaseObjectToInspect {
    /**Nome do objeto a ser inspecionado*/
    name: string;
    /**Objeto a ser inspecionado*/
    object: NonNullable<unknown>;
}
export declare function ArchbaseDebugInspector({ title, icon, debugObjectInspectorHotKey, objectsToInspect, visible, height, width, }: ArchbaseDebugInspectorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseDebugInspector.d.ts.map