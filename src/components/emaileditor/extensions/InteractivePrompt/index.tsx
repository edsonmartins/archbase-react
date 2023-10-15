import { ActiveTabKeys, useActiveTab } from '@emaileditor/editor/index';
import React from 'react';
import { FocusTooltip } from './components/FocusTooltip';
import { HoverTooltip } from './components/HoverTooltip';

export function InteractivePrompt() {
  const { activeTab } = useActiveTab();
  const isActive = activeTab === ActiveTabKeys.EDIT;

  if (!isActive) return null;

  return (
    <>
      <HoverTooltip />
      <FocusTooltip />

    </>
  );
}
