import { rem, useMantineColorScheme } from '@mantine/core';
import { useColorScheme, useForceUpdate } from '@mantine/hooks';
import lodash from 'lodash';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useArchbaseTheme } from '@archbase/core';
import { ArchbaseTreeNode } from './ArchbaseTreeView.types';
import { ArchbaseTreeViewItem } from './ArchbaseTreeViewItem';

export interface ArchbaseTreeViewProps {
	id: string;
	selectable?: boolean;
	color?: string;
	backgroundColor?: string;
	borderColor?: string;
	hoverColor?: string;
	hoverBackgroundColor?: string;
	focusedColor?: string;
	focusedBackgroundColor?: string;
	selectedColor?: string;
	selectedBackgroundColor?: string | 'auto';
	iconColor?: string;
	iconBackgroundColor?: string;
	enableLinks?: boolean;
	highlightSelected?: boolean;
	withBorder?: boolean;
	showTags?: boolean;
	nodes?: ArchbaseTreeNode[];
	onDoubleClick?: (dataSource: ArchbaseTreeNode[], node: ArchbaseTreeNode) => void;
	onClick?: () => void;
	onFocusedNode?: (node: ArchbaseTreeNode) => void;
	onLoosedFocusNode?: (focused: ArchbaseTreeNode) => void;
	onSelectedNode?: (dataSource: ArchbaseTreeNode[], node: ArchbaseTreeNode, selectedNodes: ArchbaseTreeNode[]) => void;
	onUnSelectedNode?: (
		dataSource: ArchbaseTreeNode[],
		node: ArchbaseTreeNode,
		selectedNodes: ArchbaseTreeNode[],
	) => void;
	onRemovedNode?: (dataSource: ArchbaseTreeNode[]) => void;
	onLoadDataSource?: (node: ArchbaseTreeNode) => Promise<ArchbaseTreeNode[]>;
	onAddedNode?: (node: ArchbaseTreeNode, dataSource: ArchbaseTreeNode[]) => void;
	onExpandedNode?: (dataSource: ArchbaseTreeNode[], expandedNodes: ArchbaseTreeNode[]) => void;
	onCollapsedNode?: (dataSource: ArchbaseTreeNode[], expandedNodes: ArchbaseTreeNode[]) => void;
	onChangedDataSource?: (dataSource: ArchbaseTreeNode[]) => void;
	dataSource: ArchbaseTreeNode[];
	focusedNode?: ArchbaseTreeNode;
	style?: React.CSSProperties;
	height?: string;
	width?: string;
	customRenderText?: (node: ArchbaseTreeNode) => ReactNode;
	update?: number;
}

export const ArchbaseTreeView: React.FC<ArchbaseTreeViewProps> = ({
	id,
	selectable = true,
	color = '#428bca',
	backgroundColor,
	borderColor,
	hoverColor,
	hoverBackgroundColor = '#e7f4f9',
	focusedColor,
	focusedBackgroundColor,
	selectedColor,
	selectedBackgroundColor = 'auto',
	iconColor = 'black',
	iconBackgroundColor,
	enableLinks = false,
	highlightSelected = true,
	withBorder = true,
	showTags = false,
	onDoubleClick,
	onFocusedNode,
	onLoosedFocusNode,
	onSelectedNode,
	onUnSelectedNode,
	onRemovedNode,
	onLoadDataSource,
	onAddedNode,
	onExpandedNode,
	onCollapsedNode,
	onChangedDataSource,
	dataSource,
	style,
	height,
	width,
	focusedNode,
	customRenderText,
	update = Math.random(),
}) => {
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();
	const [internalDataSource, setDataSource] = useState<ArchbaseTreeNode[]>([]);
	const [focused, setFocused] = useState<ArchbaseTreeNode | undefined>(focusedNode);
	const nodeList = useRef<string[]>([]);
	const nodesQuantity = useRef(0);
	const [updateCounter, setUpdateCounter] = useState(0);
	const forceUpdate = useForceUpdate();

	const setNodeDetails = useCallback((node: any): ArchbaseTreeNode[] => {
		if (!node.nodes) return [];
		return node.nodes.map((childNode) => {
			nodeList.current.push(childNode.id);
			const newNode: ArchbaseTreeNode = {
				id: childNode.id,
				nodes: setNodeDetails(childNode),
				parentNode: node,
				isleaf: childNode.isleaf ? childNode.isleaf : false,
				state: {
					selected: childNode.state ? !!childNode.state.selected : false,
					expanded: childNode.state ? !!childNode.state.expanded : false,
					loading: childNode.state ? !!childNode.state.loading : false,
				},
				text: childNode.text,
				icon: childNode.icon,
				color: childNode.color,
				image: childNode.image,
				data: childNode.data,
				type: childNode.type,
			};
			return newNode;
		});
	}, []);

	const findNodeById = useCallback((nodes: ArchbaseTreeNode[], id: string): ArchbaseTreeNode | undefined => {
		let result;
		if (nodes)
			nodes.forEach(function (node) {
				if (node.id === id) result = node;
				else {
					if (node.nodes) {
						result = findNodeById(node.nodes, id) || result;
					}
				}
			});
		return result;
	}, []);

	const findPreviousNodeById = useCallback(
		(id: string, visible: boolean): ArchbaseTreeNode | undefined => {
			let foundId = false;
			for (let i = nodeList.current.length - 1; i >= 0; i--) {
				if (foundId) {
					const node = findNodeById(internalDataSource, nodeList.current[i]);
					if (
						(visible && node && node.parentNode && node.parentNode.state && node.parentNode.state.expanded) ||
						(visible && node && node.state && node.state.expanded)
					)
						return node;
				}
				if (nodeList.current[i] === id) {
					foundId = true;
				}
			}
		},
		[internalDataSource],
	);

	const findNextNodeById = useCallback(
		(id: string, visible: boolean): ArchbaseTreeNode | undefined => {
			let foundId = false;
			for (let i = 0; i < nodeList.current.length; i++) {
				if (foundId) {
					const node = findNodeById(internalDataSource, nodeList.current[i]);
					if (
						(visible && node && node.parentNode && node.parentNode.state.expanded) ||
						(visible && node && node.state && node.state.expanded)
					)
						return node;
				}
				if (nodeList.current[i] === id) {
					foundId = true;
				}
			}
		},
		[internalDataSource],
	);

	const deleteById = useCallback((obj: ArchbaseTreeNode[], id: string): ArchbaseTreeNode[] => {
		if (!obj || obj.length <= 0) return [];
		const arr: ArchbaseTreeNode[] = [];
		lodash.each(obj, (val) => {
			if (val.nodes && val.nodes.length > 0) val.nodes = deleteById(val.nodes, id);

			if (val.id !== id) {
				arr.push(val);
			}
		});
		return arr;
	}, []);

	const setChildrenState = useCallback((nodes: ArchbaseTreeNode[], state: boolean): ArchbaseTreeNode[] => {
		const selectedNodes: ArchbaseTreeNode[] = [];
		if (nodes)
			nodes.forEach(function (node) {
				if (node && node.state) {
					node.state.selected = state;
				}
				selectedNodes.push(node);
				selectedNodes.push(...setChildrenState(node.nodes || [], state));
			});
		return selectedNodes;
	}, []);

	const getSelectedNodesInternal = useCallback((nodes: ArchbaseTreeNode[]): ArchbaseTreeNode[] => {
		const selectedNodes: ArchbaseTreeNode[] = [];
		nodes.forEach((node) => {
			if (node && node.state && node.state.selected) {
				selectedNodes.push(node);
			}
			selectedNodes.push(...getSelectedNodesInternal(node.nodes || []));
		});
		return selectedNodes;
	}, []);

	const setParentSelectable = useCallback((node: ArchbaseTreeNode) => {
		if (!node.parentNode || !node.parentNode.state) return;
		node.parentNode.state.selected = true;
		setParentSelectable(node.parentNode);
	}, []);

	const filterSelecteds = (list: ArchbaseTreeNode[]): ArchbaseTreeNode[] => {
		const selectedItems: ArchbaseTreeNode[] = [];
		for (const item of list) {
			if (item.state.selected) {
				selectedItems.push(item);
			}
			if (item.nodes && item.nodes.length > 0) {
				const selectedChildren = filterSelecteds(item.nodes);
				selectedItems.push(...selectedChildren);
			}
		}
		return selectedItems;
	};

	const nodeSelected = useCallback(
		(id: string, selected: boolean) => {
			const selectedNodes: ArchbaseTreeNode[] = [];
			const newDataSource = [...internalDataSource];
			const node = findNodeById(newDataSource, id);
			if (node && node.state) {
				node.state.selected = selected;
				selectedNodes.push(node);
				selectedNodes.push(...setChildrenState(node.nodes || [], selected));
				setDataSource(newDataSource);
				if (onChangedDataSource) {
					onChangedDataSource(newDataSource);
				}

				if (selected === true) {
					if (onSelectedNode) {
						onSelectedNode(newDataSource, node, filterSelecteds(newDataSource));
					}
				} else {
					if (onUnSelectedNode) {
						onUnSelectedNode(newDataSource, node, filterSelecteds(newDataSource));
					}
				}
			}
		},
		[internalDataSource, onChangedDataSource, onSelectedNode, onUnSelectedNode, setChildrenState],
	);

	useEffect(() => {
		setUpdateCounter((prev) => prev + 1);
		forceUpdate();
	}, [internalDataSource]);

	const loadDataSource = useCallback(
		(id: string) => {
			if (onLoadDataSource) {
				const newDataSource = [...internalDataSource];
				const node = findNodeById(newDataSource, id);
				if (node) {
					const callbackPromise = onLoadDataSource(node);
					if (callbackPromise) {
						callbackPromise.then(
							(nodes) => {
								if (node) {
									node.nodes = nodes;
									node.state.loading = false;
								}
								setDataSource(newDataSource);
								if (onChangedDataSource) {
									onChangedDataSource(newDataSource);
								}
							},
							() => {
								console.log('erro loaded');
							},
						);
					}
				}
			}
		},
		[internalDataSource, onChangedDataSource, onLoadDataSource],
	);

	const nodeExpandedCollapsed = useCallback(
		(id: string, expanded: boolean) => {
			const newDataSource = [...internalDataSource];
			const expandedNodes: ArchbaseTreeNode[] = [];
			const node = findNodeById(newDataSource, id);
			if (node && node.state) {
				let loading = !node.nodes && !node.isleaf;
				if (!onLoadDataSource && loading) {
					loading = false;
				}
				node.state.expanded = expanded;
				node.state.loading = loading;
				expandedNodes.push(node);
				setDataSource(newDataSource);

				if (onChangedDataSource) {
					onChangedDataSource(newDataSource);
				}

				if (expanded === true) {
					if (onExpandedNode) {
						onExpandedNode(newDataSource, expandedNodes);
					}
				} else {
					if (onCollapsedNode) {
						onCollapsedNode(newDataSource, expandedNodes);
					}
				}

				if (loading) loadDataSource(node.id);
			}
		},
		[internalDataSource, onChangedDataSource, onLoadDataSource, loadDataSource, onExpandedNode, onCollapsedNode],
	);

	const nodeFocused = useCallback(
		(id: string) => {
			if (onLoosedFocusNode && focused) {
				onLoosedFocusNode(focused);
			}
			const node = findNodeById(internalDataSource, id);
			if (node) {
				setFocused(node);
				if (onFocusedNode) {
					onFocusedNode(node);
				}
			}
		},
		[internalDataSource, focused, onFocusedNode, onLoosedFocusNode],
	);

	const getFocused = useCallback(() => {
		return focused;
	}, [focused]);

	const nodeDoubleClicked = useCallback(
		(id: string, _selected: boolean) => {
			if (onDoubleClick) {
				const node = findNodeById(internalDataSource, id);
				if (node) {
					onDoubleClick(internalDataSource, node);
				}
			}
		},
		[internalDataSource, onDoubleClick],
	);

	const addNode = useCallback(
		(id: string, text: string) => {
			const node = findNodeById(internalDataSource, id);

			if (node) {
				const newNode: ArchbaseTreeNode = {
					text: text,
					state: { selected: false, expanded: false, loading: false },
					parentNode: node,
					id: `${nodesQuantity.current++}`,
					icon: '',
					color: '',
					image: '',
				};
				if (node.nodes) {
					node.nodes.push(newNode);
				} else {
					node.nodes = [newNode];
				}

				if (onChangedDataSource) {
					onChangedDataSource(internalDataSource);
				}

				if (onAddedNode) {
					onAddedNode(newNode, internalDataSource);
				}
			}
		},
		[internalDataSource, onChangedDataSource, onAddedNode],
	);

	const removeNode = useCallback(
		(id: string) => {
			const newDataSource = deleteById([...internalDataSource], id);
			if (newDataSource.length === 0) return false;
			setDataSource(newDataSource);

			if (onChangedDataSource) {
				onChangedDataSource(newDataSource);
			}
			if (onRemovedNode) {
				onRemovedNode(newDataSource);
			}
		},
		[internalDataSource, deleteById, onChangedDataSource, onRemovedNode],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (focused) {
				if (event.keyCode === 38) {
					event.preventDefault();
					const previousNode = findPreviousNodeById(focused.id, true);
					if (previousNode) {
						nodeFocused(previousNode.id);
						const element = document.getElementById(`${id}_${previousNode.id}`);
						if (element) {
							element.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
								inline: 'nearest',
							});
						}
					}
				} else if (event.keyCode === 40) {
					event.preventDefault();
					const nextNode = findNextNodeById(focused.id, true);
					if (nextNode) {
						nodeFocused(nextNode.id);
						const element = document.getElementById(`${id}_${nextNode.id}`);
						if (element) {
							element.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
								inline: 'nearest',
							});
						}
					}
				} else if (event.keyCode === 33) {
					event.preventDefault();
					let count = 0;
					let previousNode = findPreviousNodeById(focused.id, true);
					let node = previousNode;
					while (count < 5 && node) {
						node = findPreviousNodeById(node.id, true);
						if (node) {
							previousNode = node;
						}
						count++;
					}
					if (previousNode) {
						nodeFocused(previousNode.id);
						const element = document.getElementById(`${id}_${previousNode.id}`);
						if (element) {
							element.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
								inline: 'nearest',
							});
						}
					}
				} else if (event.keyCode === 34) {
					event.preventDefault();
					let nextNode = findNextNodeById(focused.id, true);
					let node = nextNode;
					let count = 0;
					while (count < 5 && node) {
						node = findNextNodeById(node.id, true);
						if (node) {
							nextNode = node;
						}
						count++;
					}
					if (nextNode) {
						nodeFocused(nextNode.id);
						const element = document.getElementById(`${id}_${nextNode.id}`);
						if (element) {
							element.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
								inline: 'nearest',
							});
						}
					}
				} else if (event.keyCode === 32) {
					event.preventDefault();
					const node = findNodeById(internalDataSource, focused.id);
					if (node) {
						let selected = true;
						if (node.state.selected) {
							selected = !node.state.selected;
						}
						nodeSelected(node.id, selected);
					}
				} else if (event.keyCode === 107) {
					event.preventDefault();
					const node = findNodeById(internalDataSource, focused.id);
					if (node) {
						if (!node.state.expanded) {
							nodeExpandedCollapsed(node.id, true);
						}
					}
				} else if (event.keyCode === 109) {
					event.preventDefault();
					const node = findNodeById(internalDataSource, focused.id);
					if (node) {
						if (node.state.expanded) {
							nodeExpandedCollapsed(node.id, false);
						}
					}
				}
			}
		},
		[
			focused,
			internalDataSource,
			nodeList.current,
			findPreviousNodeById,
			findNextNodeById,
			nodeSelected,
			nodeExpandedCollapsed,
		],
	);

	useEffect(() => {
		nodeList.current = [];
		setDataSource(setNodeDetails(lodash.clone({ nodes: dataSource })));
	}, [dataSource, setNodeDetails]);

	const renderedStyle = useMemo(() => {
		return {
			...(withBorder
				? {
						border:
							borderColor && `${rem(1)} solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
				  }
				: { border: 'none' }),
			...(height ? { height } : {}),
			...(width ? { width } : {}),
			marginLeft: '-20px',
			...style,
		};
	}, [style, withBorder, borderColor, height, width]);

	const children = useMemo(() => {
		return internalDataSource.map((node) => {
			return (
				<ArchbaseTreeViewItem
					id={`${id}_${node.id}`}
					node={node}
					key={node.id}
					level={1}
					onSelectedStatusChanged={nodeSelected}
					onExpandedCollapsedChanged={nodeExpandedCollapsed}
					onFocusedChanged={nodeFocused}
					onNodeDoubleClicked={nodeDoubleClicked}
					onLoadDataSource={loadDataSource}
					getFocused={getFocused}
					addNode={addNode}
					removeNode={removeNode}
					customRenderText={customRenderText}
					update={updateCounter}
					options={{
						selectable,
						color,
						backgroundColor: backgroundColor ? backgroundColor : 'transparent',
						hoverColor: hoverColor ? hoverColor : theme.black,
						hoverBackgroundColor,
						focusedColor: focusedColor ? focusedColor : theme.white,
						focusedBackgroundColor: focusedBackgroundColor
							? focusedBackgroundColor
							: theme.colors[theme.primaryColor][colorScheme === 'dark' ? 5 : 5],
						selectedColor: selectedColor ? selectedColor : 'orange',
						selectedBackgroundColor,
						iconColor,
						iconBackgroundColor,
						enableLinks,
						highlightSelected,
						borderColor:
							borderColor || `${rem(1)} solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
						withBorder,
						showTags,
						id,
					}}
				/>
			);
		});
	}, [
		internalDataSource,
		selectable,
		color,
		backgroundColor,
		hoverColor,
		hoverBackgroundColor,
		focusedColor,
		focusedBackgroundColor,
		selectedColor,
		selectedBackgroundColor,
		iconColor,
		iconBackgroundColor,
		enableLinks,
		highlightSelected,
		withBorder,
		showTags,
		nodeSelected,
		nodeExpandedCollapsed,
		nodeFocused,
		nodeDoubleClicked,
		loadDataSource,
		getFocused,
		addNode,
		removeNode,
		updateCounter,
	]);

	return (
		<div tabIndex={-1} className="archbase-treeview" onKeyDown={handleKeyDown} style={renderedStyle}>
			<ul style={{ height: '100%', overflowY: 'auto' }}>{children}</ul>
		</div>
	);
};
