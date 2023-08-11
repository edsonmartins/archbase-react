import * as React from 'react';

export function useArchbaseStateWithCallback<T>(initialState : T, callback) {
  const [state, setState] = React.useState<T>(initialState);

  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current) {
      callback(state);
    } else {
      didMount.current = true;
    }
  }, [state, callback]);

  return [state, setState];
};
