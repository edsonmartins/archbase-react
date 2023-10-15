import { useContext } from 'react';
import { ArchbaseEmailScrollContext } from '../components/Provider/ScrollProvider/index';

export function useArchbaseEmailDomScrollHeight() {
  return useContext(ArchbaseEmailScrollContext);
}
