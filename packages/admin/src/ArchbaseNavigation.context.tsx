/**
 * ArchbaseNavigationProvider — contexto de navegação para o layout admin (menus/abas).
 * @status stable
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from 'react';

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
		switch (action.type) {
		  case 'USER_CLOSE_REQUEST':
			console.log(`[Navigation Reducer] USER_CLOSE_REQUEST link: ${action.link}`);
			return { ...state, userCloseLinkRequest: action.link, isClosing: true };
		  case 'CLOSE_ALLOWED':
			console.log(`[Navigation Reducer] CLOSE_ALLOWED link: ${action.link}`);
			return { ...state, linkClosed: action.link, userCloseLinkRequest: '', isClosing: false, payload: action.payload };
		  case 'DONE':
			console.log(`[Navigation Reducer] DONE link: ${action.link}`);
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

	// Timeout para fechar a tab automaticamente se ninguém responder (fallback)
	// Isso é necessário porque as views podem não estar usando useArchbaseNavigationListener
	React.useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;

		if (state.userCloseLinkRequest && !state.linkClosed) {
			console.log(`[NavigationProvider] Waiting for close response for: ${state.userCloseLinkRequest}`);
			// Se ninguém responder em 100ms, fecha automaticamente
			timeoutId = setTimeout(() => {
				console.log(`[NavigationProvider] No response received, auto-closing: ${state.userCloseLinkRequest}`);
				dispatch({ type: 'CLOSE_ALLOWED', link: state.userCloseLinkRequest });
			}, 100);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [state.userCloseLinkRequest, state.linkClosed, dispatch]);

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
	const { state, dispatch } = navigationContext;

	const closeAllowed = useCallback((payload?: any) => {
		console.log(`[useArchbaseNavigationListener] closeAllowed called for: ${id}`);
	  dispatch({ type: 'CLOSE_ALLOWED', link: id, payload });
	}, [dispatch, id]);

	// Usamos uma ref para garantir que o callback seja chamado mesmo se o estado mudar
	const onUserCloseRequestRef = useRef(onUserCloseRequest);
	onUserCloseRequestRef.current = onUserCloseRequest;

	useEffect(() => {
		console.log(`[useArchbaseNavigationListener] Effect check - userCloseLinkRequest: ${state?.userCloseLinkRequest}, id: ${id}`);
	  if (state && state.userCloseLinkRequest && state.userCloseLinkRequest === id) {
		console.log(`[useArchbaseNavigationListener] Calling onUserCloseRequest for: ${id}`);
		onUserCloseRequestRef.current();
	  }
	}, [state, id]);

	const isClosing = state.isClosing && state.userCloseLinkRequest === id;

	return { closeAllowed, isClosing };
  };
