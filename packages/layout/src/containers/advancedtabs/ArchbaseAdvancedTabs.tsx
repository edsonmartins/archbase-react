/* eslint-disable */
import React, { useState, useRef, useEffect, CSSProperties, ReactNode } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { Menu } from '@mantine/core';
import { useArchbaseTranslation } from '@archbase/core';


export interface ArchbaseAdvancedTabItem {
  key: any;
  favicon: ReactNode | string | undefined;
  title: string;
  customTitle?: string;
}

export interface ArchbaseAdvancedTabProps {
  favicon : ReactNode | string | undefined;
  title : string;
  /** Título customizado que aparecerá na aba. Pode ser utilizado $title para interpolar o valor na string do customTitle */
  customTitle?: string;
  activeTab : boolean;
  position : number;
  contentWidth : number;
  onClick : (event: React.MouseEvent<HTMLDivElement>) => void;
  onClose : (event: React.MouseEvent<HTMLDivElement>) => void;
  setDragging : Function;
  tabsContentWidth : number;
  animateTabMove : Function;
	isDragging : boolean;
  id: any;
  index : number;
  sorting : boolean;
  showButtonClose: boolean;
  // Novas props para menu de contexto e dropdown
  onCloseAllTabs?: () => void;
  onCloseLeftTabs?: (tabId: string) => void;
  onCloseRightTabs?: (tabId: string) => void;
  onCloseOtherTabs?: (tabId: string) => void;
  totalTabs?: number;
}

const ArchbaseAdvancedTab : React.FC<ArchbaseAdvancedTabProps> = (props) => {
	const { favicon, title, customTitle, activeTab, position, contentWidth, onClick, onClose, setDragging, tabsContentWidth, animateTabMove,
		isDragging, index, sorting, showButtonClose, onCloseAllTabs, onCloseLeftTabs, onCloseRightTabs, onCloseOtherTabs, totalTabs } = props;
	const { t } = useArchbaseTranslation('archbase');
	const [width, setWidth] = useState(0);
	const [isAdded, setAdd] = useState(false);
	const [movePosition, setMovePosition] = useState<Number|null>(null);
	const [startX, setStartX] = useState(null);
	const [_dragEnd, setDragEnd] = useState(false);
	const [tmpPosition, setTmpPosition] = useState<number>(0);
	const [dropdownOpened, setDropdownOpened] = useState(false);
	const tabEl = useRef(null);

	const TAB_CONTENT_MARGIN = 9
	const TAB_SIZE_SMALL = 84
	const TAB_SIZE_SMALLER = 60
	const TAB_SIZE_MINI = 48

	useEffect(() => {
		document.addEventListener('mousemove', onDragMove);
		document.addEventListener('mouseup', onDragEnd);
		return () => {
			document.removeEventListener('mousemove', onDragMove);
			document.addEventListener('mouseup', onDragEnd);
		}
	});

	useEffect(() => { 
		if (!isAdded) {
			setTimeout(() => setAdd(true), 500)
		}
	}, [isAdded])

	useEffect(() => {
		setWidth(contentWidth + (2 * TAB_CONTENT_MARGIN))
	}, [contentWidth])

	const onDragStart = (e:any) => {
		if (e.button === 0) {
			setDragging(true)
			setStartX(e.pageX)
			setDragEnd(false)
			setTmpPosition(position)
		}
	}

	const onDragMove = (e:any) => {
		if (startX != null && isDragging) {
			let newPosition = tmpPosition - TAB_CONTENT_MARGIN + (e.pageX - startX);

			newPosition < 0 && (newPosition = 0)
			newPosition > tabsContentWidth - width && (newPosition = tabsContentWidth - width)
			setMovePosition(newPosition)
			!sorting && animateTabMove(newPosition,)
		}
	}

	const onDragEnd = (_e:any) => {
		if (startX != null && isDragging) {
			setStartX(null)
			setMovePosition(null)
			setDragging(false)
			setDragEnd(true)
		}
	}
	const [tmp, setTmp] = useState(position - TAB_CONTENT_MARGIN);
	useEffect(() => {
		setTmp(!!position ? position - TAB_CONTENT_MARGIN : 0)
	}, [index, position])

	// Handlers para o menu de contexto e dropdown
	const handleCloseOthers = () => {
		if (onCloseOtherTabs) {
			onCloseOtherTabs(props.id);
		}
		setDropdownOpened(false);
	};

	const handleCloseLeft = () => {
		if (onCloseLeftTabs) {
			onCloseLeftTabs(props.id);
		}
		setDropdownOpened(false);
	};

	const handleCloseRight = () => {
		if (onCloseRightTabs) {
			onCloseRightTabs(props.id);
		}
		setDropdownOpened(false);
	};

	const handleCloseAll = () => {
		if (onCloseAllTabs) {
			onCloseAllTabs();
		}
		setDropdownOpened(false);
	};

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setDropdownOpened(true);
	};

	const hasLeftTabs = index > 0;
	const hasRightTabs = totalTabs !== undefined && index < totalTabs - 1;
	const hasOtherTabs = (totalTabs || 0) > 1;

	return (
		<div
			className={`archbase_tab ${!isAdded ? " archbase_tab-was-just-added" : ""}${startX == null && !activeTab ? " archbase_tab-was-just-dragged" : ""}`}
			style={{
				transform: `translate3d(${movePosition == null ? tmp : movePosition}px, 0, 0)`, width: `${width}px`
			}}
			tab-active={activeTab !== false ? "" : null}
      		is-small={contentWidth < TAB_SIZE_SMALL ? "" : null}
			is-smaller={contentWidth < TAB_SIZE_SMALLER ? "" : null} is-mini={contentWidth < TAB_SIZE_MINI ? "" : null}
			ref={tabEl}
			onContextMenu={handleContextMenu}
		>
			<div className="archbase_tab-dividers"></div>
			<div className="archbase_tab-background">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<symbol id="archbase_tab-geometry-left" viewBox="0 0 214 36"><path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" /></symbol>
						<symbol id="archbase_tab-geometry-right" viewBox="0 0 214 36"><use xlinkHref="#archbase_tab-geometry-left" /></symbol>
						<clipPath id="crop"><rect className="mask" width="100%" height="100%" x="0" /></clipPath>
					</defs>
					<svg width="52%" height="100%"><use xlinkHref="#archbase_tab-geometry-left" width="214" height="36" className="archbase_tab-geometry" />
					</svg>
					<g transform="scale(-1, 1)">
						<svg width="52%" height="100%" x="-100%" y="0"><use xlinkHref="#archbase_tab-geometry-right" width="214" height="36" className="archbase_tab-geometry" />
						</svg>
					</g>
				</svg>
			</div>
			<div className="archbase_tab-content">
				{!!favicon && <div className="archbase_tab-favicon" style={{ "backgroundImage": `url(${favicon})` }}></div>}
				<div className="archbase_tab-title">{customTitle ?? title}</div>
				<div className="archbase_tab-drag-handle" title={customTitle ?? title} onClick={onClick} onPointerDown={e => (onClick(e))} onMouseUp={onDragEnd} onMouseMove={onDragMove} onMouseDown={onDragStart}></div>
				{(onCloseAllTabs || onCloseLeftTabs || onCloseRightTabs || onCloseOtherTabs) && (
					<Menu shadow="md" width={200} opened={dropdownOpened} onChange={setDropdownOpened} position="bottom-end">
						<Menu.Target>
							<div className="archbase_tab-dropdown" onClick={(e) => {
								e.stopPropagation();
								setDropdownOpened(!dropdownOpened);
							}}></div>
						</Menu.Target>
						<Menu.Dropdown>
							{hasOtherTabs && (
								<Menu.Item onClick={handleCloseOthers}>
									{String(t('tabs.closeOthers'))}
								</Menu.Item>
							)}
							{hasLeftTabs && (
								<Menu.Item onClick={handleCloseLeft}>
									{String(t('tabs.closeLeft'))}
								</Menu.Item>
							)}
							{hasRightTabs && (
								<Menu.Item onClick={handleCloseRight}>
									{String(t('tabs.closeRight'))}
								</Menu.Item>
							)}
							{(hasOtherTabs || hasLeftTabs || hasRightTabs) && <Menu.Divider />}
							<Menu.Item onClick={handleCloseAll}>
								{String(t('tabs.closeAll'))}
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
				{showButtonClose?<div className="archbase_tab-close" onClick={(e) => {
					onClose(e);
				}}></div>:null}
			</div>
		</div>
	);
}

export interface ArchbaseAdvancedTabsProps {
  currentTabs: ArchbaseAdvancedTabItem[]
  buttonCloseOnlyActiveTab: boolean
  activeTab: any,
  onTabChange: Function,
  onTabClose: Function,
  className?: string,
  style?: CSSProperties,
  dark: boolean,
  onClick: Function,
  // Novas props para fechar múltiplas abas
  onCloseAllTabs?: () => void;
  onCloseLeftTabs?: (tabId: string) => void;
  onCloseRightTabs?: (tabId: string) => void;
  onCloseOtherTabs?: (tabId: string) => void;
}

export const ArchbaseAdvancedTabs: React.FC<ArchbaseAdvancedTabsProps> = (props) => {
	const { currentTabs, onTabChange: onChange, activeTab, onTabClose: onClose, className, style, dark, onClick, buttonCloseOnlyActiveTab = false, onCloseAllTabs, onCloseLeftTabs, onCloseRightTabs, onCloseOtherTabs } = props;
	const [tabContentWidths, setTabContentWidths] = useState<number[]>([]);
	const [positions, setPositions] = useState<number[]>([]);
	const [tabs, setTabs] = useState(currentTabs || []);
	const [sorting, setSorting] = useState(false);
	const [isDragging, setDragging] = useState(false);
	const tabContentEl = useRef<any>(null);
	const { width, height } = useWindowSize()

	const TAB_CONTENT_MARGIN = 9
	const TAB_CONTENT_OVERLAP_DISTANCE = 1

	const TAB_CONTENT_MIN_WIDTH = 24
	const TAB_CONTENT_MAX_WIDTH = 240

	useEffect(() => {
		setTabContentWidths(getContentWidths());
		setPositions(tabContentPositions(getContentWidths()));
	}, []);

	useEffect(() => {
		handleResize();
	}, [JSON.stringify(tabs), width, height]);

	useEffect(() => {
		!!currentTabs && setTabs(currentTabs);
	}, [JSON.stringify(currentTabs)]);

	const handleResize = () => {
		const widths = getContentWidths();
		if (widths) {
			setTabContentWidths(widths);
			setPositions(tabContentPositions(widths));
		}
	}

	const getContentWidths = () : number[] => {
    const widths : number[] = []
		if (tabContentEl.current) {
			const numberOfTabs = tabs.length
			const tabsContentWidth = tabContentEl.current.clientWidth
			const tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE
			const targetWidth = (tabsContentWidth - (2 * TAB_CONTENT_MARGIN) + tabsCumulativeOverlappedWidth) / numberOfTabs
			const clampedTargetWidth = Math.max(TAB_CONTENT_MIN_WIDTH, Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth))
			const flooredClampedTargetWidth = Math.floor(clampedTargetWidth)
			const totalTabsWidthUsingTarget = (flooredClampedTargetWidth * numberOfTabs) + (2 * TAB_CONTENT_MARGIN) - tabsCumulativeOverlappedWidth
			const totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget		
			let extraWidthRemaining = totalExtraWidthDueToFlooring
			for (let i = 0; i < numberOfTabs; i += 1) {
				const extraWidth = flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH && extraWidthRemaining > 0 ? 1 : 0
				widths.push(flooredClampedTargetWidth + extraWidth)
				if (extraWidthRemaining > 0) extraWidthRemaining -= 1
			}			
		}
    return widths
	}

	const tabContentPositions = (contentWidths : number[]) : number[] => {
		const positions : number[] = []
		const widths = contentWidths || tabContentWidths;

		let position = TAB_CONTENT_MARGIN
		widths.forEach((width, i) => {
			const offset = i * TAB_CONTENT_OVERLAP_DISTANCE
			positions.push(position - offset)
			position += width
		})

		return positions
	}

	const animateTabMove = (position:any, index:any) => {
		setSorting(true)
		let closest = Infinity
		let closestIndex = -1
		let tabsDrag : ArchbaseAdvancedTabItem[] = []
		positions.forEach((v, i) => {
			if (Math.abs(position - v) < closest) {
				closest = Math.abs(position - v)
				closestIndex = i
			}
		})
		closestIndex = Math.max(0, Math.min(positions.length, closestIndex));
		if (index != closestIndex) {
			positions.forEach((_v, i) => {
				if (i == index) {
					tabsDrag[i] = tabs[closestIndex > index ? i + 1 : i - 1]
				}
				else if (index > i && i >= closestIndex) { 
					tabsDrag[i] = tabs[i + 1]
				}
				else if (index < i && i <= closestIndex) {
					tabsDrag[i] = tabs[i - 1]
				}
				else {
					tabsDrag[i] = tabs[i]
				}
			})
			
			checkIndex(tabsDrag) && onChange(tabsDrag)
		}
		setSorting(false)
	}

	const checkIndex = (newTabs:any) => {
		return new Set(newTabs).size === newTabs.length;
	}

	const closeTab = (idx:any) => {
		if (!!onClose) {
			onClose(idx);
		} else {
			onChange(tabs.filter((_m, index) => index != idx));
		}
	}
	return (
		<div className={className} style={style}>
			<div
				className={`archbase_tabs${!!dark ? " archbase_tabs-dark-theme" : ""}${!isDragging ? " archbase_tabs-is-sorting" : ""}`}
			>
				<div className={`archbase_tabs_content`} ref={tabContentEl} >
					{
						!!tabs && tabs.map((m : ArchbaseAdvancedTabItem, index) =>
							!!positions[index] &&
							<ArchbaseAdvancedTab
								key={m.key}
								favicon={m.favicon}
								title={m.title}
								customTitle={m.customTitle}
								activeTab={activeTab === m.key}
								position={positions[index]}
								contentWidth={tabContentWidths[index]}
								onClick={_e => onClick(m.key)}
								onClose={_e => closeTab(m.key)}
								setDragging={setDragging}
								showButtonClose={(() => {
									const shouldShow = buttonCloseOnlyActiveTab ? activeTab === m.key : true;
									return shouldShow;
								})()}
								tabsContentWidth={tabContentEl.current && tabContentEl.current.clientWidth}
								animateTabMove={(p: any) => animateTabMove(p, index)}
								isDragging={isDragging}
								id={m.key}
								index={index}
								sorting={sorting}
								onCloseAllTabs={onCloseAllTabs}
								onCloseLeftTabs={onCloseLeftTabs}
								onCloseRightTabs={onCloseRightTabs}
								onCloseOtherTabs={onCloseOtherTabs}
								totalTabs={tabs.length}
							/>)
					}
				</div>
				<div className="archbase_tabs-bottom-bar"></div>
			</div>
		</div>

	);
}




