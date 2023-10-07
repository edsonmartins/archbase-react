import { useContext, useMemo, useState } from "react";
import { assertArchbaseErrorBoundaryContext } from "./assertArchbaseErrorBoundaryContext";
import { ArchbaseErrorBoundaryContext } from "./ArchbaseErrorBoundaryContext";

type UseArchbaseErrorBoundaryState<TError> =
  | { error: TError; hasError: true }
  | { error: null; hasError: false };

export type UseArchbaseErrorBoundaryApi<TError> = {
  resetBoundary: () => void;
  showBoundary: (error: TError) => void;
};

export function useArchbaseErrorBoundary<TError = any>(): UseArchbaseErrorBoundaryApi<TError> {
  const context = useContext(ArchbaseErrorBoundaryContext);

  assertArchbaseErrorBoundaryContext(context);

  const [state, setState] = useState<UseArchbaseErrorBoundaryState<TError>>({
    error: null,
    hasError: false,
  });

  const memoized = useMemo(
    () => ({
      resetBoundary: () => {
        context.resetErrorBoundary();
        setState({ error: null, hasError: false });
      },
      showBoundary: (error: TError) =>
        setState({
          error,
          hasError: true,
        }),
    }),
    [context.resetErrorBoundary]
  );

  if (state.hasError) {
    throw state.error;
  }

  return memoized;
}
