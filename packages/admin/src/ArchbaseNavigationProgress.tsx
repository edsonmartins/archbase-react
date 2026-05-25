import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface NavigationProgressContextValue {
	start: () => void;
	done: () => void;
	isNavigating: boolean;
}

const NavigationProgressContext = createContext<NavigationProgressContextValue>({
	start: () => {},
	done: () => {},
	isNavigating: false,
});

export const useNavigationProgress = () => useContext(NavigationProgressContext);

const MIN_VISIBLE_MS = 150;

export function NavigationProgressProvider({ children }: { children: React.ReactNode }) {
	const [active, setActive] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startTimeRef = useRef<number>(0);

	const start = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		startTimeRef.current = Date.now();
		setActive(true);
	}, []);

	const done = useCallback(() => {
		const elapsed = Date.now() - startTimeRef.current;
		const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
		timerRef.current = setTimeout(() => {
			setActive(false);
		}, remaining);
	}, []);

	return (
		<NavigationProgressContext.Provider value={{ start, done, isNavigating: active }}>
			<div className="archbase-nav-progress" data-active={active}>
				<div className="archbase-nav-progress-bar" />
			</div>
			{children}
		</NavigationProgressContext.Provider>
	);
}
