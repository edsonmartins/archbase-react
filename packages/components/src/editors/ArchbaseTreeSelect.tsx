import { Avatar, Button, Group, Input, MantineSize, Popover, Space, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useArchbaseTheme } from '@archbase/core'
import { ArchbaseTreeNode, ArchbaseTreeView, ArchbaseTreeViewProps } from '../list'
import { useArchbaseTranslation } from '@archbase/core';
import React, { ReactNode, forwardRef, useState } from 'react'

export interface ArchbaseTreeSelectProps extends ArchbaseTreeViewProps {
  icon?: ReactNode | undefined
  label?: string | undefined
  placeholder?: string | undefined;
  value?: string
  width: string
  widthTreeView?: string
  heightTreeView?: string
  renderComponent?: ReactNode | undefined
  allowNodeSelectType?: string[];
  onConfirm?: (node: ArchbaseTreeNode)=>void
  onCancel?: ()=>void
  disabled?: boolean
}

export const ArchbaseTreeSelect = forwardRef<HTMLButtonElement, ArchbaseTreeSelectProps>(
  ({ icon, label, value, width, widthTreeView, heightTreeView, allowNodeSelectType, disabled, onConfirm, onCancel, renderComponent, ...others }: ArchbaseTreeSelectProps, ref) => {
    const theme = useArchbaseTheme()
    // Usar tema padrão para simplificar migração Mantine 8
    const colorScheme: 'light' | 'dark' = 'light';
    const [focusedNode, setFocusedNode] = useState<ArchbaseTreeNode|undefined>();
    const [opened,setOpened] = useState<boolean>(false);
    const { t } = useArchbaseTranslation();

    const handleFocusedNode = (node: ArchbaseTreeNode) => {
      setFocusedNode(node);
    }

    const nodeSelectedIsValid = () =>{
      if ((!focusedNode) || (!allowNodeSelectType) || (!focusedNode.type)) {
        return false;
      }
      return allowNodeSelectType.includes(focusedNode.type)
    }

    return (
      <Popover opened={opened} width={widthTreeView||"target"} trapFocus position="bottom-start" withArrow shadow="md" withinPortal clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Input.Wrapper label={label}>
            <UnstyledButton
              ref={ref}
              disabled={disabled}
              onClick={()=>!disabled && setOpened(!opened)}
              style={{
                display: 'block',
                width,
                height: '36px',
                padding: '2px',
                color: theme.black,
                borderRadius:4,
                border: `1px solid ${theme!.colors.gray[4]}`,

                '&:hover': {
                  backgroundColor: theme.colors.gray[0]
                }
              }}
            >
              {renderComponent ? (
                renderComponent
              ) : (
                <Group>
                  {icon}
                  <div style={{ flex: 1 }}>
                    <Text truncate>
                      {value}
                    </Text>
                  </div>
                  {icon || <IconChevronRight size="1rem" />}
                </Group>
              )}
            </UnstyledButton>
          </Input.Wrapper>
        </Popover.Target>
        <Popover.Dropdown
          style={{
            background: theme.white,
            padding: 0,
            height: heightTreeView || '200px'
          }}
        >
          <ArchbaseTreeView
              {...others} 
              width={"100%"} 
              height={"calc(100% - 50px)"} 
              style={{marginLeft:0, marginBottom:0}}
              focusedNode={focusedNode}
              onFocusedNode={handleFocusedNode}
              selectChildrenOnParentSelect={false}
              singleSelect={true}/>
          <div style={{position:'absolute', bottom: 2, right:2, left:2, height:'50px', display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
              <Button
                disabled={!nodeSelectedIsValid()}
                onClick={()=>{
                  setOpened(false)
                  if (onConfirm) {
                    onConfirm(focusedNode!)
                  }
                }}
                color="green">
                  {`${t('archbase:Ok')}`}                
              </Button>
              <Space w={"md"}/>
              <Button 
                onClick={()=>{
                  setOpened(false)
                  if (onCancel) {
                    onCancel() 
                  }
                }}
                color="red">
                {`${t('archbase:Cancel')}`}
                </Button>
          </div>
        </Popover.Dropdown>
      </Popover>
    )
  }
)
