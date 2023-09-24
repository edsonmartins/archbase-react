import React, { ReactNode, createContext, useContext, useEffect, useReducer, useState } from 'react';

interface ArchbaseNavigationState {
  userCloseLinkRequest: string;
  linkClosed: string;
}

interface ArchbaseNavigationAction {
  type: 'USER_CLOSE_REQUEST' | 'CLOSE_ALLOWED';
  link: string;
}

export interface ArchbaseNavigationContextValues {
  state: ArchbaseNavigationState;
  dispatch: (action: ArchbaseNavigationAction) => void;
}

export const ArchbaseNavigationContext = createContext<ArchbaseNavigationContextValues>({
  state: { userCloseLinkRequest: '', linkClosed: '' },
  dispatch: (action: ArchbaseNavigationAction) => {},
});

export const ArchbaseNavigationProvider = ({ children }: any) => {
  const initialState: ArchbaseNavigationState = {
    userCloseLinkRequest: '',
    linkClosed: '',
  };

  const reducer = (state: ArchbaseNavigationState, action: ArchbaseNavigationAction) => {
    switch (action.type) {
      case 'USER_CLOSE_REQUEST':
        return { ...state, userCloseLinkRequest: action.link };
      case 'CLOSE_ALLOWED':
        return { ...state, linkClosed: action.link };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ArchbaseNavigationContext.Provider value={{ state, dispatch }}>{children}</ArchbaseNavigationContext.Provider>
  );
};

export const useArchbaseNavigationContext = () => {
  const context = useContext(ArchbaseNavigationContext);
  if (!context) {
    throw new Error('useArchbaseNavigationContext deve ser usado dentro de um ArchbaseNavigationProvider');
  }

  return context;
};

export interface ArchbaseNavigationListenerType {
  closeAllowed: () => void;
}

export const useArchbaseNavigationListener = (id: string, onUserCloseRequest: () => void) => {
  const { state, dispatch } = useArchbaseNavigationContext();
  useEffect(() => {
    if (state && state.userCloseLinkRequest && state.userCloseLinkRequest === id) {
      onUserCloseRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const closeAllowed = () => {
    dispatch({ type: 'CLOSE_ALLOWED', link: id });
  };
  const result: ArchbaseNavigationListenerType = { closeAllowed };

  return result;
};
