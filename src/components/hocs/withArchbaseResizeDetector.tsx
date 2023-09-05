import React, { Component, createRef, forwardRef, ComponentType, ForwardedRef, MutableRefObject } from 'react';

import ArchbaseResizeDetector from '@hooks/resize/ArchbaseResizeDetector';
import { ArchbaseResizeDetectorProps } from '@hooks/resize/types';

export function withArchbaseResizeDetector<P, ElementT extends HTMLElement = HTMLElement>(
  ComponentInner: ComponentType<P>,
  options: ArchbaseResizeDetectorProps<ElementT> = {},
) {
  class ResizeDetectorHOC extends Component<
    PropsWithoutResizeDetectorDimensions<P> & { forwardedRef: ForwardedRef<HTMLElement> }
  > {
    ref = createRef<HTMLElement>();

    render() {
      const { forwardedRef, ...rest } = this.props;
      const targetRef = forwardedRef ?? this.ref;

      return (
        <ArchbaseResizeDetector {...options} targetRef={targetRef as MutableRefObject<HTMLElement>}>
          <ComponentInner targetRef={targetRef} {...(rest as unknown as P)} />
        </ArchbaseResizeDetector>
      );
    }
  }

  function forwardRefWrapper(props: PropsWithoutResizeDetectorDimensions<P>, ref: ForwardedRef<HTMLElement>) {
    return <ResizeDetectorHOC {...props} forwardedRef={ref} />;
  }

  const name = ComponentInner.displayName || ComponentInner.name;
  forwardRefWrapper.displayName = `withResizeDetector(${name})`;

  return forwardRef(forwardRefWrapper);
}

// Just Pick would be sufficient for this, but I'm trying to avoid unnecessary mapping over union types
// https://github.com/Microsoft/TypeScript/issues/28339
type PropsWithoutResizeDetectorDimensions<P> = Without<Without<OptionalKey<P, 'targetRef'>, 'width'>, 'height'>;
type Without<T, Key> = Key extends keyof T ? Omit<T, Key> : T;
type OptionalKey<T, Key> = Key extends keyof T ? Omit<T, Key> & { [K in Key]?: T[K] } : T;
