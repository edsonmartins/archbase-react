import React, { useState, useEffect } from 'react'
import {
  Button,
  Group,
  Box,
  Text,
  List,
  Checkbox,
  Stack,
  ActionIcon,
  ScrollArea,
  Paper,
  Tooltip
} from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { ArchbaseDataSource } from '@components/datasource'

// Definindo props com genéricos para os tipos de item das duas listas
export interface ArchbaseDualListSelectorProps<T, U> {
  availableItemsDS: ArchbaseDataSource<T, any>
  assignedItemsDS: ArchbaseDataSource<U, any>
  idFieldAvailable: string | ((item: T) => string)
  labelFieldAvailable: string | ((item: T) => string)
  idFieldAssigned: string | ((item: U) => string)
  labelFieldAssigned: string | ((item: U) => string)
  handleCreateAssociationObject: (item: T) => U
  width?: string
  height?: string
  titleAvailable?: string
  titleAssigned?: string
}

export function ArchbaseDualListSelector<T, U>({
  availableItemsDS,
  assignedItemsDS,
  idFieldAvailable,
  labelFieldAvailable,
  idFieldAssigned,
  labelFieldAssigned,
  handleCreateAssociationObject,
  width = '400px',
  height = '200px',
  titleAvailable = 'Disponíveis',
  titleAssigned = 'Selecionados'
}: ArchbaseDualListSelectorProps<T, U>) {
  const [availableItems, setAvailableItems] = useState<T[]>([])
  const [assignedItems, setAssignedItems] = useState<U[]>([])
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([])
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([])

  useEffect(() => {
    setAvailableItems(availableItemsDS.browseRecords())
    setAssignedItems(assignedItemsDS.browseRecords())
  }, [availableItemsDS, assignedItemsDS])

  const getItemId = (item: any, field: string | ((item: any) => string)): string =>
    typeof field === 'function' ? field(item) : item[field]

  const getItemLabel = (item: any, field: string | ((item: any) => string)): string =>
    typeof field === 'function' ? field(item) : item[field]

  const handleSelect = (setId: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setId((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleAdd = () => {
    selectedAvailable.forEach((id) => {
      const originalItem = availableItems.find((item) => getItemId(item, idFieldAvailable) === id)
      if (originalItem) {
        const newItem = handleCreateAssociationObject(originalItem)
        assignedItemsDS.insert(newItem)
        assignedItemsDS.save()
      }
    })
    setSelectedAvailable([])
  }

  const handleRemove = () => {
    selectedAssigned.forEach((id) => {
      const record = assignedItems.find((item) => getItemId(item, idFieldAssigned) === id)
      if (record) {
        // Preparando o objeto de critério dinâmico
        const criteria =
          typeof idFieldAssigned === 'function'
            ? { customId: idFieldAssigned(record) }
            : { [idFieldAssigned]: id }
        assignedItemsDS.remove(() => assignedItemsDS.locate(criteria))
      }
    })
    setSelectedAssigned([])
  }

  return (
    <Paper withBorder style={{ display: 'flex', width, height }}>
      <Box style={{ minWidth: '44%', minHeight: height }}>
        <Text>{titleAvailable}</Text>
        <List
          spacing="xs"
          size="sm"
          center
          listStyleType="none"
          style={{
            margin: '6px',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: 'calc(100% - 32px)'
          }}
        >
          {availableItems.map((item) => (
            <List.Item key={getItemId(item, idFieldAvailable)}>
              <Checkbox
                label={getItemLabel(item, labelFieldAvailable)}
                checked={selectedAvailable.includes(getItemId(item, idFieldAvailable))}
                onChange={() =>
                  handleSelect(setSelectedAvailable, getItemId(item, idFieldAvailable))
                }
                disabled={assignedItems.some(
                  (g) => getItemId(g, idFieldAssigned) === getItemId(item, idFieldAvailable)
                )}
              />
            </List.Item>
          ))}
        </List>
      </Box>
      <Stack gap={5} style={{ minWidth: '10%' }} justify="center" align="center">
        <Tooltip label="Adicionar">
          <ActionIcon onClick={handleAdd} disabled={!selectedAvailable.length}>
            <IconArrowRight />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Remover">
          <ActionIcon onClick={handleRemove} disabled={!selectedAssigned.length}>
            <IconArrowLeft />
          </ActionIcon>
        </Tooltip>
      </Stack>
      <Box style={{ minWidth: '44%', minHeight: height }}>
        <Text>{titleAssigned}</Text>
        <List
          spacing="xs"
          size="sm"
          center
          listStyleType="none"
          style={{
            margin: '6px',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: 'calc(100% - 32px)'
          }}
        >
          {assignedItems.map((item) => (
            <List.Item key={getItemId(item, idFieldAssigned)}>
              <Checkbox
                label={getItemLabel(item, labelFieldAssigned)}
                checked={selectedAssigned.includes(getItemId(item, idFieldAssigned))}
                onChange={() => handleSelect(setSelectedAssigned, getItemId(item, idFieldAssigned))}
              />
            </List.Item>
          ))}
        </List>
      </Box>
    </Paper>
  )
}
