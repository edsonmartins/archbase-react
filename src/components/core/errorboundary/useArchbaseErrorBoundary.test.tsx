/**
 * @jest-environment jsdom
 */
import React, { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ArchbaseErrorBoundary } from './ArchbaseErrorBoundary';
import { useArchbaseErrorBoundary, UseArchbaseErrorBoundaryApi } from './useArchbaseErrorBoundary';

describe('useArchbaseErrorBoundary', () => {
	let container: HTMLDivElement;
	let lastRenderedUseErrorBoundaryApi: UseArchbaseErrorBoundaryApi<Error> | null = null;

	beforeEach(() => {
		// @ts-ignore
		global.IS_REACT_ACT_ENVIRONMENT = true;
		jest.spyOn(console, 'error').mockImplementation(() => {});
		container = document.createElement('div');
		lastRenderedUseErrorBoundaryApi = null;
	});

	function render() {
		function Child() {
			lastRenderedUseErrorBoundaryApi = useArchbaseErrorBoundary<Error>();

			return <div>Child</div>;
		}

		const root = createRoot(container);
		act(() => {
			root.render(
				<ArchbaseErrorBoundary fallback={<div>Error</div>}>
					<Child />
				</ArchbaseErrorBoundary>,
			);
		});
	}

	it('should activate an error boundary', () => {
		render();
		expect(container.textContent).toBe('Child');

		act(() => {
			lastRenderedUseErrorBoundaryApi?.showBoundary(new Error('Example'));
		});
		expect(container.textContent).toBe('Error');
	});

	it('should reset an active error boundary', () => {
		render();

		act(() => {
			lastRenderedUseErrorBoundaryApi?.showBoundary(new Error('Example'));
		});
		expect(container.textContent).toBe('Error');

		act(() => {
			lastRenderedUseErrorBoundaryApi?.resetBoundary();
		});
		expect(container.textContent).toBe('Child');
	});

	it('should work within a fallback component', () => {
		let resetBoundary: UseArchbaseErrorBoundaryApi<Error>['resetBoundary'] | null = null;
		let showBoundary: UseArchbaseErrorBoundaryApi<Error>['showBoundary'] | null = null;

		function FallbackComponent() {
			resetBoundary = useArchbaseErrorBoundary<Error>().resetBoundary;
			return <div>Error</div>;
		}

		function Child() {
			showBoundary = useArchbaseErrorBoundary<Error>().showBoundary;
			return <div>Child</div>;
		}

		const root = createRoot(container);
		act(() => {
			root.render(
				<ArchbaseErrorBoundary FallbackComponent={FallbackComponent}>
					<Child />
				</ArchbaseErrorBoundary>,
			);
		});
		expect(container.textContent).toBe('Child');

		act(() => {
			showBoundary!(new Error('Example'));
		});
		expect(container.textContent).toBe('Error');

		act(() => {
			resetBoundary!();
		});
		expect(container.textContent).toBe('Child');
	});
});
