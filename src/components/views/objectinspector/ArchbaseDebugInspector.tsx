import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArchbaseFloatingWindow } from '@components/containers';
import { Accordion, Flex } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useArchbaseSize } from '@hooks/useArchbaseSize';
import { ArchbaseObjectInspector } from './ArchbaseObjectInspector';

export interface ArchbaseDebugInspectorProps {
  /** Título a ser exibido */
  title?: string;
  /** Título a ser exibido*/
  icon?: string | HTMLImageElement;
  /** Comando para abrir e fechar o Object Inspector */
  debugObjectInspectorHotKey?: string;
  /** Lista de objetos a serem inspecionados */
  objectsToInspect?: ArchbaseObjectToInspect[];
  /** Variável para controle de visibilidade do Object Inspector externamente */
  visible?: boolean;
  /** Indica se o Object Inspector será visível inicialmente ou não */
  defaultVisible?: boolean;
  /** Altura inicial do Object Inspector */
  height?: number;
  /** Largura inicial do Object Inspector */
  width?: number;
  /** Evento ocorre quando a visibilidade do Debug Inspector é alterada */
  onDebugInspectorChange?: () => void;
}

export interface ArchbaseObjectToInspect {
  /**Nome do objeto a ser inspecionado*/
  name: string;
  /**Objeto a ser inspecionado*/
  object: Object;
}

export function ArchbaseDebugInspector({
  title,
  icon,
  debugObjectInspectorHotKey,
  objectsToInspect: controlledObjectsToInspect,
  visible: controlledOpen,
  height = 400,
  width = 500,
  onDebugInspectorChange,
  defaultVisible = false,
}: ArchbaseDebugInspectorProps) {
  const [open, setOpen] = useState<boolean>(defaultVisible);
  const [objectsToInspect, setobjectsToInspect] = useState([]);
  useHotkeys([
    [
      debugObjectInspectorHotKey,
      () => {
        if (controlledOpen === undefined) {
          setOpen(!open);
        }

        if (onDebugInspectorChange) {
          onDebugInspectorChange();
        }
      },
    ],
  ]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (controlledObjectsToInspect !== undefined) {
      setobjectsToInspect(controlledObjectsToInspect);
    }
  }, [controlledObjectsToInspect]);

  return (
    open && (
      <ArchbaseFloatingWindow
        id="debug-rules"
        height={height}
        width={width}
        resizable={true}
        style={{ opacity: 1 }}
        titleBar={{
          icon: icon,
          title: title,
          buttons: { minimize: true, maximize: true },
        }}
      >
        <Accordion w={'100%'}>
          {objectsToInspect.length > 0
            ? objectsToInspect.map((item, index) => (
                <Accordion.Item key={index} value={item.name}>
                  <Accordion.Control>{item.name}</Accordion.Control>
                  <Accordion.Panel>
                    <ArchbaseObjectInspector data={item.object} />
                  </Accordion.Panel>
                </Accordion.Item>
              ))
            : undefined}
        </Accordion>
      </ArchbaseFloatingWindow>
    )
  );
}
