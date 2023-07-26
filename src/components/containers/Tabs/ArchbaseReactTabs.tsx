import React, { useState, useRef, useEffect, CSSProperties, ReactNode } from 'react';
import './ArchbaseReactTabs.scss';


export interface ArchbaseTab {
  key: any;
  favicon: ReactNode | string | undefined;
  title: string;
}

export interface ArchbaseReactTabProps {
  favicon : ReactNode | string | undefined;
  title : string;
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
}

const ArchbaseReactTab : React.FC<ArchbaseReactTabProps> = (props) => {
	const { favicon, title, activeTab, position, contentWidth, onClick, onClose, setDragging, tabsContentWidth, animateTabMove,
		isDragging, index, sorting } = props;
	const [width, setWidth] = useState(0);
	const [isAdded, setAdd] = useState(false);
	const [movePosition, setMovePosition] = useState<Number|null>(null);
	const [startX, setStartX] = useState(null);
	const [_dragEnd, setDragEnd] = useState(false);
	const [tmpPosition, setTmpPosition] = useState<number>(0);
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
				<div className="archbase_tab-title">{title}</div>
				<div className="archbase_tab-drag-handle" title={title} onClick={onClick} onPointerDown={e => (onClick(e))} onMouseUp={onDragEnd} onMouseMove={onDragMove} onMouseDown={onDragStart}></div>
				<div className="archbase_tab-close" onClick={onClose}></div>
			</div>
		</div>
	);
}

export interface ArchbaseReactTabsProps {
  currentTabs: ArchbaseTab[],
  activeTab: any,
  onChange: Function,
  onClose: Function,
  className?: string,
  style?: CSSProperties,
  dark: boolean,
  onClick: Function,
}

export const ArchbaseReactTabs: React.FC<ArchbaseReactTabsProps> = (props) => {
	const { currentTabs, onChange, activeTab, onClose, className, style, dark, onClick } = props;
	const [active, setActive] = useState<string>();
	const [tabContentWidths, setTabContentWidths] = useState<number[]>([]);
	const [positions, setPositions] = useState<number[]>([]);
	const [tabs, setTabs] = useState(currentTabs || []);
	const [sorting, setSorting] = useState(false);
	const [isDragging, setDragging] = useState(false);
	const tabContentEl = useRef<any>(null);

	const TAB_CONTENT_MARGIN = 9
	const TAB_CONTENT_OVERLAP_DISTANCE = 1

	const TAB_CONTENT_MIN_WIDTH = 24
	const TAB_CONTENT_MAX_WIDTH = 240

	useEffect(() => {
		setTabContentWidths(getContentWidths());
		setPositions(tabContentPositions(getContentWidths()));
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	useEffect(() => {
		handleResize();
	}, [tabs]);

	useEffect(() => {
		!!currentTabs && setTabs(currentTabs);
	}, [currentTabs]);

	useEffect(() => {
		active != activeTab && setActive(activeTab);
	}, [activeTab]);

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
		let tabsDrag : ArchbaseTab[] = []
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
		!!onClose ? onClose(idx) : onChange(tabs.filter((_m, index) => index != idx))
	}
	return (
		<div className={className} style={style}>
			<div
				className={`archbase_tabs${!!dark ? " archbase_tabs-dark-theme" : ""}${!isDragging ? " archbase_tabs-is-sorting" : ""}`}
			>
				<div className={`archbase_tabs_content`} ref={tabContentEl} >
					{
						!!tabs && tabs.map((m : ArchbaseTab, index) =>
							!!positions[index] &&
							<ArchbaseReactTab
								key={m.key}
								favicon={m.favicon}
								title={m.title}
								activeTab={active === m.key}
								position={positions[index]}
								contentWidth={tabContentWidths[index]}
								onClick={_e => (setActive(m.key), onClick(m.key))}
								onClose={_e => closeTab(m.key)}
								setDragging={setDragging}
								tabsContentWidth={tabContentEl.current && tabContentEl.current.clientWidth}
								animateTabMove={(p: any) => animateTabMove(p, index)}
								isDragging={isDragging}
								id={m.key}
								index={index}
								sorting={sorting}
							/>)
					}
				</div>
				<div className="archbase_tabs-bottom-bar"></div>
			</div>
			<div className="archbase_tabs-optional-shadow-below-bottom-bar"></div>
		</div>

	);
}




