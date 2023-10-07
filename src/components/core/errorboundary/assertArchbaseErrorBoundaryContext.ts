import { ArchbaseErrorBoundaryContextType } from "./ArchbaseErrorBoundaryContext";

export function assertArchbaseErrorBoundaryContext(
  value: any
): asserts value is ArchbaseErrorBoundaryContextType {
  if (
    value == null ||
    typeof value.didCatch !== "boolean" ||
    typeof value.resetErrorBoundary !== "function"
  ) {
    throw new Error("ArchbaseErrorBoundaryContext not found");
  }
}
