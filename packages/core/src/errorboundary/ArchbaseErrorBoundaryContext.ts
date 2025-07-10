import { createContext } from "react";

export type ArchbaseErrorBoundaryContextType = {
  didCatch: boolean;
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
};

export const ArchbaseErrorBoundaryContext =
  createContext<ArchbaseErrorBoundaryContextType | null>(null);
