import {
  createElement,
  forwardRef,
  ForwardedRef,
  RefAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ComponentType,
} from "react";
import { ArchbaseErrorBoundary } from "./ArchbaseErrorBoundary";
import { ArchbaseErrorBoundaryProps } from "./types";

export function withArchbaseErrorBoundary<Props extends Object>(
  component: ComponentType<Props>,
  errorBoundaryProps: ArchbaseErrorBoundaryProps
): ForwardRefExoticComponent<PropsWithoutRef<Props> & RefAttributes<any>> {
  const Wrapped = forwardRef<ComponentType<Props>, Props>(
    (props: Props, ref: ForwardedRef<ComponentType<Props>>) =>
      createElement(
        ArchbaseErrorBoundary,
        errorBoundaryProps,
        createElement(component, { ...props, ref })
      )
  );
  
  const name = component.displayName || component.name || "Unknown";
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}
