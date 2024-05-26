import React, { Component, createElement, ErrorInfo, isValidElement } from 'react';
import { ArchbaseErrorBoundaryContext } from './ArchbaseErrorBoundaryContext';
import { ArchbaseErrorBoundaryProps, FallbackProps } from './types';

type ArchbaseErrorBoundaryState =
	| {
			didCatch: true;
			error: any;
	  }
	| {
			didCatch: false;
			error: null;
	  };

const initialState: ArchbaseErrorBoundaryState = {
	didCatch: false,
	error: null,
};

export class ArchbaseErrorBoundary extends Component<ArchbaseErrorBoundaryProps, ArchbaseErrorBoundaryState> {
	constructor(props: ArchbaseErrorBoundaryProps) {
		super(props);

		this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
		this.state = initialState;
	}

	static getDerivedStateFromError(error: Error) {
		return { didCatch: true, error };
	}

	resetErrorBoundary(...args: any[]) {
		const { error } = this.state;

		if (error !== null) {
			this.props.onReset?.({
				args,
				reason: 'imperative-api',
			});

			this.setState(initialState);
		}
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		this.props.onError?.(error, info);
	}

	componentDidUpdate(prevProps: ArchbaseErrorBoundaryProps, prevState: ArchbaseErrorBoundaryState) {
		const { didCatch } = this.state;
		const { resetKeys } = this.props;

		// Há um caso extremo em que se a coisa que desencadeou o erro *também* estiver no array resetKeys,
		// acabaríamos redefinindo o limite do erro imediatamente.
		// Isso provavelmente acionaria um segundo erro.
		// Portanto, garantimos que não verificamos as resetKeys na primeira chamada do cDU após o erro ser definido.
		if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
			this.props.onReset?.({
				next: resetKeys,
				prev: prevProps.resetKeys,
				reason: 'keys',
			});

			this.setState(initialState);
		}
	}

	render() {
		const { children, fallbackRender, FallbackComponent, fallback, othersProps } = this.props;
		const { didCatch, error } = this.state;

		let childToRender = children;

		if (didCatch) {
			const props: FallbackProps = {
				error,
				resetErrorBoundary: this.resetErrorBoundary,
				othersProps,
			};

			if (typeof fallbackRender === 'function') {
				childToRender = fallbackRender(props);
			} else if (FallbackComponent) {
				childToRender = createElement(FallbackComponent, props);
			} else if (fallback === null || isValidElement(fallback)) {
				childToRender = fallback;
			} else {
				console.error('ArchaseErrorBoundary requer um fallback, fallbackRender, ou FallbackComponent');

				throw error;
			}
		}

		return createElement(
			ArchbaseErrorBoundaryContext.Provider,
			{
				value: {
					didCatch,
					error,
					resetErrorBoundary: this.resetErrorBoundary,
				},
			},
			childToRender,
		);
	}
}

function hasArrayChanged(a: any[] = [], b: any[] = []): boolean {
	return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}
