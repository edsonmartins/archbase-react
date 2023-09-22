import { ExpressionNode } from '@components/datasource/rsql/ast';
import { ActionIcon, ActionIconProps, Flex, Space, TextInput, TextInputProps } from '@mantine/core';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { emit } from '@components/datasource';
import builder from '@components/datasource/rsql/builder';
import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';

export interface ArchbaseGlobalFilterProps {
  /** Lista dos nomes dos campos a serem efetuados a pesquisa filtrada */
  searchableFields: string[];
  /** Evento ocorre quando é efetuado a pesquisa filtrada */
  onFilter: (buildedSearch: string) => void;
  /** Quantidade minima de carácteres do valor do filtro para que seja disparada a pesquisa filtrada */
  minFilterValueLength: number;
  /** Opções para personalização */
  options?: {
    inputProps?: TextInputProps;
    buttonProps?: ActionIconProps;
    iconProps?: {
      size?: string | number;
      color?: string;
    };
    spacing?: number | string;
  };
}

function buildSearchExpressionRSQL(searchableFields: string[], filterValue: string) {
  const nodes: ExpressionNode[] = [];
  searchableFields.forEach((searchableField) => {
    nodes.push(builder.eq(searchableField, filterValue));
  });

  return emit(builder.or(...nodes));
}

export function ArchbaseGlobalFilter({
  searchableFields,
  onFilter,
  minFilterValueLength,
  options,
}: ArchbaseGlobalFilterProps) {
  const [filterValue, setFilterValue] = useDebouncedState('', 200);
  const [lastBuildedSearch, setLastBuildedSearch] = useState('');

  const prevIsEmptySearchRef = useRef<boolean>(false);
  useEffect(() => {
    if (filterValue.length < minFilterValueLength && !prevIsEmptySearchRef.current) {
      onFilter('');
      setLastBuildedSearch('');
      prevIsEmptySearchRef.current = true;
    }

    if (filterValue.length >= minFilterValueLength) {
      const buildedSearch = buildSearchExpressionRSQL(searchableFields, filterValue);
      onFilter(buildedSearch);
      setLastBuildedSearch(buildedSearch);
      prevIsEmptySearchRef.current = false;
    }
  }, [filterValue, minFilterValueLength, onFilter, searchableFields]);

  function handleRefresh() {
    onFilter(lastBuildedSearch);
  }

  const inputProps = options && options.inputProps ? options.inputProps : { size: 'xs', miw: 240 };
  const buttonProps = options && options.buttonProps ? options.buttonProps : { color: 'blue', variant: 'filled' };
  const iconProps = options && options.iconProps ? options.iconProps : { size: '1.25rem', color: 'white' };
  const spacing = options && options.spacing ? options.spacing : 5;

  return (
    <Flex justify={'space-between'} align={'center'}>
      <TextInput
        icon={<IconSearch />}
        defaultValue={filterValue}
        onChange={(event) => setFilterValue(event.currentTarget.value)}
        {...inputProps}
      />
      <Space w={spacing} />
      <ActionIcon onClick={() => handleRefresh()} {...buttonProps}>
        <IconRefresh {...iconProps} />
      </ActionIcon>
    </Flex>
  );
}
