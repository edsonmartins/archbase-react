import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseSelect, ArchbaseEdit } from '@archbase/components';
import { ArchbaseFormModalTemplate } from '@archbase/template';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import { Page } from '@archbase/data';
import { Modal } from '@mantine/core';
import { Grid, Group, Image, ScrollArea, Text } from '@mantine/core';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { useFocusTrap } from '@mantine/hooks';
import { ARCHBASE_IOC_API_TYPE, builder, convertDateToISOString, emit, processErrorMessage, OptionsResult, isBase64Validate } from '@archbase/core';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
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

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade para ApiTokenModal
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ApiTokenModal',
		props.dataSource,
		'expirationDate',
		''
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && props.dataSource) {
		console.log(`[ApiTokenModal] DataSource version: ${v1v2Compatibility.dataSourceVersion}`);
	}

	const handleChange = (value: DateValue) => {
		if (!value) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(undefined);
		} else {
			// Convert string to Date if needed before calling convertDateToISOString
			const dateValue = typeof value === 'string' ? new Date(value) : value;
			const isoString = convertDateToISOString(dateValue);
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(isoString);
		}
		setValue(value);
	};

	const loadRemoteUsers = async (page, value): Promise<OptionsResult<UserDto>> => {
		return new Promise<OptionsResult<UserDto>>(async (resolve, reject) => {
			try {
				const filter = emit(builder.or(builder.eq('name', `^*${value.trim()}*`)));
				const result: Page<UserDto> = await userApi.findAllWithFilter(filter, page, 20);
				resolve({
					data: result.content,
					page: result.pageable!.pageNumber,
					total: result.totalElements,
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
				<ArchbaseSelect<any, string, UserDto>
					label={`${t('archbase:Usuário')}`}
					dataSource={props.dataSource}
					dataField="user"
					placeholder={`${t('archbase:Digite aqui o nome do usuário')}`}
					getOptionLabel={(option: UserDto) => option && option.email!}
					getOptionValue={(option: UserDto) => option.id?.toString() || ''}
					debounceTime={500}
					itemComponent={UserSelectItem}
					options={[]}
				/>
			</ScrollArea>
		</ArchbaseFormModalTemplate>
	);
};
