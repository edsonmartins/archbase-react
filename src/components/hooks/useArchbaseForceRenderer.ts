import * as React from 'react';

export const useArchbaseForceRerender = (): (() => void) => {
  const [, setState] = React.useState({});

  return React.useCallback(() => void setState({}), []);
};
