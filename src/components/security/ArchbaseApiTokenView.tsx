import { ARCHBASE_IOC_API_TYPE, processDetailErrorMessage, processErrorMessage } from '@components/core';
import {
	useArchbaseDataSource,
	useArchbaseRemoteDataSource,
	useArchbaseRemoteServiceApi,
	useArchbaseStore,
	useArchbaseTheme,
	useArchbaseValidator,
} from '@components/hooks';
import { useArchbaseV1V2Compatibility } from '@components/core/patterns/ArchbaseV1V2CompatibilityPattern';
import { ArchbaseDialog, ArchbaseNotifications } from '@components/notification';
import {
	Badge,
	Box,
	Button,
	Flex,
	Group,
	LoadingOverlay,
	Paper,
	rem,
	Tabs,
	Text,
	useMantineColorScheme,
} from '@mantine/core';
import {
	IconPlus,
	IconShieldLock,
	IconSquareAsterisk,
	IconTrashX,
	IconUsers,
	IconUsersGroup,
	IconUserSquareRounded,
} from '@tabler/icons-react';
import { ArchbaseCountdownProgress } from '@components/editors';
import { t } from 'i18next';
import React, { Fragment, ReactNode, useRef, useState } from 'react';
import { ApiTokenModal } from './ApiTokenModal';
import { ArchbaseApiTokenService } from './ArchbaseApiTokenService';
import { NO_USER } from './ArchbaseSecurityView';
import { ApiTokenDto, GroupDto, ProfileDto, ResourceDto, UserDto } from './SecurityDomain';
import { ArchbaseDataGridColumn } from 'components/datagrid';
import { ArchbaseDataGrid, ArchbaseDataGridRef, GridColumns } from 'components/datagrid/main';
import { ArchbaseGridTemplateRef } from 'components/template/ArchbaseGridTemplate';


interface ArchbaseApiTokenViewProps {
	height?: any;
	width?: any;
}

export function ArchbaseApiTokenView({ height = '400px', width = '100%' }: ArchbaseApiTokenViewProps) {
	const theme = useArchbaseTheme();
	const templateStore = useArchbaseStore('apiTokenStore');
	const validator = useArchbaseValidator();
	const { colorScheme } = useMantineColorScheme();
	const [error, setError] = useState<string | undefined>(undefined);
	const apiTokenApi = useArchbaseRemoteServiceApi<ArchbaseApiTokenService>(ARCHBASE_IOC_API_TYPE.ApiToken);
	const [openedModal, setOpenedModal] = useState<string>('');
	const gridRef = useRef<ArchbaseDataGridRef | null>(null)

	// Função para obter o ID da linha
	const getRowId = (row: ApiTokenDto): string => {
		return row.id;
	};

	const { dataSource } = useArchbaseDataSource<ApiTokenDto, string>({
		initialData: [],
		name: 'dataSource',
	});

	// 🔄 MIGRAÇÃO V1/V2: Hooks de compatibilidade para DataSources
	const localDataSourceV1V2 = useArchbaseV1V2Compatibility<ApiTokenDto>(
		'ArchbaseApiTokenView-LocalDataSource',
		dataSource,
		undefined,
		undefined
	);

	const { dataSource: dsApiTokens, isLoading } = useArchbaseRemoteDataSource<ApiTokenDto, string>({
		name: 'dsApiToken',
		service: apiTokenApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade para DataSource remoto
	const remoteDataSourceV1V2 = useArchbaseV1V2Compatibility<ApiTokenDto>(
		'ArchbaseApiTokenView-RemoteDataSource',
		dsApiTokens,
		undefined,
		undefined
	);

	const heightTab = `calc(${height} - 40px)`;

	const columns = (
		<GridColumns>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="user.avatar"
				dataType="image"
				size={80}
				header="Foto"
				render={(data) => (
					<img
						style={{ borderRadius: 50, height: '32px', maxHeight: '32px' }}
						src={
							data.row.user && data.row.user.avatar ? atob(data.row.user.avatar) : NO_USER
						}
					/>
				)}
				inputFilterType="text"
				align="center"
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="user.userName"
				dataType="text"
				size={300}
				header="Nome de Usuário"
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="user.email"
				dataType="text"
				header="Email"
				size={240}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="token"
				dataType="text"
				header="Token API"
				size={260}
				inputFilterType="text"
				enableClickToCopy={true}
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="tenantId"
				dataType="text"
				header="Tenant ID"
				size={260}
				inputFilterType="text"
				enableClickToCopy={true}
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="expirationDate"
				dataType="text"
				size={300}
				header="Expira em"
				render={(data) => <ArchbaseCountdownProgress color="orange" targetDate={data.row.expirationDate} />}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="activated"
				dataType="boolean"
				header="Ativado ?"
				inputFilterType="checkbox"
			/>
			<ArchbaseDataGridColumn<ApiTokenDto>
				dataField="revoked"
				dataType="boolean"
				header="Revogado ?"
				inputFilterType="checkbox"
			/>
		</GridColumns>
	);

	const handleCreateApiTokenExecute = () => {
		// 🔄 MIGRAÇÃO V1/V2: Inserção com compatibilidade
		dataSource.insert(ApiTokenDto.newInstance());
		
		// Se for V1, forçar atualização
		if (dataSource && !localDataSourceV1V2.isDataSourceV2) {
			localDataSourceV1V2.v1State.forceUpdate();
		}
		
		setOpenedModal('apiToken');
	};

	const handleApiTokenRevokeRow = () => {
		if (dsApiTokens.getCurrentRecord()) {
			ArchbaseDialog.showConfirmDialogYesNo(
				`${t('archbase:Confirme')}`,
				`${t('archbase:Deseja revogar o token de API do usuário ')}${dsApiTokens.getCurrentRecord().user.name} ?`,
				async () => {
					await apiTokenApi
						.revoke(dsApiTokens.getCurrentRecord().token)
						.then(async () => {
							ArchbaseNotifications.showSuccess(
								`${t('mentors:Informação')}`,
								`${t('mentors:Token de API revogado com sucesso!')}`,
							);
							
							// 🔄 MIGRAÇÃO V1/V2: Refresh com compatibilidade
							dsApiTokens.refreshData();
							
							// Se for V1, forçar atualização
							if (dsApiTokens && !remoteDataSourceV1V2.isDataSourceV2) {
								remoteDataSourceV1V2.v1State.forceUpdate();
							}
						})
						.catch((error) => {
							ArchbaseDialog.showErrorWithDetails(
								`${t('mentors:Atenção')}`,
								processErrorMessage(error),
								processDetailErrorMessage(error),
							);
						});
				},
				() => { },
			);
		}
	};

	const handleCloseApiTokenModal = () => {
		setOpenedModal('');
	};

	const handleSaveApiToken = async (record?: ApiTokenDto, callback?: Function) => {
		const apiToken: ApiTokenDto | undefined = dataSource.getCurrentRecord();
		if (apiToken) {
			try {
				dataSource.validate();
				await apiTokenApi
					.create(apiToken.user.email, apiToken.expirationDate, apiToken.name, apiToken.description)
					.then(async (response: ApiTokenDto) => {
						// 🔄 MIGRAÇÃO V1/V2: Cancelar e adicionar com compatibilidade
						dataSource.cancel();
						
						// Se for V1, forçar atualização no local DataSource
						if (dataSource && !localDataSourceV1V2.isDataSourceV2) {
							localDataSourceV1V2.v1State.forceUpdate();
						}
						
						dsApiTokens.append(response);
						
						// Se for V1, forçar atualização no remote DataSource
						if (dsApiTokens && !remoteDataSourceV1V2.isDataSourceV2) {
							remoteDataSourceV1V2.v1State.forceUpdate();
						}
						
						ArchbaseNotifications.showSuccess(
							`${t('mentors:Informação')}`,
							`${t('mentors:Token de API gerado com sucesso!')}`,
						);
						if (callback) {
							callback();
						}
					})
					.catch((error) => {
						ArchbaseDialog.showErrorWithDetails(
							`${t('mentors:Atenção')}`,
							processErrorMessage(error),
							processDetailErrorMessage(error),
						);
					});
			} catch (ex) {
				ArchbaseDialog.showErrorWithDetails(
					`${t('mentors:Atenção')}`,
					processErrorMessage(ex),
					processDetailErrorMessage(ex),
				);
			}
		}
	};

	// Componente de ações da barra de ferramentas
	const renderToolbarActions = () => {
		return (
			<Flex justify={'space-between'} style={{ width: '50%' }}>
				<Group align="start" gap={'2px'} wrap="nowrap">
					<Button color={'green'} leftSection={<IconPlus />} onClick={handleCreateApiTokenExecute}>
						{t('archbase:New')}
					</Button>
					<Button disabled={!dsApiTokens.getCurrentRecord()} color={'red'} leftSection={<IconTrashX />} onClick={handleApiTokenRevokeRow}>
						{t('archbase:Revoke')}
					</Button>
				</Group>
			</Flex>
		);
	};

	return (
		<Paper style={{ height: height }}>
			<Box
				style={{
					height: heightTab,
					display: 'flex',
					width: '100%',
				}}
			>
				<ArchbaseDataGrid<ApiTokenDto, string>
					gridRef={gridRef}
					printTitle={'Tokens de API'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsApiTokens}
					withColumnBorders={true}
					striped={true}
					enableTopToolbar={true}
					enableRowActions={false}
					pageSize={50}
					isLoading={isLoading}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getRowId}
					toolbarLeftContent={renderToolbarActions()}
					children={columns}
				/>
			</Box>
			{openedModal === 'apiToken' ? (
				<ApiTokenModal
					onClickOk={handleCloseApiTokenModal}
					opened={true}
					dataSource={dataSource}
					onCustomSave={handleSaveApiToken}
					onClickCancel={handleCloseApiTokenModal}
				/>
			) : null}
		</Paper>
	);
}
