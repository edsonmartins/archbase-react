import { Stack } from '@emaileditor/editor/components/UI/Stack';
import React from 'react';
import { useArchbaseEmailBlock } from '@emaileditor/editor/hooks/useArchbaseEmailBlock';
import { ArchbaseEmailIconFont } from '@emaileditor/editor/components/IconFont';
import { Button } from '@emaileditor/editor/components/UI/Button';
import { t } from 'i18next'

export function ToolsPanel() {
  const { redo, undo, redoable, undoable } = useArchbaseEmailBlock();

  return (
    <Stack>
      <Button title={t('archbase:undo')} disabled={!undoable} onClick={undo}>
        <ArchbaseEmailIconFont
          iconName='icon-undo'
          style={{
            cursor: 'inherit',
            opacity: undoable ? 1 : 0.75,
          }}
        />
      </Button>

      <Button title={t('archbase:redo')} disabled={!redoable} onClick={redo}>
        <ArchbaseEmailIconFont
          iconName='icon-redo'
          style={{
            cursor: 'inherit',
            opacity: redoable ? 1 : 0.75,
          }}
        />
      </Button>
      <Stack.Item />
    </Stack>
  );
}
