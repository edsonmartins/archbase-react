/* eslint-disable */
import {
	ActionIcon,
	Button,
	ButtonVariant,
	Card,
	Checkbox,
	Chip,
	Grid,
	Group,
	Space,
	Switch,
	Text,
	Tooltip,
	useMantineColorScheme,
} from '@mantine/core';
import {
	DatePickerInput,
	DatesRangeValue,
	DateValue,
	TimeInput,
} from '@mantine/dates';
import {
	IconArrowDown,
	IconArrowUp,
	IconSearch,
	IconTrash,
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';
import debounce from 'lodash.debounce';
import React, { Component, CSSProperties, ReactNode } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { ArchbaseAppContext, ArchbaseError, ltrim } from '../core';
import { ArchbaseDataSource } from '../datasource';
import {
	ArchbaseCheckbox,
	ArchbaseEdit,
	ArchbaseSelect,
	ArchbaseSelectItem,
} from '../editors';
import {
	ArchbaseDateTimePickerEdit,
	ArchbaseDateTimePickerRange,
	ArchbaseSwitch,
} from '../editors';
import { ArchbaseList, ArchbaseListContext } from '../list';
import {
	ADVANCED,
	ArchbaseQueryFilter,
	Condition,
	DataType,
	Field,
	FilterValue,
	getDefaultEmptyFilter,
	getDefaultFilter,
	getSortString,
	Operator,
	Rule,
	Schema,
	SelectedSort,
	SortField,
} from './ArchbaseFilterCommons';


interface ArchbaseAdvancedFilterProps<_T, _ID> {
	id: string;
	currentFilter: ArchbaseQueryFilter;
	activeFilterIndex: number;
	children?: ReactNode | ReactNode[];
	onFilterChanged: (
		currentFilter: ArchbaseQueryFilter,
		activeFilterIndex: number,
	) => void;
	onApplyFilterClick?: (filter: ArchbaseQueryFilter) => void;
	horizontal?: boolean;
	operators: Operator[];
	conditions: Condition[];
	getOperators: (args) => any;
	onError?: (error: string) => void;
	height?: string;
	width?: string;
	allowSort?: boolean;
	disabled?: boolean;
	onSearchButtonClick?: () => void;
	border?: string;
	variant?: ButtonVariant;
}

interface ArchbaseAdvancedFilterState {
	currentFilter: ArchbaseQueryFilter;
	modalOpen?: string;
	activeFilterIndex: number;
	schema: Schema;
	sortFocused?: string;
}

class ArchbaseAdvancedFilter<T, ID> extends Component<
	ArchbaseAdvancedFilterProps<T, ID>,
	ArchbaseAdvancedFilterState
> {
	static defaultProps = {
		operators: [
			{
				name: 'null',
				label: 'Em branco',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
			},
			{
				name: 'notNull',
				label: 'Preenchido',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
			},
			{
				name: 'contains',
				label: 'Contém',
				dataTypes: ['string'],
			},
			{
				name: 'startsWith',
				label: 'Iniciado com',
				dataTypes: ['string'],
			},
			{
				name: 'endsWith',
				label: 'Terminado com',
				dataTypes: ['string'],
			},
			{
				name: '=',
				label: 'Igual',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
			},
			{
				name: '!=',
				label: 'Diferente',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
			},
			{
				name: '<',
				label: 'Menor',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
			},
			{
				name: '>',
				label: 'Maior',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
			},
			{
				name: '<=',
				label: 'Menor igual',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
			},
			{
				name: '>=',
				label: 'Maior igual',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
			},
			{
				name: 'between',
				label: 'Entre',
				dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
			},
			{
				name: 'inList',
				label: 'Na lista',
				dataTypes: ['string', 'number', 'date', 'time'],
			},
			{
				name: 'notInList',
				label: 'Fora da lista',
				dataTypes: ['string', 'number', 'date', 'time'],
			},
		],
		conditions: [
			{
				name: 'and',
				label: 'E',
			},
			{
				name: 'or',
				label: 'Ou',
			},
		],
		getOperators: null,
		onFilterChanged: null,
		allowSort: true,
		disabled: false,
		horizontal: true,
		sortFocused: '',
		width: '100%',
		border: '1px solid silver',
	};
	constructor(props: ArchbaseAdvancedFilterProps<T, ID>) {
		super(props);
		this.state = {
			modalOpen: '',
			currentFilter: props.currentFilter
				? props.currentFilter
				: getDefaultEmptyFilter(),
			activeFilterIndex: props.currentFilter ? props.activeFilterIndex : -1,
			schema: this.createSchema(),
		};
	}

	shouldComponentUpdate = (
		nextProps: ArchbaseAdvancedFilterProps<T, ID>,
		nextState: ArchbaseAdvancedFilterState,
	) => {
		return shallowCompare(this, nextProps, nextState);
	};

	getQuickFields = () => {
		let result: any = [];
		this.getFields(this.props).forEach(function (field) {
			if (field.quickFilter === true) {
				result.push({ name: field.name, label: field.label });
			}
		}, this);

		return result;
	};

	getQuickFilterSort = (): string => {
		let result: string = '';
		let appendDelimiter = false;
		this.getFields(this.props).forEach(function (field) {
			if (field.quickFilterSort === true) {
				if (appendDelimiter) result += ',';
				result += field.name;
				appendDelimiter = true;
			}
		}, this);

		return result;
	};

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		let currentFilter = nextProps.currentFilter;
		let activeFilterIndex = nextProps.activeFilterIndex;
		if (!currentFilter || !currentFilter.hasOwnProperty('filter')) {
			currentFilter = getDefaultFilter(nextProps, ADVANCED);
			activeFilterIndex = -1;
		}
		this.setState({
			...this.state,
			currentFilter,
			activeFilterIndex,
		});
	};

	createRuleGroup = (): Rule => {
		return {
			id: `g-${uniqueId()}`,
			rules: [],
			condition: this.props.conditions![0].name,
		};
	};

	createSchema = (): Schema => {
		const { operators, conditions } = this.props;

		return {
			fields: this.getFields(this.props),
			operators,
			conditions,
			createRule: this.createRule.bind(this),
			createRuleGroup: this.createRuleGroup.bind(this),
			onRuleAdd: this._notifyQueryChange.bind(this, this.onRuleAdd),
			onGroupAdd: this._notifyQueryChange.bind(this, this.onGroupAdd),
			onRuleRemove: this._notifyQueryChange.bind(this, this.onRuleRemove),
			onGroupRemove: this._notifyQueryChange.bind(this, this.onGroupRemove),
			onPropChange: this._notifyQueryChange.bind(this, this.onPropChange),
			getLevel: this.getLevel.bind(this),
			isRuleGroup: this.isRuleGroup.bind(this),
			getOperators: (field) => this.getOperators(field),
		};
	};

	getSelectedSort = (): SelectedSort[] => {
		let result: SelectedSort[] = [];
		if (this.state.currentFilter) {
			this.state.currentFilter.sort.sortFields.forEach(function (item) {
				if (item.selected) {
					result.push({ name: item.name, asc_desc: item.asc_desc });
				}
			});
		}

		return result;
	};

	getSortItem = (field: string): SortField | undefined => {
		let result: SortField | undefined;
		if (this.state.currentFilter) {
			this.state.currentFilter.sort.sortFields.forEach(function (item) {
				if (item.name === field) {
					result = item;
				}
			});
		}

		return result;
	};

	getSortItemByOrder = (order: number): SortField | undefined => {
		let result: SortField | undefined;
		if (this.state.currentFilter) {
			this.state.currentFilter.sort.sortFields.forEach(function (item) {
				if (item.order === order) {
					result = item;
				}
			});
		}

		return result;
	};

	onChangeSortItem = (
		field: string,
		selected: any,
		order: any,
		asc_desc: any,
	) => {
		if (this.state.currentFilter) {
			let item: SortField | undefined = this.getSortItem(field);
			if (item) {
				Object.assign(item, {
					selected: selected,
					order: order,
					asc_desc: asc_desc,
					label: item.label,
				});
				let sortFields = this.state.currentFilter.sort.sortFields;
				sortFields = sortFields.sort(function (a, b) {
					return a.order - b.order;
				});
				let currentFilter = this.state.currentFilter;
				currentFilter.sort.sortFields = sortFields;
				this.setState({
					...this.state,
					currentFilter,
				});

				this.propagateFilterChanged();
			}
		}
	};

	propagateFilterChanged = () => {
		const { onFilterChanged } = this.props;
		if (onFilterChanged) {
			onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex);
		}
	};

	onSortDown = (_event: any) => {
		if (this.state.currentFilter) {
			let activeIndex = this.state.currentFilter.sort.activeIndex;
			if (activeIndex >= 0) {
				let item = this.state.currentFilter.sort.sortFields[activeIndex];
				if (item.order < this.state.currentFilter.sort.sortFields.length - 1) {
					activeIndex = item.order + 1;
					let nextItem: SortField | undefined = this.getSortItemByOrder(
						item.order + 1,
					);
					if (nextItem) {
						Object.assign(item, {
							order: item.order + 1,
						});
						Object.assign(nextItem, {
							order: nextItem.order - 1,
						});
					}
				}
				let sortFields = this.state.currentFilter.sort.sortFields;
				sortFields = sortFields.sort((a, b) => {
					return a.order - b.order;
				});
				let currentFilter = this.state.currentFilter;
				currentFilter.sort.sortFields = sortFields;
				currentFilter.sort.activeIndex = activeIndex;
				this.setState(
					{
						...this.state,
						currentFilter,
					},
					() => {
						this.propagateFilterChanged();
					},
				);
			}
		}
	};

	onSortUp = (_event: any) => {
		if (this.state.currentFilter) {
			const { currentFilter } = this.state;
			let activeIndex = currentFilter.sort.activeIndex;
			if (activeIndex >= 0) {
				const item = currentFilter.sort.sortFields[activeIndex];
				if (item.order > 0) {
					activeIndex = item.order - 1;
					let previousItem: SortField | undefined = this.getSortItemByOrder(
						item.order - 1,
					);
					if (previousItem) {
						Object.assign(item, {
							order: item.order - 1,
						});
						Object.assign(previousItem, {
							order: previousItem.order + 1,
						});
					}
				}
				let sortFields = currentFilter.sort.sortFields;
				sortFields = sortFields.sort(function (a, b) {
					return a.order - b.order;
				});
				currentFilter.sort.sortFields = sortFields;
				currentFilter.sort.activeIndex = activeIndex;
				this.setState(
					{
						...this.state,
						currentFilter,
					},
					() => {
						this.propagateFilterChanged();
					},
				);
			}
		}
	};

	getFields = (
		props: Readonly<ArchbaseAdvancedFilterProps<T, ID>>,
	): Field[] => {
		let result: Field[] = [];
		if (props.children) {
			let arrChildren = React.Children.toArray(props.children);
			arrChildren.forEach((child: any) => {
				if (child.type && child.type.componentName === 'FilterFields') {
					if (child.props.children) {
						let arrChild = React.Children.toArray(child.props.children);
						arrChild.forEach((chd: any) => {
							if (chd.type && chd.type.componentName !== 'FilterField') {
								throw new ArchbaseError(
									'Somente filhos do tipo FilterField podem ser usados com FilterFields.',
								);
							}
							let values: FilterValue[] = [];
							let chld = React.Children.toArray(chd.props.children);
							chld.forEach((val: any) => {
								if (val.type && val.type.componentName !== 'FilterFieldValue') {
									throw new ArchbaseError(
										'Somente filhos do tipo FilterFieldValue podem ser usados com FilterFields',
									);
								}
								values.push({ label: val.props.label, value: val.props.value });
							});
							result.push({
								name: chd.props.name,
								label: chd.props.label,
								dataType: chd.props.dataType,
								quickFilter: chd.props.quickFilter,
								quickFilterSort: chd.props.quickFilterSort,
								sortable: chd.props.sortable,
								listValues: values,
								operator: '',
								searchComponent: undefined,
								searchField: undefined,
							});
						});
					}
				}
			});
		}

		return result;
	};

	isRuleGroup = (rule: { condition: any; rules: any }): boolean => {
		return !!(rule.condition && rule.rules);
	};

	createRule = (): Rule => {
		const { operators } = this.state.schema;
		const fields = this.getFields(this.props);

		return {
			id: `r-${uniqueId()}`,
			field: fields[0].name,
			fieldSql: fields[0].nameSql,
			dataType: fields[0].dataType,
			value: '',
			value2: '',
			disabled: false,
			operator: operators[0].name,
		};
	};

	getField = (name: string) => {
		let result;
		this.getFields(this.props).forEach(function (field) {
			if (field.name === name) {
				result = field;
			}
		}, this);

		return result;
	};

	getOperators = (field: string): Operator[] => {
		let fld = this.getField(field);
		let oprs: Operator[] = [];
		this.props.operators.forEach((op: Operator) => {
			if (op.dataTypes.indexOf(fld.dataType) >= 0) {
				oprs.push(op);
			}
		}, this);

		return oprs;
	};

	onRuleAdd = (rule: Rule, parentId: any) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			const parent = this._findRule(parentId, currentFilter.filter);
			parent && parent.rules!.push(rule);
			this.setState({ ...this.state, currentFilter });
		}
	};

	onGroupAdd = (group: Rule, parentId: any) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			const parent = this._findRule(parentId, currentFilter.filter);
			parent && parent.rules!.push(group);
			this.setState({ ...this.state, currentFilter });
		}
	};

	onPropChange = (prop: string, value: string, ruleId: any) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			const rule = this._findRule(ruleId, currentFilter.filter);
			if (rule) {
				if (prop === 'not') {
					prop = 'condition';
					if (rule.condition!.indexOf('and') >= 0) {
						value = ltrim(value + ' and');
					} else {
						value = ltrim(value + ' or');
					}
				} else if (prop === 'condition') {
					if (rule.condition!.indexOf('not') >= 0) {
						value = 'not ' + value;
					}
				}
				Object.assign(rule, { [prop]: value });
				this.setState({ ...this.state, currentFilter });
			}
		}
	};

	onRuleRemove = (ruleId: string, parentId: any) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			const parent = this._findRule(parentId, currentFilter.filter);
			if (parent) {
				const index = parent.rules!.findIndex((x) => x.id === ruleId);
				parent.rules!.splice(index, 1);
				this.setState({ ...this.state, currentFilter });
			}
		}
	};

	onGroupRemove = (groupId, parentId) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			const parent = this._findRule(parentId, currentFilter.filter);
			if (parent) {
				const index = parent.rules!.findIndex((x) => x.id === groupId);
				parent.rules!.splice(index, 1);
			}
			this.setState({ ...this.state, currentFilter });
		}
	};

	getLevel = (id) => {
		return this._getLevel(id, 0, this.state.currentFilter!.filter);
	};

	_getLevel = (id, index, root) => {
		const { isRuleGroup } = this.state.schema;

		var foundAtIndex = -1;
		if (root.id === id) {
			foundAtIndex = index;
		} else if (isRuleGroup(root)) {
			root.rules.forEach((rule) => {
				if (foundAtIndex === -1) {
					var indexForRule = index;
					if (isRuleGroup(rule)) indexForRule++;
					foundAtIndex = this._getLevel(id, indexForRule, rule);
				}
			});
		}

		return foundAtIndex;
	};

	_findRule = (id: string, parent: Rule): Rule | undefined => {
		const { isRuleGroup } = this.state.schema;

		if (parent.id === id) {
			return parent;
		}

		for (const rule of parent.rules!) {
			if (rule.id === id) {
				return rule;
			} else if (isRuleGroup(rule)) {
				const subRule = this._findRule(id, rule);
				if (subRule) {
					return subRule;
				}
			}
		}

		return undefined;
	};

	_notifyQueryChange = (fn, ...args: any[]) => {
		if (fn) {
			fn.call(this, ...args);
		}
		const { onFilterChanged } = this.props;
		if (onFilterChanged) {
			onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex);
		}
	};

	onSelectListItem = (index: number, _item: any) => {
		let currentFilter: ArchbaseQueryFilter | undefined =
			this.state.currentFilter;
		if (currentFilter) {
			currentFilter.sort.activeIndex = index;
			this.setState({ ...this.state, currentFilter });
			if (this.props.onFilterChanged) {
				this.props.onFilterChanged(currentFilter, this.state.activeFilterIndex);
			}
		}
	};

	render() {
		return (
			<div
				style={{
					height: this.props.height,
					overflowY: 'hidden',
					overflowX: 'hidden',
				}}
			>
				<div style={{ width: this.props.width, overflow: 'hidden' }}>
					<Grid>
						<Grid.Col span={12}>
							<RuleGroupItem
								rules={this.state.currentFilter.filter.rules}
								condition={this.state.currentFilter.filter.condition}
								schema={this.state.schema}
								id={this.state.currentFilter.filter.id}
								onSearchButtonClick={this.props.onSearchButtonClick}
								parentId={null}
								variant={this.props.variant}
							/>
						</Grid.Col>
					</Grid>
				</div>

				{this.props.allowSort === true ? (
					<Grid>
						<Grid.Col span={12} style={{ padding: 13 }}>
							<div
								style={{
									height: 'auto',
								}}
							>
								<Card withBorder shadow="sm" radius="md">
									<Card.Section withBorder inheritPadding py="xs">
										<Group>
											<Tooltip withinPortal withArrow label="Para baixo">
												<ActionIcon
													id="btnFilterSortDown"
													onClick={this.onSortDown}
												>
													<IconArrowDown />
												</ActionIcon>
											</Tooltip>
											<Tooltip withinPortal withArrow label="Para cima">
												<ActionIcon
													id="btnFilterSortUp"
													onClick={this.onSortUp}
												>
													<IconArrowUp />
												</ActionIcon>
											</Tooltip>
											<Text>{'Ordenação'}</Text>
											<Space w="md" />
											<Text
												key={'txto_' + 9899}
												truncate
												color="blue"
												style={{
													wordBreak: 'break-word',
													display: 'block',
													wordWrap: 'break-word',
													whiteSpace: 'normal',
													fontSize: '12px',
												}}
											>
												{getSortString(this.state.currentFilter)}
											</Text>
										</Group>
									</Card.Section>
									<ArchbaseList<any, any>
										height="100%"
										width="100%"
										dataSource={
											new ArchbaseDataSource('dsSortFields', {
												records: this.state.currentFilter.sort.sortFields,
												grandTotalRecords:
													this.state.currentFilter.sort.sortFields.length,
												currentPage: 0,
												totalPages: 0,
												pageSize: 999999,
											})
										}
										dataFieldId="name"
										dataFieldText="name"
										activeIndex={this.state.currentFilter.sort.activeIndex}
										component={{
											type: CustomSortItem,
											props: {
												sortFocused: this.state.sortFocused,
												onChangeSortItem: this.onChangeSortItem,
												onSelectListItem: this.onSelectListItem,
											},
										}}
									/>
								</Card>
							</div>
						</Grid.Col>
					</Grid>
				) : null}
			</div>
		);
	}
}

interface CustomSortItemProps<T, ID> {
	id: string;
	disabled?: boolean;
	active: boolean;
	index: number;
	recordData: any;
	dataFieldId: string;
	dataSource: ArchbaseDataSource<T, ID>;
	onSelectListItem?: (index: number, self: CustomSortItem<T, ID>) => void;
	onChangeSortItem: (
		field: string,
		checked: boolean,
		order: any,
		ascDesc: 'asc' | 'desc',
	) => void;
}

interface CustomSortItemState {
	update: number;
	selected: boolean;
}

export class CustomSortItem<T, ID> extends Component<
	CustomSortItemProps<T, ID>,
	CustomSortItemState
> {
	static defaultProps = {
		disabled: false,
		active: true,
		selected: false,
	};
	declare context: React.ContextType<typeof ArchbaseListContext>;
	constructor(props: CustomSortItemProps<T, ID>) {
		super(props);
		this.state = { update: Math.random(), selected: props.recordData.selected };
	}

	static get componentName() {
		return 'CustomSortItem';
	}

	UNSAFE_componentWillReceiveProps = (
		nextProps: CustomSortItemProps<T, ID>,
	) => {
		this.setState({
			update: Math.random(),
			selected: nextProps.recordData.selected,
		});
	};

	onClick = (event) => {
		event.preventDefault();
		if (!this.props.disabled) {
			if (this.context.handleSelectItem) {
				this.context.handleSelectItem(this.props.index, this.props.recordData!);
			}
			if (this.props.onSelectListItem) {
				this.props.onSelectListItem(this.props.index, this);
			}
		}
	};

	onCheckboxChange = (event) => {
		let field = this.props.recordData[this.props.dataFieldId];
		const checked = event.currentTarget.checked;
		this.setState({ ...this.state, selected: checked }, () => {
			this.props.onChangeSortItem(
				field,
				checked,
				this.props.recordData.order,
				this.isAsc() ? 'asc' : 'desc',
			);
		});
	};

	onDoubleClick = (_event) => {
		let field = this.props.recordData[this.props.dataFieldId];
		this.props.onChangeSortItem(
			field,
			this.state.selected,
			this.props.recordData.order,
			this.isAsc() ? 'desc' : 'asc',
		);
	};

	isAsc = () => {
		let field = this.props.recordData[this.props.dataFieldId];
		let asc = true;
		this.props.dataSource.browseRecords().forEach((item: any) => {
			if (item.name === field) {
				asc = !item.asc_desc || item.asc_desc === 'asc';
			}
		});

		return asc;
	};

	render = () => {
		let key = this.props.id;
		const backgroundColor = this.props.active
			? this.context.activeBackgroundColor
			: '';
		const color = this.props.active ? this.context.activeColor : '';
		return (
			<li
				style={{
					height: '30px',
					padding: '0px 15px',
					display: 'flex',
					color,
					backgroundColor,
					alignItems: 'center',
				}}
				onClick={this.onClick}
				key={key}
			>
				<Checkbox
					label={<Text color={color}>{this.props.recordData.label}</Text>}
					checked={this.state.selected}
					onChange={this.onCheckboxChange}
				/>
				<div>
					<i
						className={
							this.isAsc() ? 'fa fa-sort-alpha-down' : 'fa fa-arrow-right'
						}
						style={{ cursor: 'pointer' }}
						onDoubleClick={this.onDoubleClick}
					>
						{' '}
					</i>
					<i
						className={
							this.isAsc() ? 'fa fa-arrow-left' : 'fa fa-sort-alpha-up'
						}
						style={{ cursor: 'pointer' }}
						onDoubleClick={this.onDoubleClick}
					/>
				</div>
			</li>
		);
	};
}

CustomSortItem.contextType = ArchbaseListContext;

interface RuleGroupItemProps {
	id: string;
	parentId?: string | null;
	rules?: Rule[];
	condition: string;
	schema: Schema;
	height?: string;
	onSearchButtonClick?: () => void;
	variant?: ButtonVariant
}

class RuleGroupItem extends Component<RuleGroupItemProps> {
	static defaultProps = {
		id: null,
		parentId: null,
		rules: [],
		condition: 'and',
		schema: {},
	};
	static contextType = ArchbaseAppContext;
	declare context: React.ContextType<typeof ArchbaseAppContext>;

	constructor(props) {
		super(props);
		this.hasParentGroup = this.hasParentGroup.bind(this);
		this.onConditionChange = this.onConditionChange.bind(this);
		this.onNotConditionChange = this.onNotConditionChange.bind(this);
		this.addRule = this.addRule.bind(this);
		this.addGroup = this.addGroup.bind(this);
		this.removeGroup = this.removeGroup.bind(this);
	}

	static get componentName() {
		return 'RuleGroupItem';
	}

	getColor = (color: string) => {
		return this.context.theme!.colors[color][
			this.context.theme!.colorScheme === 'dark' ? 5 : 7
		];
	};

	render = () => {
		const {
			height,
			condition,
			rules,
			onSearchButtonClick,
			schema: { isRuleGroup, getLevel },
		} = this.props;
		const level = getLevel(this.props.id);

		return (
			<dl
				className={'rules-group-container'}
				style={{
					height: height,
					overflowX: height !== undefined ? 'auto' : 'hidden',
				}}
			>
				<dt className="rules-group-header">
					<div
						style={{
							display: 'flex',
						}}
					>
						<ArchbaseCheckbox
							label="Não"
							isChecked={condition!.indexOf('not') >= 0}
							onChangeValue={this.onNotConditionChange}
							trueValue={true}
							falseValue={false}
						/>
						<Space w="md" />
						<Switch
							size="md"
							color={'teal'}
							onLabel={<Text fz="sm">E</Text>}
							offLabel={<Text fz="sm">OU</Text>}
							onChange={(event) =>
								this.onConditionChange(event.currentTarget.checked ? 0 : 1)
							}
							checked={condition === 'and'}
						/>
						<Space w="md" />
						<Button.Group>
							<ActionElement
								label="Condição"
								style={{}}
								handleOnClick={this.addRule}
								rules={rules}
								level={level}
								variant={this.props.variant}
							/>
							<ActionElement
								label="Grupo"
								handleOnClick={this.addGroup}
								rules={rules}
								level={level}
								variant={this.props.variant}
							/>{' '}
							{this.hasParentGroup() ? (
								<ActionElement
									label="Remover"
									color="red"
									handleOnClick={this.removeGroup}
									rules={rules}
									level={level}
									variant={this.props.variant}
								/>
							) : null}
						</Button.Group>
					</div>
				</dt>
				<dd className="rules-group-body">
					<ul className="rules-list">
						{rules &&
							rules.map((r: Rule) => {
								return isRuleGroup(r) ? (
									<RuleGroupItem
										key={r.id}
										id={r.id}
										schema={this.props.schema}
										parentId={this.props.id}
										condition={r.condition}
										onSearchButtonClick={onSearchButtonClick}
										rules={r.rules}
									/>
								) : (
									<RuleItem
										key={r.id}
										id={r.id}
										field={r.field}
										value={r.value}
										value2={r.value2}
										operator={r.operator}
										disabled={r.disabled}
										schema={this.props.schema}
										onSearchButtonClick={onSearchButtonClick}
										parentId={this.props.id}
									/>
								);
							})}
					</ul>
				</dd>
			</dl>
		);
	};

	hasParentGroup() {
		return this.props.parentId;
	}

	onConditionChange(index) {
		const { onPropChange } = this.props.schema;
		onPropChange('condition', index === 0 ? 'and' : 'or', this.props.id);
	}

	onNotConditionChange(_value, checked) {
		const { onPropChange } = this.props.schema;
		onPropChange('not', checked === true ? 'not' : '', this.props.id);
	}

	addRule(event) {
		event.preventDefault();
		event.stopPropagation();
		const { createRule, onRuleAdd } = this.props.schema;
		const newRule = createRule();
		onRuleAdd(newRule, this.props.id);
	}

	addGroup(event) {
		event.preventDefault();
		event.stopPropagation();
		const { createRuleGroup, onGroupAdd } = this.props.schema;
		const newGroup = createRuleGroup();
		onGroupAdd(newGroup, this.props.id);
	}

	removeGroup(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
	}
}

interface RuleItemProps {
	id: string;
	parentId?: string | null;
	field?: string | null;
	operator?: string | null;
	value?: string | null;
	value2?: string | null;
	disabled?: boolean;
	schema: Schema;
	onSearchButtonClick?: () => void;
}

class RuleItem extends Component<RuleItemProps> {
	static defaultProps = {
		id: null,
		parentId: null,
		field: null,
		operator: null,
		value: null,
		value2: null,
		disabled: false,
	};
	static contextType = ArchbaseAppContext;
	declare context: React.ContextType<typeof ArchbaseAppContext>;
	constructor(props: RuleItemProps) {
		super(props);
	}

	static get componentName() {
		return 'Rule';
	}

	getDataType = (field: string | null | undefined, fields: string | any[]) => {
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].name === field) {
				return fields[i].dataType;
			}
		}
	};

	getSearchField = (
		field: string | null | undefined,
		fields: string | any[],
	) => {
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].name === field) {
				return fields[i].dataType;
			}
		}
	};

	getFieldSql = (field: any, fields: string | any[]) => {
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].name === field) {
				return fields[i].nameSql;
			}
		}
	};

	getFieldValues = (
		field: string | null | undefined,
		fields: string | any[],
	) => {
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].name === field) {
				return fields[i].listValues;
			}
		}
	};

	render = () => {
		const {
			field,
			disabled,
			operator,
			value,
			value2,
			onSearchButtonClick,
			schema: { fields, getOperators, getLevel },
		} = this.props;
		let dt = this.getDataType(field, fields);
		let searchField = this.getSearchField(field, fields);
		let twoFields =
			operator === 'between' &&
			dt !== 'date' &&
			dt !== 'date_time' &&
			dt !== 'time';
		var level = getLevel(this.props.id);
		let listValues = this.getFieldValues(field, fields);
		const { colorScheme } = useMantineColorScheme();;
		return (
			<li className={'rule-container'}>
				<ArchbaseCheckbox
					label=""
					isChecked={!disabled}
					onChangeValue={this.onDisabledChanged}
					trueValue={true}
					falseValue={false}
				/>
				<ValueSelector
					options={fields}
					value={field!}
					className="custom-select-field"
					style={{
						color: colorScheme === 'dark' ? 'white' : 'black',
					}}
					disabled={disabled}
					handleOnChange={this.onFieldChanged}
					level={level}
					field={''}
				/>
				<ValueSelector
					field={field!}
					options={getOperators(field)}
					value={operator!}
					style={{
						color: colorScheme === 'dark' ? 'white' : 'black',
					}}
					className="custom-select-operator"
					disabled={disabled}
					handleOnChange={this.onOperatorChanged}
					level={level}
				/>
				<ValueEditor
					field={field!}
					dataType={dt}
					operator={operator!}
					value={value!}
					value2={value2!}
					listValues={listValues}
					disabled={disabled!}
					searchField={searchField}
					className="rule-value"
					handleOnChange={this.onValueChanged}
					onSearchButtonClick={onSearchButtonClick!}
					level={level}
					twoFields={twoFields}
				/>{' '}
				{operator === 'between' &&
				dt !== 'date' &&
				dt !== 'date_time' &&
				dt !== 'time' ? (
					<ValueEditor
						field={field!}
						dataType={dt}
						operator={operator}
						value={value2!}
						listValues={listValues}
						disabled={disabled!}
						searchField={searchField}
						className="rule-value"
						handleOnChange={this.onValue2Changed}
						onSearchButtonClick={onSearchButtonClick!}
						level={level}
						twoFields={twoFields}
					/>
				) : (
					''
				)}
				<ActionIcon id={`btnRemoveRule_${field}`} onClick={this.removeRule}>
					<IconTrash color={this.context.theme!.colors.red[3]} />
				</ActionIcon>
			</li>
		);
	};

	onDisabledChanged = (_value, checked) => {
		this.onElementChanged('disabled', !checked);
	};

	onFieldChanged = (value) => {
		this.onElementChanged('field', value);
		this.onElementChanged(
			'fieldSql',
			this.getFieldSql(value, this.props.schema.fields),
		);
		this.onElementChanged(
			'dataType',
			this.getDataType(value, this.props.schema.fields),
		);
		this.onElementChanged('value', '');
		this.onElementChanged('value2', '');
	};

	onOperatorChanged = (value) => {
		this.onElementChanged('operator', value);
		this.onElementChanged('value', '');
		this.onElementChanged('value2', '');
	};

	onValueChanged = (value) => {
		const {
			field,
			operator,
			schema: { fields },
		} = this.props;
		let dt = this.getDataType(field, fields);
		if (
			operator === 'between' &&
			(dt === 'date' || dt === 'date_time' || dt === 'time')
		) {
			if (value && value.length > 1) {
				this.onElementChanged('value', value[0].toString());
				this.onElementChanged('value2', value[1].toString());
			} else {
				this.onElementChanged('value', '');
				this.onElementChanged('value2', '');
			}
		} else if (
			(operator === 'inList' || operator === 'notInList') &&
			(dt === 'date' || dt === 'date_time' || dt === 'time')
		) {
			if (!value) {
				value = '';
			}
			this.onElementChanged('value', value);
		} else if (operator === 'inList' || operator === 'notInList') {
			if (!value) {
				value = '';
			}
			let values = value.split(',');
			if (values.length > 0) {
				let appendDelimiter = false;
				let result = '';
				values.forEach(function (v) {
					if (appendDelimiter) {
						result += ',';
					}
					if (dt === 'number' || dt === 'integer') {
						result += v;
					} else {
						result += "'" + v + "'";
					}
					appendDelimiter = true;
				});
				this.onElementChanged('value', result);
			}
		} else {
			this.onElementChanged('value', value);
		}
	};

	onValue2Changed = (value) => {
		this.onElementChanged('value2', value);
	};

	onElementChanged = (property, value) => {
		const { id, schema } = this.props;
		if (schema && schema.onPropChange) {
			schema.onPropChange(property, value, id);
		}
	};

	removeRule = (event) => {
		event.preventDefault();
		event.stopPropagation();

		this.props.schema &&
			this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
	};
}

interface ActionElementProps {
	label: string;
	style?: CSSProperties;
	level: number;
	handleOnClick: (event: React.MouseEvent) => void;
	rules?: Rule[];
	color?: string;
	variant?: ButtonVariant;
}

class ActionElement extends Component<ActionElementProps> {
	static get componentName() {
		return 'ActionElement';
	}

	render = () => {
		const { label, handleOnClick, style, color } = this.props;

		return (
			<Button
				variant={this.props.variant}
				style={style}
				size="xs"
				color={color}
				onClick={(e: React.MouseEvent) => handleOnClick(e)}
			>
				{label}
			</Button>
		);
	};
}

interface ValueEditorProps {
	field: string;
	operator: string;
	value: string;
	value2?: string;
	level?: number;
	listValues?: string[];
	searchField: string;
	disabled: boolean;
	dataType: DataType;
	twoFields?: boolean;
	className?: string;
	handleOnChange: (value: any) => void;
	onSearchButtonClick: (
		field: string,
		event: any,
		handleOnChange: (value: string) => void,
		operator: string,
		searchField: string,
	) => void;
}

export class ValueEditor extends Component<ValueEditorProps> {
	private onInput: (value: any) => void;
	constructor(props: ValueEditorProps) {
		super(props);
		this.onInput = debounce(props.handleOnChange, 300);
	}

	static get componentName() {
		return 'ValueEditor';
	}

	onActionSearchExecute = () => {
		if (this.props.onSearchButtonClick) {
			this.props.onSearchButtonClick(
				this.props.field,
				event,
				this.props.handleOnChange,
				this.props.operator,
				this.props.searchField,
			);
		}
	};

	convertValueCombobox = (value: string, dataType: string) => {
		if (!value || value.length === 0) {
			return value;
		}
		if (dataType === 'string') {
			let result = value.split(',');
			let _value: string[] = [];
			if (result.length > 0) {
				result.forEach((item) => {
					_value.push(item.replaceAll("'", ''));
				});

				return _value;
			}
		} else {
			return value.split(',');
		}

		return value;
	};

	render = () => {
		const {
			disabled,
			dataType,
			operator,
			value,
			value2,
			listValues,
			handleOnChange,
		} = this.props;
		let newValue: any = value === null || value === undefined ? '' : value;
		let newValue2: any = value2 === null || value === undefined ? '' : value2;

		if (operator === 'null' || operator === 'notNull') {
			return null;
		}

		if (dataType) {
			if (dataType === 'date') {
				if (operator === 'between') {
					if (newValue === '' && newValue2 === '') newValue = '';
					else newValue = [newValue, newValue2];

					return (
						<DatePickerInput
							type="range"
							disabled={disabled}
							value={newValue}
							style={{ width: this.props.twoFields ? '128px' : '260px' }}
							onChange={(value: DatesRangeValue) => this.onInput(value)}
						/>
					);
				} else if (operator === 'notInList' || operator === 'inList') {
					return (
						<DatePickerInput
							type="multiple"
							disabled={disabled}
							value={newValue}
							style={{ width: this.props.twoFields ? '128px' : '260px' }}
							onChange={(value: DateValue[]) => this.onInput(value)}
						/>
					);
				} else {
					return (
						<DatePickerInput
							disabled={disabled}
							value={newValue}
							style={{ width: this.props.twoFields ? '128px' : '260px' }}
							onChange={(value: DateValue) => this.onInput(value)}
						/>
					);
				}
			} else if (dataType === 'date_time') {
				if (operator === 'between') {
					if (newValue === '' && newValue2 === '') newValue = '';
					else newValue = [newValue, newValue2];

					return (
						<ArchbaseDateTimePickerRange
							disabled={disabled}
							value={newValue}
							width={this.props.twoFields ? '128px' : '260px'}
							onSelectDateRange={(value: DateValue[]) => this.onInput(value)}
						/>
					);
				} else {
					return (
						<ArchbaseDateTimePickerEdit
							disabled={disabled}
							value={newValue}
							width={this.props.twoFields ? '128px' : '260px'}
							onChange={(value) => this.onInput(value)}
						/>
					);
				}
			} else if (dataType === 'time') {
				if (newValue === '' && newValue2 === '') newValue = '';
				else newValue = newValue + ' - ' + newValue2;

				return (
					<TimeInput
						disabled={disabled}
						width={this.props.twoFields ? '128px' : '260px'}
						value={newValue}
						onChange={(value) => this.onInput(value)}
					/>
				);
			} else if (dataType === 'boolean') {
				return (
					<ArchbaseSwitch
						isChecked={newValue}
						onChangeValue={(value, _event) => this.onInput(value === true)}
					/>
				);
			} else {
				if (
					listValues &&
					listValues.length > 0 &&
					(operator === 'notInList' || operator === 'inList')
				) {
					let _value = this.convertValueCombobox(newValue, dataType);

					return (
						<ArchbaseSelect<any, any, any>
							disabled={disabled}
							width={this.props.twoFields ? '128px' : '260px'}
							onSelectValue={(value) => this.onInput(value)}
							//VER AQUI DEPOIS multi={true}
							value={_value}
							getOptionLabel={(option: any) => option.label}
							getOptionValue={(option: any) => option.value}
						>
							{listValues.map((v: any) => {
								return (
									<ArchbaseSelectItem
										label={v.label}
										value={v.value}
										key={v.value}
										disabled={false}
									/>
								);
							})}
						</ArchbaseSelect>
					);
				} else if (listValues && listValues.length > 0) {
					return (
						<ArchbaseSelect
							disabled={disabled}
							value={newValue}
							width={this.props.twoFields ? '128px' : '260px'}
							getOptionLabel={(option: any) => option.label}
							getOptionValue={(option: any) => option.value}
							onSelectValue={(value) => this.onInput(value)}
						>
							{listValues.map((v: any) => {
								return (
									<ArchbaseSelectItem
										label={v.label}
										value={v.value}
										key={v.value}
										disabled={false}
									/>
								);
							})}
						</ArchbaseSelect>
					);
				} else {
					return (
						<ArchbaseEdit
							disabled={disabled}
							width={this.props.twoFields ? '128px' : '260px'}
							icon={<IconSearch size="1rem" />}
							onActionSearchExecute={this.onActionSearchExecute}
							value={newValue}
							onChangeValue={(value: any, _event: any) => this.onInput(value)}
						/>
					);
				}
			}
		} else {
			return (
				<input
					type="text"
					width={this.props.twoFields ? '128px' : '260px'}
					value={newValue}
					onChange={(e) => this.onInput(e.target.value)}
				/>
			);
		}
	};
}

interface OptionItem {
	name: string;
	label: string;
}

interface ValueSelectorProps {
	value: string;
	field: string;
	level: number;
	options: OptionItem[];
	className?: string;
	handleOnChange: (value: string) => void;
	width?: string;
	disabled: boolean;
	style?: CSSProperties;
}

class ValueSelector extends Component<ValueSelectorProps> {
	static get componentName() {
		return 'ValueSelector';
	}
	static defaultProps = {
		disabled: false,
	};

	constructor(props: ValueSelectorProps) {
		super(props);
		let wdt = this.getTextWidth(props.options[0].name);
		this.state = { width: wdt, value: undefined };
	}

	getLabelByName = (name: string): string | undefined => {
		let result: string | undefined;
		this.props.options.map((opt) => {
			if (opt.name === name) {
				result = opt.label;
			}
		});

		return result;
	};

	getTextWidth = (txt: string) => {
		let text: HTMLSpanElement = document.createElement('span');
		document.body.appendChild(text);

		const label = this.getLabelByName(txt);
		text.className = this.props.className!;
		text.innerHTML = label!;

		let width = Math.ceil(text.offsetWidth) + 4;
		let formattedWidth = width + 'px';

		document.body.removeChild(text);

		return formattedWidth;
	};

	handleOnChange = (event) => {
		if (this.props.handleOnChange) {
			this.props.handleOnChange(event.target.value);
		}
		let width = this.getTextWidth(event.target.value);
		this.setState({ ...this.state, value: event.target.value, width });
	};

	render = () => {
		const { value, options, className, disabled, style } = this.props;

		return (
			<select
				className={className}
				style={style}
				disabled={disabled}
				value={value}
				tabIndex={-1}
				onChange={this.handleOnChange}
			>
				{options.map((option) => {
					return (
						<option key={option.name} value={option.name}>
							{option.label}
						</option>
					);
				})}
			</select>
		);
	};
}

export { ArchbaseAdvancedFilter };
