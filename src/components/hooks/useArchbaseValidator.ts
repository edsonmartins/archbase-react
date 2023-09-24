import { useState } from 'react';
import { ArchbaseValidator } from '../validator/ArchbaseValidator';

export const useArchbaseValidator = () => {
  const [instance, setInstance] = useState<ArchbaseValidator>();

  if (!instance) {
    const newInstance = new ArchbaseValidator();
    setInstance(newInstance);

    return newInstance;
  }

  return instance;
};
