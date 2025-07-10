import React, { ReactNode, useEffect, useRef } from 'react';

interface ArchbaseClickOutsideProps {
	children: ReactNode;
	exceptionRef?: any;
	onClick: (event: MouseEvent) => void;
	className?: string;
}

export function ArchbaseClickOutside({ children, exceptionRef, onClick, className }: ArchbaseClickOutsideProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickListener = (event: MouseEvent) => {
			let clickedInside: boolean;
			if (exceptionRef) {
				clickedInside =
					(wrapperRef.current && wrapperRef.current.contains(event.target as Node)) ||
					exceptionRef.current === event.target ||
					exceptionRef.current.contains(event.target as Node);
			} else {
				clickedInside = Boolean(wrapperRef.current && wrapperRef.current.contains(event.target as Node));
			}

			if (!clickedInside) {
				onClick(event);
			}
		};

		document.addEventListener('mousedown', handleClickListener);

		return () => {
			document.removeEventListener('mousedown', handleClickListener);
		};
	}, [onClick, exceptionRef]);

	return (
		<div ref={wrapperRef} className={`${className || ''}`}>
			{children}
		</div>
	);
}
