import { ArchbaseEmailBlocksContext } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useContext } from 'react';

export function useArchbaseEmailActiveTab() {
  const { activeTab, setActiveTab } = useContext(ArchbaseEmailBlocksContext);
  return {
    activeTab,
    setActiveTab,
  };
}
