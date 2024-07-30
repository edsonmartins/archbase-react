import { ARCHBASE_IOC_API_TYPE, processDetailErrorMessage, processErrorMessage } from '@components/core';
import {
	ArchbaseDataTable,
	ArchbaseDataTableColumn,
	ArchbaseTableRowActions,
	Columns,
	ToolBarActions,
} from '@components/datatable';
import {
	useArchbaseDataSource,
	useArchbaseListContext,
	useArchbaseRemoteDataSource,
	useArchbaseRemoteServiceApi,
	useArchbaseStore,
	useArchbaseTheme,
	useArchbaseValidator,
} from '@components/hooks';
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

	const { dataSource } = useArchbaseDataSource<ApiTokenDto, string>({
		initialData: [],
		name: 'dataSource',
	});

	const { dataSource: dsApiTokens } = useArchbaseRemoteDataSource<ApiTokenDto, string>({
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

	const heightTab = `calc(${height} - 40px)`;

	const columns = (
		<Columns>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="user.avatar"
				dataType="image"
				size={50}
				header="Foto"
				render={(cell) => (
					<img
						style={{ borderRadius: 50, height: '36px', maxHeight: '36px' }}
						src={
							cell.row.original.user && cell.row.original.user.avatar ? atob(cell.row.original.user.avatar) : NO_USER
						}
					/>
				)}
				inputFilterType="text"
				align="center"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="user.userName"
				dataType="text"
				size={300}
				header="Nome de Usuário"
				inputFilterType="text"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="user.email"
				dataType="text"
				header="Email"
				size={300}
				inputFilterType="text"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="token"
				dataType="text"
				header="Token API"
				size={200}
				inputFilterType="text"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="expirationDate"
				dataType="text"
				size={300}
				header="Expira em"
				render={(cell) => <ArchbaseCountdownProgress color="orange" targetDate={cell.row.original.expirationDate} />}
				inputFilterType="text"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="activated"
				dataType="boolean"
				header="Ativado ?"
				inputFilterType="checkbox"
			/>
			<ArchbaseDataTableColumn<ApiTokenDto>
				dataField="revoked"
				dataType="boolean"
				header="Revogado ?"
				inputFilterType="checkbox"
			/>
		</Columns>
	);

	const handleCreateApiTokenExecute = () => {
		dataSource.insert(ApiTokenDto.newInstance());
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
							dsApiTokens.refreshData();
						})
						.catch((error) => {
							ArchbaseDialog.showErrorWithDetails(
								`${t('mentors:Atenção')}`,
								processErrorMessage(error),
								processDetailErrorMessage(error),
							);
						});
				},
				() => {},
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
						dataSource.cancel();
						dsApiTokens.append(response);
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

	return (
		<Paper style={{ height: height }}>
			<Box
				style={{
					height: heightTab,
					display: 'flex',
					width: '100%',
				}}
			>
				<ArchbaseDataTable<ApiTokenDto, string>
					printTitle={'Tokens de API'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsApiTokens}
					withColumnBorders={true}
					striped={true}
					enableTopToolbar={true}
					enableRowActions={true}
					pageSize={50}
					isError={false}
					enableGlobalFilter={true}
					renderToolbarInternalActions={undefined}
					error={<span></span>}
				>
					{columns}
					<ToolBarActions>
						<Flex justify={'space-between'} style={{ width: '50%' }}>
							<Group align="start" gap={'4px'}>
								<Button color={'green'} leftSection={<IconPlus />} onClick={handleCreateApiTokenExecute}>
									{t('archbase:New')}
								</Button>
								<Button disabled={!dsApiTokens.getCurrentRecord()} color={'red'} leftSection={<IconTrashX />} onClick={handleApiTokenRevokeRow}>
									{t('archbase:Revoke')}
								</Button>
							</Group>
						</Flex>
					</ToolBarActions>
				</ArchbaseDataTable>
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
