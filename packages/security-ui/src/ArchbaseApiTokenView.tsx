/**
 * ArchbaseApiTokenView — listagem e gestão de tokens de API.
 * @status stable
 */
import { ARCHBASE_IOC_API_TYPE, getI18nextInstance, getNestedObjectValue, processDetailErrorMessage, processErrorMessage } from '@archbase/core';
import {
	useArchbaseDataSource,
	useArchbaseRemoteDataSource,
	useArchbaseRemoteServiceApi,
	useArchbaseStore,
} from '@archbase/data';
import { useArchbaseTheme } from '@archbase/core';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseDialog, ArchbaseNotifications } from '@archbase/components';
import {
	Button,
	Text,
	Flex,
	Group,
	Paper,
	useMantineColorScheme,
	RingProgress,
	Tooltip,
	Badge,
} from '@mantine/core';
import {
	IconPlus,
	IconTrashX,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import { useRef, useState } from 'react';
import { ApiTokenModal } from './ApiTokenModal';
import { ArchbaseApiTokenService } from '@archbase/security';
import { NO_USER } from './ArchbaseSecurityView';
import { ApiTokenDto } from '@archbase/security';
import { ArchbaseDataGridColumn } from '@archbase/components';
import { ArchbaseDataGrid, ArchbaseDataGridRef, Columns } from '@archbase/components';
// import { ArchbaseGridTemplateRef } from '@archbase/template'; // Removed to break circular dependency


interface ArchbaseApiTokenViewProps {
	height?: any;
	width?: any;
}

export function ArchbaseApiTokenView({ height = '400px', width = '100%' }: ArchbaseApiTokenViewProps) {
	const theme = useArchbaseTheme();
	const templateStore = useArchbaseStore('apiTokenStore');
	const validator = { validateEntity: () => [] }; // Mock validator returning empty error array
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
			ArchbaseNotifications.showError(getI18nextInstance().t('archbase:WARNING'), error, origin);
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
		<Columns>
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
				size={180}
				header="Validade"
				render={(data) => {
					if (!data.row.expirationDate) {
						return <Text c="dimmed">Sem expiração</Text>;
					}

					const today = new Date();
					today.setHours(0, 0, 0, 0);
					const expDate = new Date(data.row.expirationDate);
					expDate.setHours(0, 0, 0, 0);

					const diffTime = expDate.getTime() - today.getTime();
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

					// Calcular porcentagem para o gauge (baseado em 365 dias)
					const maxDays = 365;
					let percentage = Math.max(0, Math.min(100, (diffDays / maxDays) * 100));

					// Determinar cor baseado nos dias restantes
					let color = 'green';
					let label = '';

					if (diffDays < 0) {
						// Token vencido
						color = 'red';
						percentage = 100;
						label = `Vencido há ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? 's' : ''}`;
					} else if (diffDays === 0) {
						color = 'red';
						percentage = 5;
						label = 'Vence hoje';
					} else if (diffDays <= 7) {
						color = 'red';
						label = `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
					} else if (diffDays <= 30) {
						color = 'orange';
						label = `${diffDays} dias`;
					} else if (diffDays <= 90) {
						color = 'yellow';
						label = `${diffDays} dias`;
					} else {
						color = 'green';
						label = `${diffDays} dias`;
					}

					const tooltipText = diffDays < 0
						? `Vencido em ${expDate.toLocaleDateString()}`
						: `Expira em ${expDate.toLocaleDateString()}`;

					return (
						<Tooltip label={tooltipText} withArrow>
							<Group gap="xs" wrap="nowrap">
								<RingProgress
									size={36}
									thickness={4}
									roundCaps
									sections={[{ value: diffDays < 0 ? 100 : percentage, color }]}
								/>
								<Text size="sm" c={diffDays < 0 ? 'red' : undefined} fw={diffDays <= 7 ? 600 : undefined}>
									{label}
								</Text>
							</Group>
						</Tooltip>
					);
				}}
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
		</Columns>
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
				`${getI18nextInstance().t('archbase:Confirme')}`,
				`${getI18nextInstance().t('archbase:Deseja revogar o token de API do usuário ')}${dsApiTokens.getCurrentRecord().user.name} ?`,
				async () => {
					await apiTokenApi
						.revoke(dsApiTokens.getCurrentRecord().token)
						.then(async () => {
							ArchbaseNotifications.showSuccess(
								`${getI18nextInstance().t('mentors:Informação')}`,
								`${getI18nextInstance().t('mentors:Token de API revogado com sucesso!')}`,
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
								`${getI18nextInstance().t('mentors:Atenção')}`,
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
							`${getI18nextInstance().t('mentors:Informação')}`,
							`${getI18nextInstance().t('mentors:Token de API gerado com sucesso!')}`,
						);
						if (callback) {
							callback();
						}
					})
					.catch((error) => {
						ArchbaseDialog.showErrorWithDetails(
							`${getI18nextInstance().t('mentors:Atenção')}`,
							processErrorMessage(error),
							processDetailErrorMessage(error),
						);
					});
			} catch (ex) {
				ArchbaseDialog.showErrorWithDetails(
					`${getI18nextInstance().t('mentors:Atenção')}`,
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
						{getI18nextInstance().t('archbase:New')}
					</Button>
					<Button disabled={!dsApiTokens.getCurrentRecord()} color={'red'} leftSection={<IconTrashX />} onClick={handleApiTokenRevokeRow}>
						{getI18nextInstance().t('archbase:Revoke')}
					</Button>
				</Group>
			</Flex>
		);
	};

	return (
		<Paper p="md" style={{ height: height, display: 'flex', flexDirection: 'column' }}>
			<Paper
				withBorder
				style={{
					height: heightTab,
					display: 'flex',
					width: '100%',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
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
			</Paper>
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
