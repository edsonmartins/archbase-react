import React, { useRef, useState } from 'react'
import { ArchbaseFloatingWindow } from '@components/containers'
import { Accordion, Flex } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import useComponentSize from '@rehooks/component-size'

import { ArchbaseObjectInspector } from './ArchbaseObjectInspector'

export interface ArchbaseDebugInspectorProps {
  /** Título a ser exibido */
  title?: string
  /** Título a ser exibido*/
  icon?: string | HTMLImageElement
  /** Comando para abrir e fechar o Object Inspector */
  debugObjectInspectorHotKey?: string
  /** Lista de objetos a serem inspecionados */
  objectsToInspect?: ArchbaseObjectToInspect[]
  /** Indica se o Object Inspector será visível inicialmente ou não */
  visible?: boolean
  /** Altura inicial do Object Inspector */
  height?: number
  /** Largura inicial do Object Inspector */
  width?: number
}

export interface ArchbaseObjectToInspect {
  /**Nome do objeto a ser inspecionado*/
  name: string
  /**Objeto a ser inspecionado*/
  object: Object
}

export function ArchbaseDebugInspector({
  title,
  icon,
  debugObjectInspectorHotKey,
  objectsToInspect,
  visible = false,
  height = 400,
  width = 500,
}: ArchbaseDebugInspectorProps) {
  const [open, setOpen] = useState<boolean>(visible)
  useHotkeys([[debugObjectInspectorHotKey, () => setOpen(!open)]])
  const innerComponentRef = useRef<any>()
  const contentSize = useComponentSize(innerComponentRef)

  const display = open ? {} : { display: 'none' }

  return (
    <div style={display}>
      <ArchbaseFloatingWindow
        id="debug-rules"
        height={height}
        width={width}
        resizable={true}
        style={{ opacity: 1 }}
        titleBar={{
          icon,
          title,
          buttons: { minimize: true, maximize: true },
        }}
        innerRef={innerComponentRef}
      >
        <Flex h={contentSize.height}>
          <Accordion w="100%">
            {objectsToInspect.map((item, index) => (
              <Accordion.Item key={index} value={item.name}>
                <Accordion.Control>{item.name}</Accordion.Control>
                <Accordion.Panel>
                  <ArchbaseObjectInspector data={item.object} />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Flex>
      </ArchbaseFloatingWindow>
    </div>
  )
}
