import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';

interface ArchbaseNavigationState {
	userCloseLinkRequest: string;
	linkClosed: string;
	isClosing: boolean;
	payload?: any;
}

interface ArchbaseNavigationAction {
	type: 'USER_CLOSE_REQUEST' | 'CLOSE_ALLOWED' | 'DONE' | 'CLEAR_PAYLOAD';
	link: string;
	payload?: any;
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
		console.log('[Navigation Reducer]', action.type, 'link:', action.link);
		switch (action.type) {
		  case 'USER_CLOSE_REQUEST':
			console.log('[Navigation] USER_CLOSE_REQUEST for:', action.link);
			return { ...state, userCloseLinkRequest: action.link, isClosing: true };
		  case 'CLOSE_ALLOWED':
			console.log('[Navigation] CLOSE_ALLOWED for:', action.link, 'payload:', action.payload);
			return { ...state, linkClosed: action.link, userCloseLinkRequest: '', isClosing: false, payload: action.payload };
		  case 'DONE':
			console.log('[Navigation] DONE for:', action.link);
			return { ...state, linkClosed: action.link, isClosing: false };
		  case 'CLEAR_PAYLOAD':
			const newState = {...state};
			delete newState.payload
			return newState;
		  default:
			return state;
		}
	  };

	const [state, dispatch] = useReducer(reducer, initialState);

	console.log('[ArchbaseNavigationProvider] Provider rendering with state:', state, 'dispatch:', dispatch);

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
	closeAllowed: (payload?: any) => void;
	isClosing: boolean;
  }
  
  export const useArchbaseNavigationListener = (id: string, onUserCloseRequest: () => void) => {
	const navigationContext = useArchbaseNavigationContext();
	console.log('[useArchbaseNavigationListener] Full context for id:', id, 'context:', navigationContext);
	const { state, dispatch } = navigationContext;
	console.log('[useArchbaseNavigationListener] Context for id:', id, 'state:', state, 'dispatch:', dispatch);
  
	const closeAllowed = useCallback((payload?: any) => {
	  console.log('[useArchbaseNavigationListener] closeAllowed called for:', id, 'payload:', payload);
	  dispatch({ type: 'CLOSE_ALLOWED', link: id, payload });
	}, [dispatch, id]);
  
	useEffect(() => {
	  console.log('[useArchbaseNavigationListener] Effect check - userCloseLinkRequest:', state?.userCloseLinkRequest, 'id:', id);
	  if (state && state.userCloseLinkRequest && state.userCloseLinkRequest === id) {
		console.log('[useArchbaseNavigationListener] Calling onUserCloseRequest for:', id);
		onUserCloseRequest();
	  }
	}, [state, id, onUserCloseRequest]);
  
	const isClosing = state.isClosing && state.userCloseLinkRequest === id;
  
	return { closeAllowed, isClosing };
  };
