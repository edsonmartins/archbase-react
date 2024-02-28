import { ArchbaseForm } from '@components/containers';
import { ArchbaseDataSource } from '@components/datasource';
import { ArchbaseList } from '@components/list';
import {
	ActionIcon,
	Box,
	Button,
	ButtonVariant,
	Checkbox,
	Grid,
	Input,
	Paper,
	Space,
	Text,
	Tooltip,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { t } from 'i18next';
import { cloneDeep } from 'lodash';
import React, { Component } from 'react';
import { CustomSortItem } from './ArchbaseAdvancedFilter';
import { ArchbaseQueryFilter, Field, getQuickFields, getQuickFieldsSort, SortField } from './ArchbaseFilterCommons';

interface ArchbaseFilterSelectFieldsProps {
	variant?: ButtonVariant | string;
	currentFilter: ArchbaseQueryFilter;
	fields: Field[];
	selectedOptions: Field[];
	sort: SortField[];
	id: string;
	key: string;
	width?: string | number | undefined;
	sortFocused?: boolean;
	onConfirmSelectFields?: (selectedFields: Field[], sortFields: SortField[], activeIndex: number) => void;
	onCancelSelectFields?: () => void;
}

interface ArchbaseFilterSelectFieldsState {
	selectedFields: Field[];
	sortFields: SortField[];
	allChecked: boolean;
	activeIndex: number;
	update: number;
}

class ArchbaseFilterSelectFields extends Component<ArchbaseFilterSelectFieldsProps, ArchbaseFilterSelectFieldsState> {
	constructor(props: ArchbaseFilterSelectFieldsProps) {
		super(props);
		const quickFields = cloneDeep(getQuickFields(props.fields));
		const sortFields = cloneDeep(getQuickFieldsSort(props.fields));
		this.state = {
			selectedFields: [...props.selectedOptions],
			sortFields: [...props.sort],
			allChecked: false,
			activeIndex: props.currentFilter.sort.activeIndex,
			update: Math.random(),
		};
	}

	onCheckboxChange = (_value, _checked: boolean, item) => {
		let selectedFields = [...this.state.selectedFields];
		if (_checked) {
			selectedFields.push(item);
		} else {
			selectedFields = this.state.selectedFields.filter((it) => it.name !== item.name);
		}
		this.setState({ ...this.state, selectedFields });
	};

	renderCheckboxFields = () => {
		if (this.props.fields) {
			return this.props.fields.map((sl) => {
				let checked = false;
				this.state.selectedFields.forEach((element) => {
					if (sl.name === element.name) {
						checked = true;
					}
				});

				return (
					<Checkbox
						label={sl.label}
						checked={checked}
						style={{ paddingBottom: '8px', cursor: 'pointer' }}
						onChange={(event) => this.onCheckboxChange(event.currentTarget.checked, event.currentTarget.checked, sl)}
					/>
				);
			});
		}
	};

	getSortItem = (field: string): SortField | undefined => {
		let result: SortField | undefined;
		this.state.sortFields.forEach(function (item) {
			if (item.name === field) {
				result = item;
			}
		});

		return result;
	};

	onChangeSortItem = (field: string, selected: any, order: any, asc_desc: any): void => {
		const item: SortField | undefined = this.getSortItem(field);
		if (item) {
			Object.assign(item, {
				selected,
				order,
				asc_desc,
				label: item.label,
			});
			let sortFields = this.state.sortFields;
			sortFields = sortFields.sort(function (a, b) {
				return a.order - b.order;
			});
			this.setState({
				...this.state,
				update: Math.random(),
				sortFields,
			});
		}
	};

	getSortItemByOrder = (order: number): SortField | undefined => {
		let result: SortField | undefined;
		this.state.sortFields.forEach(function (item) {
			if (item.order === order) {
				result = item;
			}
		});

		return result;
	};

	onSortDown = (_event: React.MouseEvent) => {
		let activeIndex = this.state.activeIndex;
		if (activeIndex >= 0) {
			const item = this.state.sortFields[activeIndex];
			if (item.order < this.state.sortFields.length - 1) {
				activeIndex = item.order + 1;
				const nextItem: SortField | undefined = this.getSortItemByOrder(item.order + 1);
				if (nextItem) {
					Object.assign(item, {
						order: item.order + 1,
					});
					Object.assign(nextItem, {
						order: nextItem.order - 1,
					});
				}
			}
			let sortFields = this.state.sortFields;
			sortFields = sortFields.sort(function (a, b) {
				return a.order - b.order;
			});
			this.setState({
				...this.state,
				sortFields,
				activeIndex,
			});
		}
	};

	onSortUp = (_event: React.MouseEvent) => {
		let activeIndex = this.state.activeIndex;
		if (activeIndex >= 0) {
			const item = this.state.sortFields[activeIndex];
			if (item.order > 0) {
				activeIndex = item.order - 1;
				const previousItem: SortField | undefined = this.getSortItemByOrder(item.order - 1);
				if (previousItem) {
					Object.assign(item, {
						order: item.order - 1,
					});
					Object.assign(previousItem, {
						order: previousItem.order + 1,
					});
				}
			}
			let sortFields = this.state.sortFields;
			sortFields = sortFields.sort(function (a, b) {
				return a.order - b.order;
			});
			this.setState({
				...this.state,
				sortFields,
				activeIndex,
			});
		}
	};

	onSelectListItem = (index: number, _item) => {
		this.setState({ ...this.state, activeIndex: index });
	};

	selectAllFields = (checked: boolean) => {
		const quickFields = cloneDeep(getQuickFields(this.props.fields));
		const selectedFields = checked ? quickFields : [];
		this.setState({ ...this.state, selectedFields, allChecked: checked });
	};

	render = () => {
		return (
			<div
				id={this.props.id}
				key={this.props.key}
				style={{ width: this.props.width, display: 'grid', justifyContent: 'center', height: '460px' }}
			>
				<ArchbaseForm>
					<Grid
						style={{
							paddingBottom: '10px',
							overflowY: 'auto',
							display: 'block',
							overflowX: 'hidden',
						}}
					>
						<Paper
							style={{
								padding: '10px',
								width: '100%',
							}}
						>
							<Text style={{ fontWeight: '700' }}>{t('archbase:Selecione os campos p/ o filtro rápido:')}</Text>
							<Checkbox
								checked={this.state.allChecked}
								style={{ cursor: 'pointer' }}
								onChange={(event) => this.selectAllFields(event.currentTarget.checked)}
								label={t('archbase:Selecionar todos ?')}
							/>
						</Paper>
						<Grid.Col
							style={{
								height: '128px',
								overflowY: 'auto',
								overflowX: 'hidden',
							}}
						>
							<Box>{this.renderCheckboxFields()}</Box>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col style={{ padding: 13 }}>
							<div
								className="sort-group-container"
								style={{
									height: '200px',
								}}
							>
								<div className="sort-header">
									<div style={{ display: 'flex' }}>
										<Tooltip withinPortal withArrow label="Para baixo">
											<ActionIcon id="btnFilterSortDown" onClick={this.onSortDown}>
												<IconArrowDown />
											</ActionIcon>
										</Tooltip>
										<Tooltip withinPortal withArrow label="Para cima">
											<ActionIcon id="btnFilterSortUp" onClick={this.onSortUp}>
												<IconArrowUp />
											</ActionIcon>
										</Tooltip>
									</div>
									<Text>{t('archbase:Ordenação')}</Text>
								</div>
								<div className="sort-body">
									<ArchbaseList<any, any>
										height="100%"
										width="100%"
										dataSource={
											new ArchbaseDataSource('dsSortFields', {
												records: this.state.sortFields,
												grandTotalRecords: this.state.sortFields.length,
												currentPage: 0,
												totalPages: 0,
												pageSize: 999999,
											})
										}
										withBorder={false}
										dataFieldId="name"
										dataFieldText="name"
										activeIndex={this.state.activeIndex}
										component={{
											type: CustomSortItem,
											props: {
												sortFocused: this.props.sortFocused,
												onChangeSortItem: this.onChangeSortItem,
												onSelectListItem: this.onSelectListItem,
											},
										}}
									/>
								</div>
							</div>
						</Grid.Col>
					</Grid>
				</ArchbaseForm>
				<Paper
					style={{
						display: 'flex',
						justifyContent: 'end',
						width: '100%',
						height: '40px',
						marginTop: '10px',
					}}
				>
					<Button
						variant={this.props.variant}
						onClick={() =>
							this.props.onConfirmSelectFields &&
							this.props.onConfirmSelectFields(this.state.selectedFields, this.state.sortFields, this.state.activeIndex)
						}
					>
						Aplicar
					</Button>
					<Space w={'sm'}></Space>
					<Button variant={this.props.variant} color="red" onClick={this.props.onCancelSelectFields}>
						Cancela
					</Button>
				</Paper>
			</div>
		);
	};
}

export { ArchbaseFilterSelectFields };
