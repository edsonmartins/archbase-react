import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { ActionIcon, ActionIconProps, Flex, Space, TextInput, TextInputProps } from '@mantine/core';
import { IconFilterX, IconRefresh, IconSearch } from '@tabler/icons-react';
import { emit } from '../datasource';
import builder from '../datasource/rsql/builder';
import { ExpressionNode } from '../datasource/rsql/ast';
import { useArchbaseTheme } from '../hooks';

export interface ArchbaseGlobalFilterProps {
  /** Lista dos nomes dos campos a serem efetuados a pesquisa filtrada */
  searchableFields: string[];
  /** Evento ocorre quando é efetuado a pesquisa filtrada */
  onFilter: (buildedQuery: string) => void;
  /** Quantidade minima de carácteres do valor do filtro para que seja disparada a pesquisa filtrada */
  minFilterValueLength: number;
  /** Opções para personalização */
  options?: {
    inputProps?: TextInputProps;
    buttonRefreshProps?: ActionIconProps;
    buttonClearProps?: ActionIconProps;
    iconRefreshProps?: {
      size?: string | number;
      color?: string;
    };
    iconClearProps?: {
      size?: string | number;
      color?: string;
    };
    spacing?: number | string;
  };
}

function buildSearchExpressionRSQL(searchableFields: string[], filterValue: string) {
  const nodes: ExpressionNode[] = [];
  searchableFields.forEach((searchableField) => {
    nodes.push(builder.eq(searchableField, `^*${filterValue}*`));
  });

  return emit(builder.or(...nodes));
}

export function ArchbaseGlobalFilter({
  searchableFields,
  onFilter,
  minFilterValueLength,
  options,
}: ArchbaseGlobalFilterProps) {
  const [filterValue, setFilterValue] = useState<string>('');
  const [debouncedFilterValue, setDebouncedFilterValue] = useDebouncedValue(filterValue, 500);
  const [lastBuildedSearch, setLastBuildedSearch] = useState('');
  const [lastValueSearch, setLastValueSearch] = useState('');
  const theme = useArchbaseTheme();

  const prevIsEmptySearchRef = useRef<boolean>(false);
  useEffect(() => {
    if (debouncedFilterValue.length < minFilterValueLength && !prevIsEmptySearchRef.current) {
      onFilter('');
      setLastBuildedSearch('');
      setLastValueSearch('');
      prevIsEmptySearchRef.current = true;
    }

    if (debouncedFilterValue.length >= minFilterValueLength && debouncedFilterValue !== lastValueSearch) {
      const buildedSearch = buildSearchExpressionRSQL(searchableFields, debouncedFilterValue);
      setLastBuildedSearch(buildedSearch);
      prevIsEmptySearchRef.current = false;
      setLastValueSearch(debouncedFilterValue);
      setDebouncedFilterValue();
      onFilter(buildedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterValue, minFilterValueLength, onFilter, searchableFields]);

  function handleRefresh(value: string) {
    onFilter(value);
  }

  const inputProps = options && options.inputProps ? options.inputProps : { miw: 240 };
  const buttonRefreshProps =
    options && options.buttonRefreshProps
      ? options.buttonRefreshProps
      : { color: theme.primaryColor, variant: 'filled' };
  const buttonClearProps =
    options && options.buttonClearProps ? options.buttonClearProps : { color: theme.primaryColor, variant: 'filled' };
  const iconRefreshProps =
    options && options.iconRefreshProps ? options.iconRefreshProps : { size: '1.5rem', color: 'white' };
  const iconClearProps =
    options && options.iconRefreshProps ? options.iconRefreshProps : { size: '1.5rem', color: 'white' };
  const spacing = options && options.spacing ? options.spacing : 5;

  return (
    <Flex justify={'space-between'} align={'center'}>
      <TextInput
        icon={<IconSearch />}
        variant="filled"
        defaultValue={filterValue}
        onChange={(event) => setFilterValue(event.currentTarget.value)}
        {...inputProps}
      />
      <Space w={spacing} />
      <ActionIcon
        color="primary"
        onClick={() => handleRefresh(lastBuildedSearch)}
        style={{ height: '36px', width: '36px' }}
        {...buttonRefreshProps}
      >
        <IconRefresh {...iconRefreshProps} />
      </ActionIcon>
      <Space w={spacing} />
      <ActionIcon
        color="primary"
        onClick={() => handleRefresh('')}
        style={{ height: '36px', width: '36px' }}
        {...buttonClearProps}
      >
        <IconFilterX {...iconClearProps} />
      </ActionIcon>
    </Flex>
  );
}
