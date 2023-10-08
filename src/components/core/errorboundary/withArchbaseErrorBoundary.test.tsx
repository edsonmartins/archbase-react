/**
 * @jest-environment jsdom
 */

import React, { Component, createRef, PropsWithChildren } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { withArchbaseErrorBoundary } from "./withArchbaseErrorBoundary";

describe("withArchbaseErrorBoundary", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let shouldThrow = true;
  let valueToThrow: any;

  beforeEach(() => {
    // @ts-ignore
    global.IS_REACT_ACT_ENVIRONMENT = true;

    jest.spyOn(console, "error").mockImplementation(() => {});

    container = document.createElement("div");
    root = createRoot(container);
    shouldThrow = false;
    valueToThrow = new Error("💥💥💥");
  });

  function MaybeThrows({ children = "Children" }: PropsWithChildren) {
    if (shouldThrow) {
      throw valueToThrow;
    }
    return children as any;
  }

  function render() {
    const ErrorBoundary = withArchbaseErrorBoundary(MaybeThrows, {
      fallback: <div>Error</div>,
    });

    act(() => {
      root.render(<ErrorBoundary />);
    });
  }

  it("should render children within the created HOC", () => {
    render();
    expect(container.textContent).toBe("Children");
  });

  it("should catch errors with the created HOC", () => {
    shouldThrow = true;
    render();
    expect(container.textContent).toBe("Error");
  });

  it("should forward refs", () => {
    type Props = { foo: string };

    class Inner extends Component<Props> {
      test() {}
      render() {
        return this.props.foo;
      }
    }

    const Wrapped = withArchbaseErrorBoundary(Inner, {
      fallback: <div>Error</div>,
    });

    const ref = createRef<Inner>();

    act(() => {
      root.render(<Wrapped foo="abc" ref={ref} />);
    });

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.test).toBe("function");
  });
});
