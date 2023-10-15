import { ArchbaseEmailFocusBlockLayoutContext } from '../components/Provider/FocusBlockLayoutProvider/index';
import { useContext } from 'react';

export function useArchbaseEmailFocusBlockLayout() {
  return useContext(ArchbaseEmailFocusBlockLayoutContext);
}
