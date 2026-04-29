import type { MantineDemo } from '@mantinex/demo';

// =============================================
// ArchbaseContextMenu
// =============================================
import { ArchbaseContextMenuUsage } from './ArchbaseContextMenuUsage';

const contextMenuUsageCode = `
import { ArchbaseContextMenu } from '@archbase/components';
import { Card, Text } from '@mantine/core';
import { IconCopy, IconCut, IconClipboard, IconTrash } from '@tabler/icons-react';

function Demo() {
  return (
    <ArchbaseContextMenu
      items={[
        { label: 'Copiar', icon: <IconCopy size={16} />, onClick: () => {} },
        { label: 'Cortar', icon: <IconCut size={16} />, onClick: () => {} },
        { label: 'Colar', icon: <IconClipboard size={16} />, onClick: () => {} },
        { type: 'divider' },
        { label: 'Excluir', icon: <IconTrash size={16} />, color: 'red', onClick: () => {} },
      ]}
    >
      <Card withBorder p="xl" style={{ cursor: 'context-menu' }}>
        <Text>Clique com botão direito</Text>
      </Card>
    </ArchbaseContextMenu>
  );
}
`;

export const contextMenuUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseContextMenuUsage,
  code: contextMenuUsageCode,
};

// =============================================
// ArchbaseActionSheet
// =============================================
import { ArchbaseActionSheetUsage } from './ArchbaseActionSheetUsage';

const actionSheetUsageCode = `
import { useState } from 'react';
import { ArchbaseActionSheet } from '@archbase/components';
import { Button } from '@mantine/core';
import { IconShare, IconDownload, IconBookmark } from '@tabler/icons-react';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Abrir ActionSheet</Button>

      <ArchbaseActionSheet
        opened={opened}
        onClose={() => setOpened(false)}
        title="Compartilhar"
        description="Escolha como deseja compartilhar"
        actions={[
          { label: 'Compartilhar', icon: <IconShare size={20} />, onClick: () => {} },
          { label: 'Download', icon: <IconDownload size={20} />, onClick: () => {} },
          { label: 'Favoritos', icon: <IconBookmark size={20} />, onClick: () => {} },
        ]}
        showCancel
      />
    </>
  );
}
`;

export const actionSheetUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseActionSheetUsage,
  code: actionSheetUsageCode,
};

// =============================================
// ArchbaseBottomNavigation
// =============================================
import { ArchbaseBottomNavigationUsage } from './ArchbaseBottomNavigationUsage';

const bottomNavigationUsageCode = `
import { useState } from 'react';
import { ArchbaseBottomNavigation } from '@archbase/components';
import { IconHome, IconSearch, IconBell, IconUser } from '@tabler/icons-react';

function Demo() {
  const [active, setActive] = useState('home');

  return (
    <ArchbaseBottomNavigation
      value={active}
      onChange={setActive}
      items={[
        { value: 'home', label: 'Início', icon: <IconHome size={20} /> },
        { value: 'search', label: 'Buscar', icon: <IconSearch size={20} /> },
        { value: 'notifications', label: 'Avisos', icon: <IconBell size={20} />, badge: 3 },
        { value: 'profile', label: 'Perfil', icon: <IconUser size={20} /> },
      ]}
    />
  );
}
`;

export const bottomNavigationUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseBottomNavigationUsage,
  code: bottomNavigationUsageCode,
};

// =============================================
// ArchbaseAppBar
// =============================================
import { ArchbaseAppBarUsage } from './ArchbaseAppBarUsage';

const appBarUsageCode = `
import { useState } from 'react';
import { ArchbaseAppBar } from '@archbase/components';
import { IconBell, IconSearch, IconUser } from '@tabler/icons-react';

function Demo() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <ArchbaseAppBar
      title="Meu Aplicativo"
      logoSrc="/logo.png"
      onBurgerClick={() => setMenuOpened(!menuOpened)}
      burgerOpened={menuOpened}
      actions={[
        { icon: <IconSearch size={20} />, onClick: () => {}, tooltip: 'Buscar' },
        { icon: <IconBell size={20} />, onClick: () => {}, badge: 5, tooltip: 'Notificações' },
        { icon: <IconUser size={20} />, onClick: () => {}, tooltip: 'Perfil' },
      ]}
    />
  );
}
`;

export const appBarUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseAppBarUsage,
  code: appBarUsageCode,
};
