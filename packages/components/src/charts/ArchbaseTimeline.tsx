// @ts-nocheck
/**
 * ArchbaseTimeline — timeline simples baseada em Mantine Timeline.
 * @status experimental
 */
import { px, ScrollArea, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { uniqueId } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

export interface ArchbaseTimelineItem {
	startTime: Date;
	endTime: Date;
	type: string;
}

export interface ArchbaseTimelineProps {
	data: any[];
	formatData: (value: any) => ArchbaseTimelineItem;
	height?: string | number;
	width?: string | number;
	scale?: number;
	decimalPlaces?: 0 | 1 | 2 | 3;
	startTime?: Date;
	endTime?: Date;
	tickRate?: number;
	itemHeight?: number;
	withGridline?: boolean;
	withOnHoverVerticalLine?: boolean;
	tickLabelAngle?: number;
	verticalLineColor?: string;
	verticalLineStrokeWidth?: number;
	verticalLineStrokeOpacity?: number;
}

export function ArchbaseTimeline({
	data,
	formatData,
	width,
	height,
	scale: customScale = 1,
	decimalPlaces = 2,
	startTime,
	endTime,
	tickRate = 1,
	itemHeight = 36,
	withGridline = false,
	withOnHoverVerticalLine = false,
	tickLabelAngle = 0,
	verticalLineColor = 'red',
	verticalLineStrokeWidth = 2,
	verticalLineStrokeOpacity = 1,
}: ArchbaseTimelineProps) {
	const { colorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();
	const [colorMap, setColorMap] = useState<Record<string, string>>({});
	const [typesQuantity, setTypesQuantity] = useState(0);
	const [yAxisLabelWidth, setYAxisLabelWidth] = useState(0);
	const [xAxisLabelHeight, setXAxisLabelHeight] = useState(0);
	const [minTime, setMinTime] = useState<Date>(new Date());
	const [maxTime, setMaxTime] = useState<Date>(new Date());
	const [id, setId] = useState('');
	const margin = { top: 20, right: 20, bottom: 30, left: 150 }; // Ajustado para melhor acomodação do texto
	const { ref: contentRef, width: contentWidth, height: contentHeight } = useElementSize();

	// Função para gerar uma cor hexadecimal aleatória
	function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	// Função para obter a cor para uma tarefa, gerando uma cor aleatória se necessário
	function getColorForType(typeName: string) {
		if (!colorMap[typeName]) {
			colorMap[typeName] = getRandomColor();
			setColorMap(colorMap);
		}
		return colorMap[typeName];
	}

	function getContentHeight() {
		return typesQuantity * itemHeight;
	}

	// Função para desenhar o gráfico de Gantt
	function drawTimeline(data: ArchbaseTimelineItem[]) {
		const svg = d3.select(`#timeline-chart-${id}`),
			width = +px(svg.attr('width')) - margin.left - margin.right,
			height = +px(svg.attr('height')) - margin.top - margin.bottom;

		// Limpa o SVG antes de desenhar
		svg.selectAll('*').remove();

		const minDate = d3.min(data, (d) => d.startTime) || new Date();
		const maxDate = d3.max(data, (d) => d.endTime) || new Date();
		const x = d3
			.scaleTime()
			.domain([
				new Date(minDate).setMilliseconds(0),
				new Date(Math.ceil(maxDate.getTime() / 1000) * 1000),
			])
			.range([0, width > 0 ? width : 0]);

		const y = d3
			.scaleBand()
			.rangeRound([0, height])
			.padding(0.1)
			.domain(data.map((d) => d.type));

		setTypesQuantity(y.domain().length);
		setMinTime(x.domain()[0]);
		setMaxTime(x.domain()[1]);

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		const tickQuantity = ((maxTime.getTime() - minTime.getTime()) / 1000) * tickRate;
		// Eixo X e Y
		g.append('g')
			.attr('class', 'axis axis--x')
			.call(d3.axisTop(x).tickFormat(formatXAxisTickLabel).ticks(tickQuantity))
			.selectAll('text')
			.attr('transform', function (d) {
				return `rotate(${tickLabelAngle})`;
			});

		if (withGridline) {
			addGridLine(g, x, height, tickQuantity);
		}

		g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y));

		// Barras do gráfico com tooltip
		g.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => x(d.startTime))
			.attr('y', (d) => y(d.type))
			.attr('width', (d) => x(d.endTime) - x(d.startTime))
			.attr('height', y.bandwidth())
			.style('fill', (d) => getColorForType(d.type))
			.style('z-index', 800)
			.on('mouseover', function (event, d) {
				d3.select(`#tooltip-${id}`)
					.style('visibility', 'visible')
					.html(`Item: ${d.type}<br>Início: ${formatTime(d.startTime)}<br>Fim: ${formatTime(d.endTime)}`);
			})
			.on('mousemove', function (event) {
				d3.select(`#tooltip-${id}`)
					.style('top', event.pageY < contentHeight / 2 ? event.pageY - 10 + 'px' : event.pageY - 150 + 'px')
					.style('left', event.pageX < contentWidth / 2 ? event.pageX + 10 + 'px' : event.pageX - 240 + 'px');
			})
			.on('mouseout', function () {
				d3.select(`#tooltip-${id}`).style('visibility', 'hidden');
			});

		// Fundo para o texto
		data.forEach((d) => {
			const text = `${((d.endTime.getTime() - d.startTime.getTime()) / 1000).toFixed(decimalPlaces)}s`;
			const textWidth = text.length * 6 + 10; // Estima a largura do texto + padding
			const textHeight = 20; // Altura padrão do retângulo de fundo
			const rectX = x(d.startTime) + (x(d.endTime) - x(d.startTime)) / 2 - textWidth / 2;
			const rectY = y(d.type) + y.bandwidth() / 2 - textHeight / 2; // Ajusta para centralizar verticalmente

			g.append('rect')
				.attr('x', rectX)
				.attr('y', rectY)
				.attr('width', textWidth)
				.attr('height', textHeight)
				.attr('fill', 'white')
				.attr('stroke', 'black')
				.attr('stroke-width', '0.5')
				.attr('rx', 5) // Para bordas arredondadas
				.attr('ry', 5);
		});

		// Texto sobre as barras
		g.selectAll('.text')
			.data(data)
			.enter()
			.append('text')
			.attr('x', (d) => x(d.startTime) + (x(d.endTime) - x(d.startTime)) / 2)
			.attr('y', (d) => y(d.type) + y.bandwidth() / 2) // Ajuste para alinhar dentro do retângulo
			.attr('dy', '.35em')
			.attr('text-anchor', 'middle')
			.text((d) => `${((d.endTime.getTime() - d.startTime.getTime()) / 1000).toFixed(decimalPlaces)}s`)
			.style('fill', '#000')
			.style('font-size', '12px'); // Certifique-se de que o tamanho da fonte se ajuste dentro do retângulo

		// Obtenha a caixa delimitadora (bounding box) da legenda do eixo X
		const xAxis = svg.select('.axis--x');
		const xAxisLabelBoundBox = (xAxis.node() as SVGGraphicsElement).getBBox();
		setXAxisLabelHeight(xAxisLabelBoundBox.height);

		// Obtenha a caixa delimitadora (bounding box) da legenda do eixo Y
		const yAxis = svg.select('.axis--y');
		const yAxisLabelBoundBox = (yAxis.node() as SVGGraphicsElement).getBBox();
		setYAxisLabelWidth(yAxisLabelBoundBox.width);

		if (withOnHoverVerticalLine) {
			addOnHoverVerticalLine(svg, g, height);
		}
	}

	const addGridLine = (
		g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
		x: d3.ScaleTime<number, number, never>,
		height: number,
		tickQuantity: number,
	) => {
		g.append('g')
			.attr('class', 'axis axis--x-grid')
			.call(
				d3
					.axisTop(x)
					.tickFormat(() => '')
					.ticks(tickQuantity)
					.tickSizeInner(-(height + margin.top)),
			);
	};

	const addOnHoverVerticalLine = (
		svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
		g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
		height: number,
	) => {
		const verticalLine = g
			.append('line')
			.attr('class', 'vertical-line')
			.attr('stroke', verticalLineColor)
			.attr('stroke-width', verticalLineStrokeWidth)
			.attr('stroke-opacity', verticalLineStrokeOpacity)
			.attr('y1', 0)
			.attr('y2', height + margin.top);

		svg.on('mousemove', function (event) {
			const mouseX = d3.pointer(event)[0];
			const resultMouseX = mouseX - yAxisLabelWidth - 10;
			verticalLine
				.attr('x1', resultMouseX > verticalLineStrokeWidth / 2 ? resultMouseX : verticalLineStrokeWidth / 2)
				.attr('x2', resultMouseX > verticalLineStrokeWidth / 2 ? resultMouseX : verticalLineStrokeWidth / 2)
				.style('display', 'block'); // Exibe a linha vertical
		});
	};

	const formatXAxisTickLabel = (date) => {
		let format;
		if (date.getSeconds() === 0 && date.getMilliseconds() === 0) {
			if (decimalPlaces === 3) {
				format = d3.timeFormat('%H:%M:%S');
				return format(date);
			}
			format = d3.timeFormat('%H:%M');
			return format(date);
		}
		if (date.getMilliseconds() === 0) {
			if (decimalPlaces === 3) {
				format = d3.timeFormat(':%M:%S');
				return format(date);
			}
			format = d3.timeFormat(':%S');
			return format(date);
		}
		format = d3.timeFormat('.%L');
		return format(date);
	};

	function formatTime(date) {
		const format = d3.timeFormat('%Y-%m-%d %H:%M:%S'); // Formato desejado para a data e hora
		return format(date);
	}

	useEffect(() => {
		if (!id) {
			setId(uniqueId('timeline'));
		}
	}, []);

	useEffect(() => {
		if (data.length > 0) {
			let finalData = data;
			if (formatData) {
				finalData = data.map((value) => formatData(value));
			} else {
				const dataItem = data[0] as ArchbaseTimelineItem;
				if (!dataItem.type && !dataItem.startTime && !dataItem.endTime) {
					return;
				}
			}
			if (startTime) {
				finalData = finalData.filter(
					(value) => dayjs(value.startTime).isAfter(startTime) || dayjs(value.startTime).isSame(startTime),
				);
			}
			if (endTime) {
				finalData = finalData.filter(
					(value) => dayjs(value.endTime).isBefore(endTime) || dayjs(value.endTime).isSame(endTime),
				);
			}
			drawTimeline(finalData);
		}
	}, [data, yAxisLabelWidth]);

	return (
		<ScrollArea ref={contentRef} w={width ? width : '100%'} h={height ? height : '100%'}>
			<svg
				id={`timeline-chart-${id}`}
				width={yAxisLabelWidth + ((maxTime.getTime() - minTime.getTime()) / 1000) * 10 ** decimalPlaces * customScale}
				height={xAxisLabelHeight + getContentHeight()}
			></svg>
			<div
				id={`tooltip-${id}`}
				style={{
					position: 'absolute',
					visibility: 'hidden',
					backgroundColor: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[4],
					color: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4],
					padding: '8px',
					borderRadius: '6px',
					fontSize: '14px',
				}}
			></div>
		</ScrollArea>
	);
}
