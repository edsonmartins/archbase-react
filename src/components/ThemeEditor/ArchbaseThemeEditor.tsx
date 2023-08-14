import React, { ReactNode } from 'react';
import { ArchbaseDataSource } from '@components/datasource';
import { Accordion, Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBorderRadius, IconShadow, IconSpacingHorizontal, IconTypography } from '@tabler/icons-react';
import { IconColorPicker } from '@tabler/icons-react';
import { ArchbaseThemeDrawerTitle } from './ArchbaseThemeDrawerTitle';

export interface ArchbaseThemeEditorProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do edit */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Indicador se o edit está desabilitado */
  disabled?: boolean;
  /** Título do drawer */
  drawerLabel?: string;
  /** Título do button */
  buttonLabel?: ReactNode;
  /** Função para alternar entre os temas escuro e claro */
  toggleDarkMode: () => void;
}

export function ArchbaseThemeEditor<T, ID>({
  disabled,
  drawerLabel = 'Theme Editor',
  buttonLabel = 'Open Theme Editor',
  toggleDarkMode,
}: ArchbaseThemeEditorProps<T, ID>) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={<ArchbaseThemeDrawerTitle toggleDarkMode={toggleDarkMode} />}
      >
        <Accordion defaultValue="colors">
          <Accordion.Item value="colors">
            <Accordion.Control>
              <IconColorPicker />
              Colors
            </Accordion.Control>
            <Accordion.Panel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius consequat velit a viverra. Nunc
              varius ornare velit id pharetra. Nam maximus, nulla ut facilisis consequat, urna turpis tempor lacus, ut
              convallis mi nibh sit amet nunc. Phasellus ultricies euismod vestibulum. Phasellus vel magna non odio
              hendrerit volutpat. Suspendisse vehicula maximus sapien, non ultrices risus pulvinar id. Etiam ultricies
              ullamcorper erat.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="typography">
            <Accordion.Control>
              <IconTypography />
              Typography
            </Accordion.Control>
            <Accordion.Panel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius consequat velit a viverra. Nunc
              varius ornare velit id pharetra. Nam maximus, nulla ut facilisis consequat, urna turpis tempor lacus, ut
              convallis mi nibh sit amet nunc. Phasellus ultricies euismod vestibulum. Phasellus vel magna non odio
              hendrerit volutpat. Suspendisse vehicula maximus sapien, non ultrices risus pulvinar id. Etiam ultricies
              ullamcorper erat.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="shadows">
            <Accordion.Control>
              <IconShadow />
              Shadows
            </Accordion.Control>
            <Accordion.Panel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius consequat velit a viverra. Nunc
              varius ornare velit id pharetra. Nam maximus, nulla ut facilisis consequat, urna turpis tempor lacus, ut
              convallis mi nibh sit amet nunc. Phasellus ultricies euismod vestibulum. Phasellus vel magna non odio
              hendrerit volutpat. Suspendisse vehicula maximus sapien, non ultrices risus pulvinar id. Etiam ultricies
              ullamcorper erat.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="radii">
            <Accordion.Control>
              <IconBorderRadius />
              Radii
            </Accordion.Control>
            <Accordion.Panel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius consequat velit a viverra. Nunc
              varius ornare velit id pharetra. Nam maximus, nulla ut facilisis consequat, urna turpis tempor lacus, ut
              convallis mi nibh sit amet nunc. Phasellus ultricies euismod vestibulum. Phasellus vel magna non odio
              hendrerit volutpat. Suspendisse vehicula maximus sapien, non ultrices risus pulvinar id. Etiam ultricies
              ullamcorper erat.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="space">
            <Accordion.Control>
              <IconSpacingHorizontal />
              Space
            </Accordion.Control>
            <Accordion.Panel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius consequat velit a viverra. Nunc
              varius ornare velit id pharetra. Nam maximus, nulla ut facilisis consequat, urna turpis tempor lacus, ut
              convallis mi nibh sit amet nunc. Phasellus ultricies euismod vestibulum. Phasellus vel magna non odio
              hendrerit volutpat. Suspendisse vehicula maximus sapien, non ultrices risus pulvinar id. Etiam ultricies
              ullamcorper erat.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Drawer>

      <Button disabled={disabled} onClick={open}>
        {buttonLabel}
      </Button>
    </>
  );
}
