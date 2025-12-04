import { Group, Input, Loader, MantineSize, Popover, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useArchbaseTheme } from '@archbase/core'
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data'
import { useArchbaseDidUpdate } from '@archbase/data'
import { useArchbaseV1V2Compatibility } from '@archbase/data'
import { ArchbaseTreeNode, ArchbaseTreeView } from '../list'
import React, { ReactNode, forwardRef, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useValidationErrors } from '@archbase/core'

export interface ArchbaseTreeSelectProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor selecionado */
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o valor selecionado na fonte de dados */
  dataField?: string
  /** Indicador se o select está desabilitado */
  disabled?: boolean
  /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Indicador se o select está em estado de carregamento */
  loading?: boolean
  /** Indicador se o campo é obrigatório */
  required?: boolean
  /** Valor inicial controlado */
  value?: any
  /** Valor padrão inicial não controlado */
  defaultValue?: any
  /** Tamanho do select */
  size?: MantineSize
  /** Largura do select */
  width: string | number
  /** Altura do select */
  height?: string | number
  /** Largura do dropdown da árvore */
  widthTreeView?: string | number
  /** Altura do dropdown da árvore */
  heightTreeView?: string | number
  /** Ícone à esquerda do select */
  icon?: ReactNode
  /** Texto sugestão do select */
  placeholder?: string
  /** Título do select */
  label?: string
  /** Descrição do select */
  description?: string
  /** Último erro ocorrido no select */
  error?: string
  /** Opções da árvore disponíveis para seleção */
  options: ArchbaseTreeNode[]
  /** Tipos de nós que podem ser selecionados */
  allowNodeSelectType?: string[]
  /** Função customizada para renderizar o componente selecionado */
  renderComponent?: (node: ArchbaseTreeNode) => ReactNode
  /** Função que retorna o label de um nó */
  getOptionLabel?: (node: ArchbaseTreeNode) => string
  /** Função que retorna o valor de um nó */
  getOptionValue?: (node: ArchbaseTreeNode) => any
  /** Evento quando um valor é selecionado */
  onSelectValue?: (node: ArchbaseTreeNode) => void
  /** Evento quando o select recebe foco */
  onFocusEnter?: (event: React.FocusEvent<HTMLButtonElement>) => void
  /** Evento quando o foco sai do select */
  onFocusExit?: (event: React.FocusEvent<HTMLButtonElement>) => void
  /** Evento quando o popover é aberto */
  onDropdownOpen?: () => void
  /** Evento quando o popover é fechado */
  onDropdownClose?: () => void
}

// Função helper para extrair ID de um valor
const getValueId = (value: any): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'object' && value.id !== undefined) {
    return String(value.id);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return undefined;
};

// Função para encontrar um nó na árvore pelo valor (otimizada usando ID)
const findNodeByValueId = (nodes: ArchbaseTreeNode[], searchValue: any, getOptionValue: (node: ArchbaseTreeNode) => any): ArchbaseTreeNode | undefined => {
  let result: ArchbaseTreeNode | undefined;
  if (nodes) {
    const searchId = getValueId(searchValue);
    
    nodes.forEach(function (node) {
      // Tentar comparação por ID primeiro (mais eficiente e confiável)
      if (searchId !== undefined) {
        const nodeValue = getOptionValue(node);
        const nodeId = getValueId(nodeValue);
        if (nodeId === searchId) {
          result = node;
          return;
        }
      } else {
        // Fallback para comparação direta quando não há ID
        const nodeValue = getOptionValue(node);
        if (nodeValue === searchValue) {
          result = node;
          return;
        }
      }
      
      // Busca recursiva nos filhos
      if (node.nodes && !result) {
        result = findNodeByValueId(node.nodes, searchValue, getOptionValue);
      }
    });
  }
  return result;
};

// Função padrão para extrair o valor do nó (usar data)
const defaultGetNodeValue = (node: ArchbaseTreeNode): any => {
  return node.data;
};

// Função padrão para extrair o texto de exibição do nó
const defaultGetNodeLabel = (node: ArchbaseTreeNode): string => {
  return node.text;
};

export const ArchbaseTreeSelect = forwardRef<HTMLButtonElement, ArchbaseTreeSelectProps<any, any>>(
  <T, ID>({
    dataSource,
    dataField,
    disabled = false,
    readOnly = false,
    loading = false,
    required = false,
    value,
    defaultValue,
    size,
    width,
    height,
    widthTreeView,
    heightTreeView,
    icon,
    placeholder,
    label,
    description,
    error,
    options = [],
    allowNodeSelectType,
    renderComponent,
    getOptionLabel = defaultGetNodeLabel,
    getOptionValue = defaultGetNodeValue,
    onSelectValue,
    onFocusEnter,
    onFocusExit,
    onDropdownOpen,
    onDropdownClose,
  }: ArchbaseTreeSelectProps<T, ID>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const theme = useArchbaseTheme()

    // Estado interno
    const [internalValue, setInternalValue] = useState<any>(defaultValue)
    const [opened, setOpened] = useState<boolean>(false)
    const [internalError, setInternalError] = useState<string | undefined>(error)

    // 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade (silenciado)
    useArchbaseV1V2Compatibility<T>(
      'ArchbaseTreeSelect',
      dataSource,
      dataField,
      value !== undefined ? value : internalValue
    )

    // Contexto de validação (opcional - pode não existir)
    const validationContext = useValidationErrors()

    // Chave única para o field
    const fieldKey = `${dataField}`

    // Recuperar erro do contexto se existir
    const contextError = validationContext?.getError(fieldKey)

    // ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
    // Não limpar o internalError se o prop error for undefined
    useEffect(() => {
      if (error !== undefined && error !== internalError) {
        setInternalError(error)
      }
    }, [error])

    // Determinar se é controlado ou não
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : (dataSource && dataField ? dataSource.getFieldValue(dataField) : internalValue)

    // Encontrar o nó selecionado baseado no valor atual
    const currentSelectedNode = useMemo(() => {
      if (currentValue !== undefined && currentValue !== null && options.length > 0) {
        return findNodeByValueId(options, currentValue, getOptionValue)
      }
      return undefined
    }, [currentValue, options, getOptionValue])

    // Função para atualizar o valor
    const updateValue = useCallback((newValue: any, selectedNode?: ArchbaseTreeNode) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      
      if (dataSource && dataField) {
        dataSource.setFieldValue(dataField, newValue)
      }

      
      if (onSelectValue && selectedNode) {
        onSelectValue(selectedNode)
      }
    }, [dataSource, dataField, isControlled, onSelectValue])

    // Função para verificar se um nó pode ser selecionado
    const isNodeSelectable = useCallback((node: ArchbaseTreeNode): boolean => {
      if (!allowNodeSelectType || allowNodeSelectType.length === 0) {
        return true
      }
      return node.type ? allowNodeSelectType.includes(node.type) : false
    }, [allowNodeSelectType])

    // Handler para seleção de nó
    const handleNodeSelection = useCallback((node: ArchbaseTreeNode) => {
      if (isNodeSelectable(node)) {
        // ✅ Limpa erro quando usuário seleciona um valor (tanto do estado local quanto do contexto)
        const hasError = internalError || contextError
        if (hasError) {
          setInternalError(undefined)
          validationContext?.clearError(fieldKey)
        }

        const nodeValue = getOptionValue(node)
        updateValue(nodeValue, node)
        setOpened(false)

        if (onDropdownClose) {
          onDropdownClose()
        }
      }
    }, [isNodeSelectable, updateValue, onDropdownClose, getOptionValue, internalError, contextError, validationContext, fieldKey])

    // Handler para abertura/fechamento do popover
    const handleTogglePopover = useCallback(() => {
      if (disabled || readOnly) return
      
      const newOpened = !opened
      setOpened(newOpened)
      
      if (newOpened && onDropdownOpen) {
        onDropdownOpen()
      } else if (!newOpened && onDropdownClose) {
        onDropdownClose()
      }
    }, [disabled, readOnly, opened, onDropdownOpen, onDropdownClose])

    // Listener para mudanças no datasource
    const handleDataSourceEvent = useCallback(
      (event: DataSourceEvent<T>) => {
        // O React já re-renderiza automaticamente quando currentValue muda
        // via getFieldValue do datasource

        if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
          setInternalError(event.error)
          // Salvar no contexto (se disponível)
          validationContext?.setError(fieldKey, event.error)
        }
      },
      [dataField, validationContext, fieldKey]
    )

    // Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
    const handleDataSourceEventRef = useRef(handleDataSourceEvent)
    useEffect(() => {
      handleDataSourceEventRef.current = handleDataSourceEvent
    }, [handleDataSourceEvent])

    // Wrapper estável que delega para ref
    const stableHandleDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
      handleDataSourceEventRef.current(event)
    }, [])

    // Registrar listeners com cleanup apropriado
    useEffect(() => {
      if (dataSource) {
        dataSource.addListener(stableHandleDataSourceEvent)

        return () => {
          dataSource.removeListener(stableHandleDataSourceEvent)
        }
      }
    }, [dataSource, stableHandleDataSourceEvent])

    // useArchbaseDidUpdate removido - React já re-renderiza automaticamente
    // quando currentValue ou options mudam via suas dependências


    // Determinar se o componente é readonly
    const isReadOnly = readOnly || (dataSource ? !dataSource.isActive() || dataSource.isBrowsing() : false)
    const isDisabled = disabled || isReadOnly || loading

    // Texto a ser exibido
    const displayText = currentSelectedNode ? getOptionLabel(currentSelectedNode) : (placeholder || '')

    // Erro a ser exibido: local ou do contexto
    const displayError = internalError || contextError

    return (
      <Popover 
        opened={opened} 
        width={widthTreeView || "target"} 
        trapFocus 
        position="bottom-start" 
        withArrow 
        shadow="md" 
        withinPortal 
        closeOnEscape={true}
        clickOutsideEvents={['mouseup', 'touchend']}
        onClose={() => {
          setOpened(false)
          if (onDropdownClose) {
            onDropdownClose()
          }
        }}
      >
        <Popover.Target>
          <Input.Wrapper
            label={label}
            title={label}
            description={description}
            error={displayError}
            size={size}
            required={required}
          >
            <UnstyledButton
              ref={ref}
              disabled={isDisabled}
              onClick={handleTogglePopover}
              onFocus={onFocusEnter}
              onBlur={onFocusExit}
              style={{
                display: 'block',
                width,
                height: height || '36px',
                padding: '8px',
                color: isDisabled ? theme.colors.gray[5] : theme.colors.dark[9],
                backgroundColor: isDisabled ? theme.colors.gray[1] : theme.white,
                borderRadius: theme.radius.sm,
                border: `1px solid ${displayError ? theme.colors.red[6] : theme.colors.gray[4]}`,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                
                '&:hover': {
                  backgroundColor: isDisabled ? theme.colors.gray[1] : theme.colors.gray[0]
                }
              }}
            >
              {loading ? (
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <Loader size="xs" />
                    <Text 
                      truncate 
                      c="dimmed"
                      size={size}
                    >
                      {displayText}
                    </Text>
                  </Group>
                  <Loader size="xs" />
                </Group>
              ) : renderComponent && currentSelectedNode ? (
                renderComponent(currentSelectedNode)
              ) : (
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    {icon}
                    <Text 
                      truncate 
                      c={currentSelectedNode ? undefined : 'dimmed'}
                      size={size}
                    >
                      {displayText}
                    </Text>
                  </Group>
                  <IconChevronRight size="1rem" style={{ flexShrink: 0 }} />
                </Group>
              )}
            </UnstyledButton>
          </Input.Wrapper>
        </Popover.Target>
        
        <Popover.Dropdown
          style={{
            background: theme.white,
            padding: 0,
            height: heightTreeView || '200px'
          }}
          onBlur={(event) => {
            // Verificar se o foco está saindo completamente do dropdown
            const relatedTarget = event.relatedTarget as HTMLElement;
            const dropdown = event.currentTarget;
            
            // Só fechar se o foco não estiver indo para um elemento dentro do dropdown
            if (!relatedTarget || !dropdown.contains(relatedTarget)) {
              if (opened) {
                setOpened(false)
                if (onDropdownClose) {
                  onDropdownClose()
                }
              }
            }
          }}
        >
          <ArchbaseTreeView
            id="tree-select"
            dataSource={options}
            width="100%"
            height="100%"
            style={{ marginLeft: 0, marginBottom: 0 }}
            focusedNode={currentSelectedNode}
            onFocusedNode={handleNodeSelection}
            selectable={false}
            selectChildrenOnParentSelect={false}
            singleSelect={true}
            customRenderText={renderComponent}
          />
        </Popover.Dropdown>
      </Popover>
    )
  }
) as <T, ID>(props: ArchbaseTreeSelectProps<T, ID> & { ref?: React.ForwardedRef<HTMLButtonElement> }) => React.ReactElement
