import { BlocksContext } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useContext } from 'react';

export function useActiveTab() {
  const { activeTab, setActiveTab } = useContext(BlocksContext);
  return {
    activeTab,
    setActiveTab,
  };
}
