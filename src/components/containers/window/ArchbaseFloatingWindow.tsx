import React, { useEffect, useRef } from 'react';
import './ArchbaseFloatingWindow.css';
import { useArchbaseSize } from '@components/hooks';

export interface ArchbaseFloatingWindowProps {
  id: string;
  children?: any;
  height: number;
  width: number;
  top?: number;
  left?: number;
  resizable?: boolean;
  titleBar?: {
    icon?: string | HTMLImageElement;
    title?: string;
    buttons?: {
      minimize?: boolean;
      maximize?: boolean;
      close?: () => void;
    };
  };
  style?: React.CSSProperties;
}

type ArchbaseResizeState = 'normal' | 'minimized' | 'maximized';

interface ArchbaseWindowPosition {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

const nextZIndex: () => number = () => {
  let maxZ = 0;
  const list = document.querySelectorAll<HTMLDivElement>('.archbase-window-container');
  list.forEach((w) => {
    let z = parseInt(w.style.zIndex);
    maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
  });

  return maxZ + 1;
};

export const ArchbaseFloatingWindow: React.FC<ArchbaseFloatingWindowProps> = (props: ArchbaseFloatingWindowProps) => {
  let properties = Object.assign(
    {
      id: props.id && props.id.length ? props.id : Date.now().toString(),
      children: null,
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      resizable: false,
      titleBar: Object.assign(
        {
          icon: ' ',
          title: 'Untitled window',
          buttons: Object.assign(
            {
              minimize: true,
              maximize: true,
              close: true,
            },
            (props.titleBar && props.titleBar.buttons) || {},
          ),
        },
        props.titleBar,
      ),
      style: {},
    },
    props,
  );

  if (!properties.id) {
    properties.id = Date.now().toString();
  }

  Object.freeze(properties);

  const [height, setHeight] = React.useState(properties.height);
  const [width, setWidth] = React.useState(properties.width);
  const [top, setTop] = React.useState<number>(properties.top || 0);
  const [left, setLeft] = React.useState<number>(properties.left || 0);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);
  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [maximized, setMaximized] = React.useState<boolean>(false);
  const [minimizeIcon, setMinimizeIcon] = React.useState<string>('▁');
  const [maximizeIcon, setMaximizeIcon] = React.useState<string>('□');
  const [contentDisplay, setContentDisplay] = React.useState<boolean>(true);
  const [windowTransition, setWindowTransition] = React.useState('');
  const [level, setLevel] = React.useState<number>(nextZIndex());
  const [visibility, setWindowVisibility] = React.useState<number>(1.0);
  const [resize, setResize] = React.useState<ArchbaseResizeState>('normal');

  const ARCHBASE_WINDOW_POSITION = `archbase-window-position-${props.id}`;

  const container = React.useRef<HTMLDivElement>(null);
  const windowTitle = React.useRef<HTMLSpanElement>(null);
  const effectiveHeight = useRef(height);
  const effectiveWidth = useRef(width);
  const [containerWidth, containerHeight] = useArchbaseSize(container);

  const animationDuration = 500;

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    setYOffset(e.clientY - top);
    setXOffset(e.clientX - left);
    setLevel(nextZIndex());
    setWindowVisibility(0.5);
  };

  const handleDrag = (e: MouseEvent | React.MouseEvent) => {
    setLeft((e.clientX || e.screenX || left + xOffset) - xOffset);
    setTop((e.clientY || e.screenY || top + yOffset) - yOffset);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
    setLeft((e.clientX || e.screenX) - xOffset);
    setTop((e.clientY || e.screenY) - yOffset);
    setWindowVisibility(1.0);
    if (props.id) {
      const currentPosition: ArchbaseWindowPosition = {
        top: (e.clientY || e.screenY) - yOffset,
        left: (e.clientX || e.screenX) - xOffset,
        width: effectiveWidth.current,
        height: effectiveHeight.current,
      };
      try {
        localStorage.setItem(ARCHBASE_WINDOW_POSITION, JSON.stringify(currentPosition));
      } catch (ex) {}
    }
  };

  const minimize = () => {
    setWindowTransition(`${animationDuration}ms ease-in-out`);
    const parent = document.getElementById(properties.id)?.parentElement;
    const positionStr: string = localStorage.getItem(ARCHBASE_WINDOW_POSITION);
    let heightTemp = height;
    let widthTemp = width;
    let topTemp = parent?.offsetTop;
    let leftTemp = parent?.offsetLeft;
    if (positionStr) {
      try {
        const position: ArchbaseWindowPosition = JSON.parse(positionStr);
        heightTemp = position.height;
        widthTemp = position.width;
        topTemp = position.top;
        leftTemp = position.left;
      } catch (ex) {}
    }
    if (minimized) {
      setResize('normal');
      setContentDisplay(true);
      effectiveHeight.current = height;
      setTop(topTemp || 0);
      setLeft(leftTemp || 0);
      setMinimized(false);
      setMinimizeIcon('▁');
      setMaximized(false);
    } else {
      setResize('minimized');
      setContentDisplay(false);
      effectiveHeight.current = 32;
      const element = document.getElementById(properties.id)?.parentElement;
      effectiveWidth.current = widthTemp;
      let topPosition = (element.parentElement?.clientHeight || window.innerHeight) - effectiveHeight.current - 4;

      let leftPosition = element.parentElement?.clientWidth - effectiveWidth.current - 4;

      const minimizedWindow = document.elementFromPoint(
        leftPosition + effectiveWidth.current / 2,
        topPosition + effectiveHeight.current / 2,
      ) as HTMLDivElement;
      if (minimizedWindow && ['archbase-window-container', 'windowTitle'].includes(minimizedWindow?.className || '')) {
        topPosition -= minimizedWindow?.clientHeight + 4;
      }
      setTop(topPosition);
      setLeft(leftPosition);
      setMinimized(true);
      setMinimizeIcon('◰');
      setMaximized(false);
    }
    setLevel(nextZIndex());
    setTimeout(setWindowTransition, animationDuration + 1, '');
  };

  useEffect(() => {
    if (resize === 'normal') {
      const currentPosition: ArchbaseWindowPosition = {
        top: (e.clientY || e.screenY) - yOffset,
        left: (e.clientX || e.screenX) - xOffset,
        width: effectiveWidth.current,
        height: effectiveHeight.current,
      };
      localStorage.setItem(ARCHBASE_WINDOW_POSITION, currentPosition);
    }
  }, [resize, ARCHBASE_WINDOW_POSITION]);

  const maximize = () => {
    setWindowTransition(`${animationDuration}ms ease-in-out`);
    const parent = document.getElementById(properties.id)?.parentElement;
    if (maximized) {
      const positionStr: string = localStorage.getItem(ARCHBASE_WINDOW_POSITION);
      let heightTemp = height;
      let widthTemp = width;
      let topTemp = parent?.offsetTop;
      let leftTemp = parent?.offsetLeft;
      if (positionStr) {
        try {
          const position: ArchbaseWindowPosition = JSON.parse(positionStr);
          heightTemp = position.height;
          widthTemp = position.width;
          topTemp = position.top;
          leftTemp = position.left;
        } catch (ex) {}
      }
      setResize('normal');
      setContentDisplay(true);
      effectiveHeight.current = heightTemp;
      effectiveWidth.current = widthTemp;
      setTop(topTemp || 0);
      setLeft(leftTemp || 0);
      setMaximized(false);
      setMaximizeIcon('□');
      setMinimized(false);
      setMinimizeIcon('▁');
    } else {
      setResize('maximized');
      setContentDisplay(true);
      effectiveHeight.current = parent?.clientHeight || window.innerHeight;
      effectiveWidth.current = parent?.clientWidth || window.innerWidth;
      setTop(parent?.offsetTop || 0);
      setLeft(parent?.offsetLeft || 0);
      setMaximized(true);
      setMaximizeIcon('❐');
      setMinimized(false);
      setMinimizeIcon('▁');
    }
    setLevel(nextZIndex());
    setTimeout(setWindowTransition, animationDuration + 1, '');
  };

  return (
    <div
      id={properties.id}
      className="archbase-window-container"
      style={{
        height: effectiveHeight.current,
        width: effectiveWidth.current,
        top,
        left,
        resize: properties.resizable ? 'both' : 'none',
        transition: windowTransition,
        zIndex: level,
        opacity: visibility,
      }}
      ref={container}
      onClick={() => {
        setLevel(nextZIndex());
      }}
    >
      {properties.titleBar && (
        <div
          className="title-bar"
          data-parent={properties.id}
          style={{
            opacity: visibility,
          }}
        >
          {properties.titleBar.icon && <span className="icon">{properties.titleBar.icon}</span>}
          <span
            className="windowTitle"
            draggable={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ opacity: Math.floor(visibility) }}
            ref={windowTitle}
          >
            {properties.titleBar.title}
          </span>
          {properties.titleBar.buttons && (
            <span className="buttonContainer">
              {properties.titleBar.buttons.minimize && (
                <span className="windowButton" onClick={minimize}>
                  {minimizeIcon}
                </span>
              )}
              {properties.titleBar.buttons.maximize && (
                <span className="windowButton" onClick={maximize}>
                  {maximizeIcon}
                </span>
              )}
              {!!properties.titleBar.buttons.close && (
                <span className="windowButton" onClick={properties.titleBar.buttons.close}>
                  &#10799;
                </span>
              )}
            </span>
          )}
        </div>
      )}
      <div
        className="content"
        draggable="false"
        style={{
          height: contentDisplay ? '100%' : 0,
          opacity: visibility,
          ...properties.style,
        }}
      >
        {properties.children}
      </div>
    </div>
  );
};
