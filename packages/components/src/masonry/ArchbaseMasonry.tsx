import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_COLUMNS_COUNT = 1;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useEffect : useEffect;

const useHasMounted = () => {
	const [hasMounted, setHasMounted] = useState(false);
	useIsomorphicLayoutEffect(() => {
		setHasMounted(true);
	}, []);
	return hasMounted;
};

const useWindowWidth = () => {
	const hasMounted = useHasMounted();
	const [width, setWidth] = useState(0);

	const handleResize = useCallback(() => {
		if (!hasMounted) return;
		setWidth(window.innerWidth);
	}, [hasMounted]);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted) {
			window.addEventListener('resize', handleResize);
			handleResize();
			return () => window.removeEventListener('resize', handleResize);
		}
	}, [hasMounted, handleResize]);

	return width;
};

export interface ArchbaseMasonryCustomItemProps<T, _ID> {
	/** Chave */
	key: string;
	/** Id do item */
	id: any;
	/** Indicador se o Item está ativo */
	active: boolean;
	/** Indice dentro da lista */
	index: number;
	/** Registro contendo dados de uma linha na lista */
	recordData: T;
	/** Indicador se item da lista está desabilitado */
	disabled: boolean;
}

export interface ArchbaseMasonryProps {
	children: ReactNode | ReactNode[];
	columnsCount?: number;
	gutter?: string;
	className?: string | null;
	style?: React.CSSProperties;
}

export const ArchbaseMasonry: React.FC<ArchbaseMasonryProps> = ({
	children,
	columnsCount = 3,
	gutter = 'px',
	className = null,
	style = {},
}) => {
	const getColumns = (): ReactNode[][] => {
		const columns: ReactNode[][] = Array.from({ length: columnsCount }, () => []);
		React.Children.forEach(children, (child, index) => {
			if (React.isValidElement(child)) {
				columns[index % columnsCount].push(child);
			}
		});
		return columns;
	};

	const renderColumns = (): React.JSX.Element[] => {
		return getColumns().map((column, i) => (
			<div
				key={i}
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignContent: 'stretch',
					flex: 1,
					width: 0,
					gap: gutter,
				}}
			>
				{column.map((item, index) => (
					<React.Fragment key={index}>{item}</React.Fragment>
				))}
			</div>
		));
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignContent: 'stretch',
				boxSizing: 'border-box',
				width: '100%',
				gap: gutter,
				...style,
			}}
			className={className!}
		>
			{renderColumns()}
		</div>
	);
};

interface ArchbaseMasonryResponsiveProps {
	columnsCountBreakPoints?: Record<number, number>;
	children: React.ReactNode | React.ReactNode[];
	className?: string | null;
	style?: React.CSSProperties | null;
}

export const ArchbaseMasonryResponsive: React.FC<ArchbaseMasonryResponsiveProps> = ({
	columnsCountBreakPoints = {
		350: 1,
		750: 2,
		900: 3,
		1200: 4,
	},
	children,
	className = null,
	style = null,
}) => {
	const windowWidth = useWindowWidth();
	const columnsCount = useMemo(() => {
		const breakPoints = Object.keys(columnsCountBreakPoints).sort((a, b) => Number(a) - Number(b));
		let count = breakPoints.length > 0 ? columnsCountBreakPoints[breakPoints[0]] : DEFAULT_COLUMNS_COUNT;

		breakPoints.forEach((breakPoint) => {
			if (Number(breakPoint) < windowWidth) {
				count = columnsCountBreakPoints[breakPoint];
			}
		});

		return count;
	}, [windowWidth, columnsCountBreakPoints]);

	return (
		<ArchbaseMasonry className={className!} style={style!} columnsCount={columnsCount}>
			{children}
		</ArchbaseMasonry>
	);
};
