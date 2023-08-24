import React from 'react';
import {
  useArchbaseDataSource,
  useArchbaseDataSourceListener,
  useArchbaseForceUpdate,
  useArchbaseRemoteDataSource,
} from '@hooks/index';
import { Meta, StoryObj } from '@storybook/react';
import { Pessoa, pessoasData } from '@demo/index';
import { t } from 'i18next';
import { FakePessoaService } from '@demo/service/FakePessoaService';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { useArchbaseRemoteServiceApi } from '@components/hooks/useArchbaseRemoteServiceApi';
import { ArchbaseNotifications } from '@components/notification';
import { DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { ArchbaseFormTemplate } from '../ArchbaseFormTemplate';

const ArchbaseFormTemplateExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
  /**
   * Criando dataSource remoto
   * @param dataSource Fonte de dados
   */
  const {
    dataSource: dsPessoas,
    // isLoading,
    // error,
    // isError,
    // clearError,
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

  // const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
  //   currentFilter: getDefaultEmptyFilter(),
  //   activeFilterIndex: -1,
  //   expandedFilter: false,
  // });
  // const { dataSource: dsFilters } = useArchbaseLocalFilterDataSource({ initialData: filters, name: 'dsFilters' });
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
      <ArchbaseFormTemplate title="Edição" isError={true} error="Testando erro"></ArchbaseFormTemplate>
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
