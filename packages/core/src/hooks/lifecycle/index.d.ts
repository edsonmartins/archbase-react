import type { DependencyList, EffectCallback, FC } from 'react';
type Props = Record<string, unknown>;
type ShouldComponentUpdateHandler = (props: Props, nextProps: Props) => boolean;
/**
 * Called immediately before mounting occurs ( before render the component).
 * Avoid introducing any side-effects or subscriptions in this method.
 * Please, see our docs dir for this hook. Be Careful.
 *
 * @param handler callback function only allowed to return void.
 */
declare function useArchbaseWillMount(handler: EffectCallback): void;
/**
 * Called immediately after a component is mounted.
 * Setting state here will trigger re-rendering.
 *
 * @param handler callback function only allowed to return void.
 */
declare function useArchbaseDidMount(handler: EffectCallback): void;
/**
 * Called immediately after updating occurs.
 * Note : Called for the initial render.
 *
 * @param handler callback function only allowed to return void.
 */
declare function useArchbaseDidUpdate(handler: EffectCallback, deps?: DependencyList): void;
/**
 * Behave like shouldComponentUpdate but with different params.
 *
 * @param Component component want to inject with the shouldComponentUpdate lifecycle.
 * @param shouldComponentUpdateHandler comparator like the shouldComponentUpdate lifecycle.
 * @returns [PureComponent]
 */
declare function useShouldComponentUpdate(Component: FC, shouldComponentUpdateHandler?: ShouldComponentUpdateHandler): import("react").NamedExoticComponent<{}>[];
/**
 * @alias useShouldComponentUpdate
 */
declare function usePureComponent(Component: FC, shouldComponentUpdateHandler?: ShouldComponentUpdateHandler): import("react").NamedExoticComponent<{}>[];
/**
 * @alias useShouldComponentUpdate but with diffrent pattern (HOC)!
 */
declare function withShouldComponentUpdate(Component: FC): (shouldComponentUpdateHandler: ShouldComponentUpdateHandler) => import("react").NamedExoticComponent<{}>;
/**
 * Called immediately before a component is destroyed.
 * Perform any necessary cleanup in this method, such
 * as cancelled network requests, or cleaning up any
 * DOM elements created in `useArchbaseDidMount`.
 *
 * @param handler callback function only allowed to return void.
 */
declare function useArchbaseWillUnmount(handler: () => void): void;
declare function useArchbasePrevious(value: any): any;
declare const useArchbaseIsMounted: () => boolean;
declare const useArchbaseForceUpdate: () => () => void;
export { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseForceUpdate, useArchbaseIsMounted, useArchbasePrevious, useArchbaseWillMount, useArchbaseWillUnmount, usePureComponent, useShouldComponentUpdate, withShouldComponentUpdate };
//# sourceMappingURL=index.d.ts.map