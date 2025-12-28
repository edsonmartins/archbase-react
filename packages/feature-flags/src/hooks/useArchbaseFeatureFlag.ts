import { useFlag } from '@unleash/proxy-client-react';
import { useState, useEffect } from 'react';
import type { UseFeatureFlagResult } from '../types';

export function useArchbaseFeatureFlag(featureName: string): UseFeatureFlagResult {
  const enabled = useFlag(featureName);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [featureName]);

  return { enabled, loading };
}
