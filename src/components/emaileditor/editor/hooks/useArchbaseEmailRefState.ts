import { useRef } from 'react';

export function useArchbaseEmailRefState<T>(state: T) {
  const ref = useRef(state);

  ref.current = state;

  return ref;
}
