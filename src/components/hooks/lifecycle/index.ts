// eslint-disable-next-line prettier/prettier
import type { DependencyList, EffectCallback, FC } from 'react'
import { memo, useEffect, useRef, useState } from 'react';
// #######################################################################
// ################################ Notes ################################
// #######################################################################

// Mounting:
//   – Birth of your component.
//   – Behavior before the component is added to the DOM.
// Update:
//   – Growth of your component.
//   – Behavior when the component re-render beacause any chhnage occurs.
// Unmount:
//   – Death of your component.
//   – Behavior right before the component is removed from the DOM.

// #######################################################################
// ################################ Types ################################
// #######################################################################

// eslint-disable-next-line no-undef
type Props = Record<string, unknown>;
type ShouldComponentUpdateHandler = (props: Props, nextProps: Props) => boolean;

// #######################################################################
// ################################ Code #################################
// #######################################################################

/**
 * Called immediately before mounting occurs ( before render the component).
 * Avoid introducing any side-effects or subscriptions in this method.
 * Please, see our docs dir for this hook. Be Careful.
 *
 * @param handler callback function only allowed to return void.
 */
function useArchbaseWillMount(handler: EffectCallback): void {
  const willMount = useRef<boolean>(true);
  if (willMount.current) handler();
  willMount.current = false;
}

/**
 * Called immediately after a component is mounted.
 * Setting state here will trigger re-rendering.
 *
 * @param handler callback function only allowed to return void.
 */
function useArchbaseDidMount(handler: EffectCallback): void {
  useEffect(handler);
}

/**
 * Called immediately after updating occurs.
 * Note : Called for the initial render.
 *
 * @param handler callback function only allowed to return void.
 */
function useArchbaseDidUpdate(handler: EffectCallback, deps?: DependencyList): void {
  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;

      return;
    }

    handler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Behave like shouldComponentUpdate but with different params.
 *
 * @param Component component want to inject with the shouldComponentUpdate lifecycle.
 * @param shouldComponentUpdateHandler comparator like the shouldComponentUpdate lifecycle.
 * @returns [PureComponent]
 */
function useShouldComponentUpdate(Component: FC, shouldComponentUpdateHandler?: ShouldComponentUpdateHandler) {
  return [memo(Component, shouldComponentUpdateHandler)];
}

/**
 * @alias useShouldComponentUpdate
 */
function usePureComponent(Component: FC, shouldComponentUpdateHandler?: ShouldComponentUpdateHandler) {
  return [memo(Component, shouldComponentUpdateHandler)];
}

/**
 * @alias useShouldComponentUpdate but with diffrent pattern (HOC)!
 */
function withShouldComponentUpdate(Component: FC) {
  return (shouldComponentUpdateHandler: ShouldComponentUpdateHandler) => memo(Component, shouldComponentUpdateHandler);
}

/**
 * Called immediately before a component is destroyed.
 * Perform any necessary cleanup in this method, such
 * as cancelled network requests, or cleaning up any
 * DOM elements created in `useArchbaseDidMount`.
 *
 * @param handler callback function only allowed to return void.
 */
function useArchbaseWillUnmount(handler: () => void): void {
  useEffect(() => () => handler(), []); // eslint-disable-line react-hooks/exhaustive-deps
}

function useArchbasePrevious(value) {
  // O objeto ref é um contêiner genérico cuja propriedade atual é mutável ...
  // ... e pode conter qualquer valor, semelhante a uma propriedade de instância em uma classe
  const ref = useRef();
  // Armazena o valor atual na ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Executa novamente apenas se o valor mudar
  // Retorna o valor anterior (acontece antes da atualização no useEffect acima)

  return ref.current;
}

const useArchbaseIsMounted = () => {
  const componentIsMounted = useRef(true);
  useEffect(() => {
    componentIsMounted.current = true;

    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return componentIsMounted.current;
};

const useArchbaseForceUpdate = () => {
  const [, rerender] = useState(0);

  return () => rerender((prev) => prev + 1);
};

// ########################################################################
// ################################ Export ################################
// ########################################################################

export {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbaseForceUpdate,
  useArchbaseIsMounted,
  useArchbasePrevious,
  useArchbaseWillMount,
  useArchbaseWillUnmount,
  usePureComponent,
  useShouldComponentUpdate,
  withShouldComponentUpdate,
};
