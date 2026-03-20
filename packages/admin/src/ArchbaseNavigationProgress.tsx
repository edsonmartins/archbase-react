import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface NavigationProgressContextValue {
	start: () => void;
	done: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextValue>({
	start: () => {},
	done: () => {},
});

export const useNavigationProgress = () => useContext(NavigationProgressContext);

export function NavigationProgressProvider({ children }: { children: React.ReactNode }) {
	const [active, setActive] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const start = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setActive(true);
	}, []);

	const done = useCallback(() => {
		// Pequeno delay para a animação completar visualmente
		timerRef.current = setTimeout(() => {
			setActive(false);
		}, 300);
	}, []);

	return (
		<NavigationProgressContext.Provider value={{ start, done }}>
			<div className="archbase-nav-progress" data-active={active}>
				<div className="archbase-nav-progress-bar" />
			</div>
			{children}
		</NavigationProgressContext.Provider>
	);
}
