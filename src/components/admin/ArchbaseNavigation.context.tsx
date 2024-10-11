import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';

interface ArchbaseNavigationState {
	userCloseLinkRequest: string;
	linkClosed: string;
	isClosing: boolean;
}

interface ArchbaseNavigationAction {
	type: 'USER_CLOSE_REQUEST' | 'CLOSE_ALLOWED' | 'DONE';
	link: string;
}

export interface ArchbaseNavigationContextValues {
	state: ArchbaseNavigationState;
	dispatch: (action: ArchbaseNavigationAction) => void;
}

export const ArchbaseNavigationContext = createContext<ArchbaseNavigationContextValues>({
	state: { userCloseLinkRequest: '', linkClosed: '', isClosing: false },
	dispatch: (action: ArchbaseNavigationAction) => {
		return null;
	},
});

interface ArchbaseNavigationProviderProps {
	children: ReactNode;
}

export const ArchbaseNavigationProvider = ({ children }: ArchbaseNavigationProviderProps) => {
	const initialState: ArchbaseNavigationState = {
		userCloseLinkRequest: '',
		linkClosed: '',
		isClosing: false,
	};

	const reducer = (state: ArchbaseNavigationState, action: ArchbaseNavigationAction) => {
		switch (action.type) {
		  case 'USER_CLOSE_REQUEST':
			return { ...state, userCloseLinkRequest: action.link, isClosing: true };
		  case 'CLOSE_ALLOWED':
			return { ...state, linkClosed: action.link, userCloseLinkRequest: '', isClosing: false };
		  case 'DONE':
			return { ...state, linkClosed: action.link, isClosing: false };
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
	isClosing: boolean;
  }
  
  export const useArchbaseNavigationListener = (id: string, onUserCloseRequest: () => void) => {
	const { state, dispatch } = useArchbaseNavigationContext();
  
	const closeAllowed = useCallback(() => {
	  dispatch({ type: 'CLOSE_ALLOWED', link: id });
	}, [dispatch, id]);
  
	useEffect(() => {
	  if (state && state.userCloseLinkRequest && state.userCloseLinkRequest === id) {
		onUserCloseRequest();
	  }
	}, [state, id, onUserCloseRequest]);
  
	const isClosing = state.isClosing && state.userCloseLinkRequest === id;
  
	return { closeAllowed, isClosing };
  };
