import React, { useState, useCallback, useMemo } from 'react';
import { ArchbaseTreeNode, ArchbaseTreeViewOptions } from './ArchbaseTreeView.types';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconSquare, IconSquareCheck } from '@tabler/icons-react';

interface ArchbaseTreeViewItemProps {
  id: string;
  node: ArchbaseTreeNode;
  options: ArchbaseTreeViewOptions;
  level: number;
  onLoadDataSource: (id: string) => void;
  onSelectedStatusChanged: (id: string, selected: boolean) => void;
  onExpandedCollapsedChanged: (id: string, expanded: boolean) => void;
  onFocusedChanged: (id: string) => void;
  getFocused: () => ArchbaseTreeNode | null;
  onNodeDoubleClicked: (id: string, selected: boolean) => void;
  addNode: (id: string, text: string) => void;
  removeNode: (id: string) => void;
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
}: ArchbaseTreeViewItemProps) => {
  const [expanded, setExpanded] = useState(node.state && node.state.expanded);
  const [selected, setSelected] = useState(node.state && node.state.selected);
  const [loading, setLoading] = useState(node.state && node.state.loading);
  const [addNodeForm, setAddNodeForm] = useState(false);

  const toggleExpanded = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const newExpanded = !expanded;
      setExpanded(newExpanded);
      onExpandedCollapsedChanged(node.id, newExpanded);
      event.stopPropagation();
    },
    [expanded, node.id, onExpandedCollapsedChanged]
  );

  const toggleSelected = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const newSelected = !selected;
      setSelected(newSelected);
      onSelectedStatusChanged(node.id, newSelected);
      event.stopPropagation();
    },
    [selected, node.id, onSelectedStatusChanged]
  );

  const toggleFocused = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onFocusedChanged(node.id);
      event.stopPropagation();
    },
    [node.id, onFocusedChanged]
  );

  const doubleClicked = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onNodeDoubleClicked(node.id, selected);
      event.stopPropagation();
    },
    [node.id, selected, onNodeDoubleClicked]
  );

  const newNodeForm = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setAddNodeForm(!addNodeForm);
      event.stopPropagation();
    },
    [addNodeForm]
  );

  const addNewNode = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!new RegExp('^[a-zA-Z0-9]+$').test(newNodeNameRef.current?.value || '')) {
        newNodeNameRef.current?.setCustomValidity('Incorrect format');
        return false;
      }
      setAddNodeForm(false);
      addNode(node.id, newNodeNameRef.current?.value || '');
      setExpanded(true);
      event.stopPropagation();
    },
    [node.id, addNode]
  );

  const removeItem = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      removeNode(node.id);
      event.stopPropagation();
    },
    [node.id, removeNode]
  );

  const newNodeNameRef = React.createRef<HTMLInputElement>();

  const style = useMemo(() => {
    let itemStyle: React.CSSProperties = {};
    let iconStyle: React.CSSProperties = {
      color: options.iconColor,
      backgroundColor: options.iconBackgroundColor,
    };
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
        <ActionIcon onClick={toggleSelected} variant="transparent"><IconSquareCheck size="1.2rem" style={style}/></ActionIcon>
      ) : (
        <ActionIcon onClick={toggleSelected} variant="transparent"><IconSquare size="1.2rem" style={style}/></ActionIcon>
      );
    }
  }, [options.selectable, selected, style, toggleSelected]);

  const expandCollapseIcon = useMemo(() => {
    if (!expanded) {
      return (
        <ActionIcon onClick={toggleExpanded} variant="transparent"><IconChevronRight size="1.2rem" style={{ ...style }}/></ActionIcon>
      );
    } else {
      if (node.state?.loading === true) {
        return (
          <i
            style={{ ...style, width: '1rem' }}
            className="svg-inline--fa fa-spinner fa-w-16 fa-spin fa-lg"
          ></i>
        );
      } else {
        return (
          <ActionIcon onClick={toggleExpanded} variant="transparent"><IconChevronDown size="1.2rem" style={{ ...style }}/></ActionIcon>
        );
      }
    }
  }, [expanded, node, style, toggleExpanded]);

  const styleFocused = useMemo(() => {
    const focusedNode = getFocused();
    if (focusedNode && focusedNode.id === node.id) {
      return {
        color: options.focusedColor,
        backgroundColor: options.focusedBackgroundColor,
      };
    }
    return {};
  }, [node.id, getFocused, options.focusedColor, options.focusedBackgroundColor]);

  

  const children = useMemo(() => {
    let renderedChildren: JSX.Element[] = [];
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
          />
        );
      });
    }
    return renderedChildren;
  }, [
    node.nodes,
    node.state,
    node,
    expanded,
    level,
    onSelectedStatusChanged,
    onExpandedCollapsedChanged,
    onFocusedChanged,
    getFocused,
    onNodeDoubleClicked,
    addNode,
    removeNode,
    options,
  ]);

  //if (children.length > 0 || !node.isleaf) {
    return (
      <li
        style={style}
        onDoubleClick={doubleClicked}
        id={id}
        key={`${options.id}_${node.id}`}
      >
        <div style={{display:'flex',}}>
          {expandCollapseIcon}
          {checkSelectedIcon}
          <span
            style={{...styleFocused, display:'flex'}}
            className="archbase-treeview-item"
            onClick={toggleFocused}
          >
            {node.icon}
            {node.image ? <img alt="" style={{ padding: '0.2rem' }} src={node.image} /> : null}
            <Text truncate>{node.text}</Text>
          </span>
        </div>
        <ul>{children}</ul>
      </li>
    );
  //}

  // return (
  //   <li style={style} key={`${options.id}_${node.id}`} id={id}>
  //     {checkSelectedIcon}
  //     <span
  //       style={styleFocused}
  //       className="anteros-treeview-item"
  //       onClick={toggleFocused}
  //     >
  //       {node.icon}
  //       {node.image ? <img alt="" style={{ padding: '0.2rem' }} src={node.image} /> : null}
  //       {node.text}
  //     </span>
  //   </li>
  // );
};


