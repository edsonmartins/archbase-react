import React, { ReactNode, useEffect, useState } from 'react'
import { Button, ActionIcon } from '@mantine/core'
import { IconPinned, IconPinnedOff } from '@tabler/icons-react'

export interface ArchbaseDockableContainerProps {
    children?: ReactNode;
    title: string;
    reducedTitle: string;
    containerWidth?: string;
    backgroundColor?: string;
    hiddenBackgroundColor?: string;
    withBorder?: boolean;
    hiddenWidth?: string;
    position?: 'left' | 'right';
    onShow?: () => void;
    onHide?: () => void;
    defaultIsDocked?: boolean;
    defaultIsVisible?: boolean;
  }
  
  export const ArchbaseDockableContainer = ({
    children,
    title,
    reducedTitle,
    containerWidth = '300px',
    backgroundColor = 'transparent',
    hiddenBackgroundColor = '#ccc',
    withBorder = false,
    hiddenWidth = '30px',
    position = 'right',
    onShow,
    onHide,
    defaultIsDocked = false,
    defaultIsVisible = false,
  }: ArchbaseDockableContainerProps) => {
    const [isDocked, setIsDocked] = useState(defaultIsDocked);
    const [isVisible, setIsVisible] = useState(defaultIsVisible);
  
    const toggleDock = () => setIsDocked(!isDocked);
    
    const showContainer = () => {
      if (!isDocked && !isVisible) {
        setIsVisible(true);
        if (onShow) {
            onShow();
        }
      }
    };
    
    const hideContainer = () => {
      if (!isDocked && isVisible) {
        setIsVisible(false);
        if (onHide) {
            onHide();
        }
      }
    };
  

    useEffect(() => {
      if (defaultIsVisible) {
        showContainer();
      } else {
        hideContainer();
      }
    }, [defaultIsVisible]); 
  
    const reducedTitleStyleRight = {
        writingMode: 'vertical-rl', 
        transform: 'rotate(360deg)', 
        margin: '10px 0', 
        alignSelf: 'flex-center', 
        cursor: 'pointer',
      };

      const reducedTitleStyleLeft = {
        writingMode: 'vertical-rl', 
        transform: 'rotate(180deg)', 
        margin: '10px 0', 
        alignSelf: 'flex-center', 
        cursor: 'pointer',
      };  
      

    const borderStyle = withBorder ? '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))' : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: position === 'left' ? 'row-reverse' : 'row'
      }}
    >
      <div
        onMouseOver={showContainer}
        style={{
          width: isVisible || isDocked ? '0px' : hiddenWidth,
          height: '100%',
          backgroundColor: hiddenBackgroundColor,
          cursor: 'pointer',
          border: borderStyle,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        {!isVisible && !isDocked && (
           // @ts-ignore
           <span style={position==='right'?reducedTitleStyleRight:reducedTitleStyleLeft}>{reducedTitle}</span>
        )}
      </div>
      <div
        onMouseLeave={hideContainer}
        style={{
          width: isVisible || isDocked ? containerWidth : '0px',
          height: '100%',
          overflow: 'hidden',
          transition: 'width 0.3s ease-in-out',
          backgroundColor: backgroundColor,
          padding: isVisible || isDocked ? '10px' : '0px',
          border: isVisible || isDocked ? borderStyle:0
        }}
      >
        {isVisible || isDocked ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <span>{title}</span>
              <ActionIcon onClick={toggleDock}>
                {isDocked ? <IconPinnedOff size={16} /> : <IconPinned size={16} />}
              </ActionIcon>
            </div>
            {children}
          </>
        ) : null}
      </div>
    </div>
  )
}
