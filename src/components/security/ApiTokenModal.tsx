import { ArchbaseDataSource } from '@components/datasource';
import { ArchbaseAsyncSelect, ArchbaseEdit, OptionsResult } from '@components/editors';
import { useArchbaseRemoteServiceApi } from '@components/hooks';
import { Page } from '@components/service';
import { ArchbaseFormModalTemplate } from '@components/template';
import { isBase64 } from '@components/validator';
import { Grid, Group, Image, ScrollArea, Text } from '@mantine/core';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { useFocusTrap } from '@mantine/hooks';
import { ARCHBASE_IOC_API_TYPE, builder, convertDateToISOString, emit, processErrorMessage } from '@components/core';
import { t } from 'i18next';
import React, { useState } from 'react';
import { NO_USER } from './ArchbaseSecurityView';
import { ArchbaseUserService } from './ArchbaseUserService';
import { ApiTokenDto, GroupDto, UserDto } from './SecurityDomain';

export const UserSelectItem = ({ image, label, description, ...others }) => (
	<div {...others}>
		<Group grow>
			<img style={{maxWidth:'32px'}} src={image} />
			<div>
				<Text size="sm">{label}</Text>
				<Text size="xs" opacity={0.65}>
					{description}
				</Text>
			</div>
		</Group>
	</div>
);

export interface ApiTokenModalProps {
	dataSource: ArchbaseDataSource<ApiTokenDto, string>;
	opened: boolean;
	onClickOk: (record?: ApiTokenDto, result?: any) => void;
	onClickCancel: (record?: ApiTokenDto) => void;
	onCustomSave?: (record?: ApiTokenDto, callback?: Function) => void;
	onAfterSave?: (record?: ApiTokenDto) => void;
}

export const ApiTokenModal = (props: ApiTokenModalProps) => {
	const focusTrapRef = useFocusTrap();
	const [value, setValue] = useState<DateValue | undefined>();
	const userApi = useArchbaseRemoteServiceApi<ArchbaseUserService>(ARCHBASE_IOC_API_TYPE.User);

	const handleChange = (value: DateValue) => {
		if (!value) {
			props.dataSource.setFieldValue('expirationDate', undefined);
		} else {
			props.dataSource.setFieldValue('expirationDate', convertDateToISOString(value));
		}
		setValue(value);
	};

	const loadRemoteUsers = async (page, value): Promise<OptionsResult<UserDto>> => {
		return new Promise<OptionsResult<UserDto>>(async (resolve, reject) => {
			try {
				const filter = emit(builder.or(builder.eq('name', `^*${value.trim()}*`)));
				const result: Page<UserDto> = await userApi.findAllWithFilter(filter, page, 20);
				resolve({
					options: result.content,
					page: result.pageable!.pageNumber,
					totalPages: result.totalPages,
				});
			} catch (error) {
				reject(processErrorMessage(error));
			}
		});
	};

	return (
		<ArchbaseFormModalTemplate
			title={t('archbase:Token de API')}
			size="50%"
			height={'400px'}
			dataSource={props.dataSource}
			opened={props.opened}
			onClickOk={props.onClickOk}
			onClickCancel={props.onClickCancel}
			onCustomSave={props.onCustomSave}
			onAfterSave={props.onAfterSave}
		>
			<ScrollArea ref={focusTrapRef} style={{ height: '300px' }}>
				<ArchbaseEdit
					label={`${t('archbase:Nome do token')}`}
					placeholder={`${t('archbase:Informe o nome do token')}`}
					dataSource={props.dataSource}
					dataField="name"
				/>
				<ArchbaseEdit
					label={`${t('archbase:Descrição do token')}`}
					placeholder={`${t('archbase:Informe a descrição do token')}`}
					dataSource={props.dataSource}
					dataField="description"
				/>
				<DateTimePicker
					withSeconds={true}
					value={value}
					onChange={handleChange}
					label="Data/hora expiração"
					placeholder={'Selecione a data de expiração'}
				/>
				<ArchbaseAsyncSelect<any, string, UserDto>
					label={`${t('archbase:Usuário')}`}
					dataSource={props.dataSource}
					dataField="user"
					placeholder={`${t('archbase:Digite aqui o nome do usuário')}`}
					getOptionLabel={(option: UserDto) => option && option.email!}
					getOptionValue={(option: UserDto) => option}
					getOptionImage={(option: UserDto) => {
						if (option) {
							return option.avatar && isBase64(option.avatar) ? atob(option.avatar) : NO_USER;
						}
					}}
					debounceTime={500}
					itemComponent={UserSelectItem}
					getOptions={loadRemoteUsers}
				/>
			</ScrollArea>
		</ArchbaseFormModalTemplate>
	);
};
