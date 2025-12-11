/**
 * ArchbaseTreeViewItem — linha da árvore com checks, ícones e suporte a carregamento preguiçoso.
 * @status stable
 */
import { ActionIcon, Space, Text } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight, IconSquare, IconSquareCheck } from '@tabler/icons-react';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ArchbaseTreeNode, ArchbaseTreeViewOptions } from './ArchbaseTreeView.types';

export interface ArchbaseTreeViewItemProps {
	id: string;
	node: ArchbaseTreeNode;
	options: ArchbaseTreeViewOptions;
	level: number;
	onLoadDataSource: (id: string) => void;
	onSelectedStatusChanged: (id: string, selected: boolean) => void;
	onExpandedCollapsedChanged: (id: string, expanded: boolean) => void;
	onFocusedChanged: (id: string) => void;
	getFocused: () => ArchbaseTreeNode | undefined;
	onNodeDoubleClicked: (id: string, selected: boolean) => void;
	addNode: (id: string, text: string) => void;
	removeNode: (id: string) => void;
	customRenderText?: (node: ArchbaseTreeNode) => ReactNode;
	update: number;
}

export const ArchbaseTreeViewItem: React.FC<ArchbaseTreeViewItemProps> = ({
	node,
	options,
	level,
	onSelectedStatusChanged,
	onExpandedCollapsedChanged,
	onFocusedChanged,
	getFocused,
	onNodeDoubleClicked,
	onLoadDataSource,
	addNode,
	removeNode,
	id,
	customRenderText,
	update,
}: ArchbaseTreeViewItemProps) => {
	const [expanded, setExpanded] = useState(false);
	const [selected, setSelected] = useState(false);
	const forceUpdate = useForceUpdate();

	const toggleExpanded = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			const newExpanded = !expanded;
			setExpanded(newExpanded);
			onExpandedCollapsedChanged(node.id, newExpanded);
			event.stopPropagation();
		},
		[expanded, node.id, onExpandedCollapsedChanged, node.state.expanded],
	);

	useEffect(() => {
		if (node.state) {
			setExpanded(node.state.expanded);
		}
		if (node.state) {
			setSelected(node.state.selected);
		}
	}, [node.state.expanded, node.state.selected]);

	const toggleSelected = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			const newSelected = !selected;
			setSelected(newSelected);
			onSelectedStatusChanged(node.id, newSelected);
			event.stopPropagation();
			forceUpdate();
		},
		[selected, node.id, onSelectedStatusChanged, node.state.selected],
	);

	const toggleFocused = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			onFocusedChanged(node.id);
			forceUpdate();
			event.stopPropagation();
		},
		[node.id, onFocusedChanged],
	);

	const doubleClicked = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			onNodeDoubleClicked(node.id, selected);
			event.stopPropagation();
		},
		[node.id, selected, onNodeDoubleClicked],
	);

	const style = useMemo(() => {
		const itemStyle: React.CSSProperties = {};
		if (options.highlightSelected && selected) {
			itemStyle.color = options.selectedColor;
			itemStyle.backgroundColor = options.selectedBackgroundColor;
		} else {
			itemStyle.color = node.color || options.color;
			itemStyle.backgroundColor = node.backgroundColor || options.backgroundColor;
		}
		return itemStyle;
	}, [selected, node, options]);

	const checkSelectedIcon = useMemo(() => {
		if (options.selectable) {
			return selected ? (
				<ActionIcon onClick={toggleSelected} variant="transparent">
					<IconSquareCheck size="1.2rem" style={style} />
				</ActionIcon>
			) : (
				<ActionIcon onClick={toggleSelected} variant="transparent">
					<IconSquare size="1.2rem" style={style} />
				</ActionIcon>
			);
		}
	}, [options.selectable, selected, style, toggleSelected]);

	const expandCollapseIcon = useMemo(() => {
		if (!expanded) {
			return (
				<ActionIcon onClick={toggleExpanded} variant="transparent">
					<IconChevronRight size="1.2rem" style={{ ...style }} />
				</ActionIcon>
			);
		} else {
			if (node.state?.loading === true) {
				return <i style={{ ...style, width: '1rem' }} className="svg-inline--fa fa-spinner fa-w-16 fa-spin fa-lg"></i>;
			} else {
				return (
					<ActionIcon onClick={toggleExpanded} variant="transparent">
						<IconChevronDown size="1.2rem" style={{ ...style }} />
					</ActionIcon>
				);
			}
		}
	}, [expanded, selected, node, style, toggleExpanded, toggleSelected]);

	const styleFocused = useMemo(() => {
		const focusedNode = getFocused();
		if (focusedNode && focusedNode.id === node.id) {
			return {
				color: options.focusedColor,
				backgroundColor: options.focusedBackgroundColor,
			};
		}
		return {};
	}, [node.id, getFocused, options.focusedColor, options.focusedBackgroundColor, expanded, selected]);

	const children = useMemo(() => {
		const renderedChildren: React.JSX.Element[] = [];
		if (node.nodes && node.state.expanded) {
			node.nodes.forEach((childNode) => {
				renderedChildren.push(
					<ArchbaseTreeViewItem
						id={`${options.id}_${childNode.id}`}
						key={childNode.id}
						node={childNode}
						level={level + 1}
						onSelectedStatusChanged={onSelectedStatusChanged}
						onExpandedCollapsedChanged={onExpandedCollapsedChanged}
						onFocusedChanged={onFocusedChanged}
						getFocused={getFocused}
						onNodeDoubleClicked={onNodeDoubleClicked}
						addNode={addNode}
						removeNode={removeNode}
						options={options}
						onLoadDataSource={onLoadDataSource}
						customRenderText={customRenderText}
						update={update}
					/>,
				);
			});
		}
		return renderedChildren;
	}, [
		node.nodes,
		node.state,
		node,
		expanded,
		selected,
		level,
		onSelectedStatusChanged,
		onExpandedCollapsedChanged,
		onFocusedChanged,
		getFocused,
		onNodeDoubleClicked,
		addNode,
		removeNode,
		options,
		update,
	]);

	return (
		<li style={style} onDoubleClick={doubleClicked} id={id} key={`${options.id}_${node.id}`}>
			<div style={{ display: 'flex' }}>
				{!node.isleaf ? expandCollapseIcon : <Space w="md" />}
				{checkSelectedIcon}
				<span style={{ ...styleFocused, display: 'flex' }} className="archbase-treeview-item" onClick={toggleFocused}>
					{node.icon}
					{node.image ? <img alt="" style={{ padding: '0.2rem' }} src={node.image} /> : null}
					{customRenderText ? customRenderText(node) : <Text truncate>{node.text}</Text>}
				</span>
			</div>
			<ul>{children}</ul>
		</li>
	);
};
