import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

import { Pessoa } from '../data/types';
import { ArchbaseTemplateState } from '@components/template';
import { ArchbaseRemoteDataSource } from '@components/datasource';

export interface PessoaState extends ArchbaseTemplateState<Pessoa, number> {}

export const usePessoaStore = create<PessoaState>((set) => ({
  nameStore: 'PESSOA',
  dataSource: undefined,
  setDataSource: (ds: ArchbaseRemoteDataSource<Pessoa, number>) => set({ dataSource: ds }),
  clearDataSource: () => set({ dataSource: undefined }),
  dataSourceEdition: undefined,
  setDataSourceEdition: (ds: ArchbaseRemoteDataSource<Pessoa, number>) => set({ dataSourceEdition: ds }),
  clearDataSourceEdition: () => set({ dataSourceEdition: undefined }),
}));

export const usePessoaTrackedStore = createTrackedSelector(usePessoaStore);
