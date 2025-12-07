import { DataSourceListener } from './ArchbaseDataSource';

/**
 * Interface base para DataSources usados em componentes de binding.
 *
 * Esta interface define o contrato mínimo que TODOS os DataSources devem implementar
 * para serem compatíveis com componentes como ArchbaseEdit, ArchbaseSelect, etc.
 *
 * Tanto ArchbaseDataSource quanto ArchbaseRemoteDataSourceV2 implementam esta interface.
 *
 * @example
 * ```typescript
 * // Em componentes, use esta interface ao invés de classes concretas:
 * interface MyComponentProps<T> {
 *   dataSource?: IArchbaseDataSourceBase<T>;
 *   dataField?: string;
 * }
 * ```
 */
export interface IArchbaseDataSourceBase<T> {
  // =================== Identificação ===================

  /**
   * Retorna o nome do DataSource
   */
  getName(): string;

  // =================== Estado ===================

  /**
   * Verifica se o DataSource está ativo
   */
  isActive(): boolean;

  /**
   * Verifica se o DataSource está vazio (sem registros)
   */
  isEmpty(): boolean;

  /**
   * Verifica se o DataSource está em modo de navegação (browse)
   */
  isBrowsing(): boolean;

  /**
   * Verifica se o DataSource está em modo de edição
   */
  isEditing(): boolean;

  /**
   * Verifica se o DataSource está em modo de inserção
   */
  isInserting(): boolean;

  // =================== Registro Atual ===================

  /**
   * Retorna o registro atual ou undefined se não houver registro
   */
  getCurrentRecord(): T | undefined;

  /**
   * Retorna o índice do registro atual
   */
  getCurrentIndex(): number;

  // =================== Coleção de Registros ===================

  /**
   * Retorna o número total de registros na coleção filtrada
   */
  getTotalRecords(): number;

  /**
   * Retorna o número total de registros no servidor (para paginação)
   */
  getGrandTotalRecords(): number;

  /**
   * Retorna todos os registros da coleção filtrada
   */
  browseRecords(): T[];

  /**
   * Localiza um registro por valores de campos
   * @param values Objeto com campos/valores para busca
   * @returns true se encontrou, false caso contrário
   */
  locate(values: any): boolean;

  // =================== Navegação ===================

  /**
   * Vai para um registro pelo seu índice
   * @param index Índice do registro
   */
  gotoRecord(index: number): void;

  /**
   * Vai para um registro pelo seu dado
   * @param record Dados do registro para navegar
   * @returns true se encontrou, false caso contrário
   */
  gotoRecordByData(record: T): boolean;

  // =================== Paginação ===================

  /**
   * Retorna a página atual (0-indexed)
   */
  getCurrentPage(): number;

  /**
   * Retorna o tamanho da página
   */
  getPageSize(): number;

  // =================== Campos (Binding) ===================

  /**
   * Obtém o valor de um campo do registro atual
   * @param fieldName Nome do campo (suporta notação de ponto para campos aninhados)
   * @param defaultValue Valor padrão caso o campo seja undefined
   */
  getFieldValue(fieldName: string, defaultValue?: any): any;

  /**
   * Define o valor de um campo no registro atual
   * @param fieldName Nome do campo (suporta notação de ponto para campos aninhados)
   * @param value Novo valor do campo
   */
  setFieldValue(fieldName: string, value: any): void;

  // =================== Listeners ===================

  /**
   * Adiciona um listener para eventos do DataSource
   * @param listener Função que será chamada quando eventos ocorrerem
   */
  addListener(listener: DataSourceListener<T>): void;

  /**
   * Remove um listener de eventos do DataSource
   * @param listener Função a ser removida
   */
  removeListener(listener: DataSourceListener<T>): void;
}
