import { useVariant } from '@unleash/proxy-client-react';
import { useState, useEffect } from 'react';
import type { UseVariantResult } from '../types';

export function useArchbaseVariant<T = any>(featureName: string): UseVariantResult<T> {
  const variant = useVariant(featureName);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [featureName]);

  return {
    variant: variant?.name && variant?.enabled ? {
      name: variant.name,
      enabled: variant.enabled,
      payload: variant.payload as { type: string; value: string },
    } : undefined,
    loading,
  };
}
