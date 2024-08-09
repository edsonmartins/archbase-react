import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  TextInput,
  Select,
  Button,
  Group,
  Box,
  Paper,
  Input,
  ActionIcon,
  Tooltip,
  Stack
} from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'

interface ArchbaseKeyValueEditorProps {
  initialValue: string;
  keyLabel?: string;
  valueLabel?: string;
  valueOptions?: { value: string; label: string }[];
  onChangeKeyValue: (value: string) => void;
  pairSeparator?: string;
  keyValueSeparator?: string;
  useBraces?: boolean;
  readOnly?: boolean;
  label?: string;
  error?: string;
  tooltipAdd?: string;
  tooltipRemove?: string;
  layout?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ArchbaseKeyValueEditor({
  initialValue,
  keyLabel = 'Chave',
  valueLabel,
  valueOptions = [],
  onChangeKeyValue,
  pairSeparator = ';',
  keyValueSeparator = ',',
  useBraces = false,
  readOnly = false,
  label,
  error,
  tooltipAdd = 'Adicionar chave',
  tooltipRemove = 'Remover chave',
  layout = 'horizontal',
  spacing = 'xs'
}: ArchbaseKeyValueEditorProps) {
  const parseInitialValue = useCallback(
    (value) => {
      if (!value) {
        return [];
      }

      return value.split(pairSeparator).map((pair) => {
        const [key, val] = pair.split(keyValueSeparator);
        return {
          key: useBraces ? key.replace(/[{}]/g, "") : key,
          value: val,
        };
      });
    },
    [keyValueSeparator, pairSeparator, useBraces]
  );

  const [pairs, setPairs] = useState(parseInitialValue(initialValue))
  const lastInitialValue = useRef<string>();
  useEffect(() => {
    const newPairs = parseInitialValue(initialValue)

    if (JSON.stringify(newPairs) !== JSON.stringify(pairs)) {
      setPairs(newPairs)
    }
  }, [initialValue, pairSeparator, keyValueSeparator, useBraces, parseInitialValue])

  useEffect(() => {
    if (onChangeKeyValue) {
      if (lastInitialValue.current === initialValue) {
        const validPairs = pairs.filter((pair) => pair.key && pair.value);
        const formattedString = validPairs
          .map((pair) => {
            const key = useBraces ? `{${pair.key}}` : pair.key;
            return `${key}${keyValueSeparator}${pair.value}`;
          })
          .join(pairSeparator);

        if (formattedString !== initialValue) {
          onChangeKeyValue(formattedString);
        }
      } else {
        lastInitialValue.current = initialValue;
      }
    }
  }, [
    pairs,
    onChangeKeyValue,
    useBraces,
    pairSeparator,
    keyValueSeparator,
    initialValue,
  ]);

  const handleAddPair = () => {
    const newPairs = [...pairs, { key: '', value: '' }]
    setPairs(newPairs)
  }

  const handleRemovePair = (index) => {
    const newPairs = pairs.filter((_, i) => i !== index)
    setPairs(newPairs)
  }

  const handleKeyChange = (index, newKey) => {
    const newPairs = pairs.map((pair, i) => (i === index ? { ...pair, key: newKey } : pair))
    setPairs(newPairs)
  }

  const handleValueChange = (index, newValue) => {
    const newPairs = pairs.map((pair, i) => (i === index ? { ...pair, value: newValue } : pair))
    setPairs(newPairs)
  }

  const isPairIncomplete = pairs.some((pair) => !pair.key || !pair.value)

  const LayoutComponent = layout === 'horizontal' ? Group : Stack;

  const getKeyLabel = () => {
    if (keyLabel) {
      return keyLabel
    }
    return valueLabel && layout === 'horizontal' ? " " : ""
  }

  const getValueLabel = () => {
    if (valueLabel) {
      return valueLabel
    }
    return keyLabel && layout === 'horizontal' ? " " : ""
  }

  return (
    <Input.Wrapper label={label} error={error}>
      <Box>
        {pairs.map((pair, index) => (
          <Paper key={index} withBorder shadow="md" p="sm" mb="sm">
            <LayoutComponent align="center" wrap={layout === 'horizontal' ? 'nowrap' : 'wrap'} gap={spacing}>
              <TextInput
                placeholder={keyLabel}
                value={pair.key}
                label={getKeyLabel()}
                style={{ width: layout === 'vertical' ? '100%' : undefined }}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                readOnly={readOnly}
              />
              {valueOptions.length > 0 ? (
                <Select
                  data={valueOptions}
                  value={pair.value}
                  label={getValueLabel()}
                  style={{ width: layout === 'vertical' ? '100%' : undefined }}
                  onChange={(val) => handleValueChange(index, val)}
                  placeholder={valueLabel}
                  disabled={readOnly}
                />
              ) : (
                <TextInput
                  placeholder={valueLabel}
                  value={pair.value}
                  label={getValueLabel()}
                  style={{ width: layout === 'vertical' ? '100%' : undefined }}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  readOnly={readOnly}
                />
              )}
              {!readOnly &&
                <Tooltip label={tooltipRemove} withinPortal={true}>
                  {
                    layout === 'horizontal'
                      ? <ActionIcon style={{ marginTop: keyLabel || valueLabel ? 25 : 0 }} color="red" variant='filled' onClick={() => handleRemovePair(index)} >
                        <IconTrash></IconTrash>
                      </ActionIcon>
                      : <Button style={{ marginTop: '0px' }} color="red" variant='filled' onClick={() => handleRemovePair(index)} >
                        <IconTrash></IconTrash>
                        {"Remover"}
                      </Button>
                  }
                </Tooltip>}
            </LayoutComponent>
          </Paper>
        ))}
        {!readOnly && (
          <Tooltip label={tooltipAdd} withinPortal={true}>
            <ActionIcon
              onClick={handleAddPair}
              color="green"
              variant="filled"
              disabled={isPairIncomplete}
            >
              <IconPlus></IconPlus>
            </ActionIcon>
          </Tooltip>
        )}
      </Box>
    </Input.Wrapper>
  )
}
