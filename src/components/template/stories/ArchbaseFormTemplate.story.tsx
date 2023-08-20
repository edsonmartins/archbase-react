import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  useArchbaseDataSource,
  useArchbaseDataSourceListener,
  useArchbaseForceUpdate,
  useArchbaseLocalFilterDataSource,
  useArchbaseRemoteDataSource,
} from '@hooks/index';
import { Meta, StoryObj } from '@storybook/react';
import { Pessoa, pessoasData } from '@demo/index';
import { t } from 'i18next';
import { LocalFilter } from '@components/datasource/ArchbaseLocalFilterDataSource';
import { FakePessoaService } from '@demo/service/FakePessoaService';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { useArchbaseRemoteServiceApi } from '@components/hooks/useArchbaseRemoteServiceApi';
import { ArchbaseNotifications } from '@components/notification';
import { ArchbaseCheckbox, MaskPattern } from '@components/editors';
import { DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import {
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  OP_CONTAINS,
  OP_EQUALS,
  QueryField,
  QueryFieldValue,
  QueryFields,
  getDefaultEmptyFilter,
} from '@components/querybuilder';
import { ArchbasePanelTemplate } from '../ArchbasePanelTemplate';
import { Button } from '@mantine/core';
import { ArchbaseFormTemplate } from '../ArchbaseFormTemplate';
const filters: LocalFilter[] = [];

const ArchbaseFormTemplateExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const [debug, setDebug] = useState<boolean>(true);
  const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
  /**
   * Criando dataSource remoto
   * @param dataSource Fonte de dados
   */
  const {
    dataSource: dsPessoas,
    isLoading,
    error,
    isError,
    clearError,
  } = useArchbaseRemoteDataSource<Pessoa, number>({
    name: 'dsPessoas',
    service: pessoaApi,
    pageSize: 10,
    loadOnStart: true,
    currentPage: 0,
    onLoadComplete: (_dataSource) => {
      //
    },
    onDestroy: (_dataSource) => {
      //
    },
    onError: (error, origin) => {
      ArchbaseNotifications.showError(t('WARNING'), error, origin);
    },
  });

  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource: dsPessoas,
    listener: (_event: DataSourceEvent<Pessoa>): void => {
      //
    },
  });

  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });
  const { dataSource: dsFilters } = useArchbaseLocalFilterDataSource({ initialData: filters, name: 'dsFilters' });
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case DataSourceEventNames.fieldChanged: {
          forceUpdate();
          break;
        }
        default:
      }
    },
  });


  return (
    <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
      <ArchbaseFormTemplate title="Edição" isError={true} error='Testando erro'>

      </ArchbaseFormTemplate>
    </div>
  );
};

export default {
  title: 'Templates/Form template',
  component: ArchbaseFormTemplateExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseFormTemplateExample> = {
  args: {
    render: () => {
      <ArchbaseFormTemplateExample />;
    },
  },
};

const Container = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const getParentHeight = () => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parentHeight = containerRef.current.parentElement.clientHeight;
        setContainerHeight(parentHeight);
      }
    };

    getParentHeight(); // Set initial height
    window.addEventListener('resize', getParentHeight);
    return () => {
      window.removeEventListener('resize', getParentHeight);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid red', // Customize as needed
        // boxSizing: 'border-box',
        // position: 'relative',
        // overflow: 'hidden', // To handle content that might overflow
      }}
      ref={containerRef}
    >
      {children}
    </div>
  );
};
