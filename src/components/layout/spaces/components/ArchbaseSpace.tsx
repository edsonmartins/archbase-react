import * as React from 'react';
import {
	DOMRectContext,
	IArchbaseSpaceInnerProps,
	LayerContext,
	ParentContext,
	SSR_SUPPORT_ENABLED,
	useEffectOnce,
	useSpace,
	useUniqueId,
} from '../core-react';
import { AnchorType, CenterType, ResizeHandlePlacement, Type } from '../core-types';
import { isServer, updateStyleDefinition } from '../core-utils';
import { ArchbaseSpaceCentered } from './ArchbaseSpaceCentered';
import { ArchbaseSpaceCenteredVertically } from './ArchbaseSpaceCenteredVertically';

function applyCentering(children: React.ReactNode, centerType: CenterType | undefined) {
	switch (centerType) {
		case CenterType.Vertical:
			return <ArchbaseSpaceCenteredVertically>{children}</ArchbaseSpaceCenteredVertically>;
		case CenterType.HorizontalVertical:
			return <ArchbaseSpaceCentered>{children}</ArchbaseSpaceCentered>;
	}
	return children;
}

export class ArchbaseSpace extends React.Component<IArchbaseSpaceInnerProps> {
	public render() {
		return <SpaceInner {...this.props} wrapperInstance={this} />;
	}
}

const SpaceInner: React.FC<IArchbaseSpaceInnerProps & { wrapperInstance: ArchbaseSpace }> = (props) => {
	let idToUse = props.id ?? props.wrapperInstance['_react_spaces_uniqueid'];
	const [initialRender, setInitialRender] = React.useState(SSR_SUPPORT_ENABLED ? true : false);

	const uniqueId = useUniqueId();

	if (!idToUse) {
		props.wrapperInstance['_react_spaces_uniqueid'] = uniqueId;
		idToUse = props.wrapperInstance['_react_spaces_uniqueid'];
	}

	const {
		style,
		className,
		onClick,
		onDoubleClick,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseMove,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		children,
		handleRender,
	} = props;

	const events = {
		onClick: onClick,
		onDoubleClick: onDoubleClick,
		onMouseDown: onMouseDown,
		onMouseEnter: onMouseEnter,
		onMouseLeave: onMouseLeave,
		onMouseMove: onMouseMove,
		onTouchStart: onTouchStart,
		onTouchMove: onTouchMove,
		onTouchEnd: onTouchEnd,
	};

	const { space, domRect, elementRef, resizeHandles } = useSpace({
		...props,
		...{ id: idToUse },
	});

	if (SSR_SUPPORT_ENABLED && !isServer()) {
		const preRenderedStyle = document.getElementById(`style_${idToUse}_ssr`);
		if (preRenderedStyle) {
			space.ssrStyle = preRenderedStyle.innerHTML;
		}
		updateStyleDefinition(space);
	}

	useEffectOnce(() => {
		space.element = elementRef.current!;

		if (SSR_SUPPORT_ENABLED) {
			if (initialRender) {
				setInitialRender(false);
			}
		}
	});

	const userClasses = className ? className.split(' ').map((c) => c.trim()) : [];

	const outerClasses = [
		...['spaces-space', space.children.find((s) => s.resizing) ? 'spaces-resizing' : undefined],
		...[space.type === Type.Fixed ? 'spaces-fixedsize-layout' : undefined],
		...[space.type === Type.ViewPort ? 'spaces-fullpage-layout' : undefined],
		...userClasses.map((c) => `${c}-container`),
	].filter((c) => c);

	const innerClasses = [...['spaces-space-inner'], ...userClasses];

	let innerStyle = style;
	if (space.handlePlacement === ResizeHandlePlacement.Inside) {
		innerStyle = {
			...style,
			...{
				left: space.anchor === AnchorType.Right ? space.handleSize : undefined,
				right: space.anchor === AnchorType.Left ? space.handleSize : undefined,
				top: space.anchor === AnchorType.Bottom ? space.handleSize : undefined,
				bottom: space.anchor === AnchorType.Top ? space.handleSize : undefined,
			},
		};
	}

	const centeredContent = applyCentering(children, props.centerContent);

	const outerProps = {
		...{
			id: space.id,
			ref: elementRef,
			className: outerClasses.join(' '),
		},
		...events,
	} as any;

	return (
		<>
			{resizeHandles.mouseHandles.map((handleProps) => handleRender?.(handleProps) || <div {...handleProps} />)}
			{SSR_SUPPORT_ENABLED && space.ssrStyle && initialRender && (
				<style id={`style_${space.id}_ssr`}>{space.ssrStyle}</style>
			)}
			{React.createElement(
				props.as || 'div',
				outerProps,
				<div className={innerClasses.join(' ')} style={innerStyle}>
					<ParentContext.Provider value={space.id}>
						<LayerContext.Provider value={undefined}>
							<DOMRectContext.Provider value={domRect}>{centeredContent}</DOMRectContext.Provider>
						</LayerContext.Provider>
					</ParentContext.Provider>
				</div>,
			)}
		</>
	);
};
