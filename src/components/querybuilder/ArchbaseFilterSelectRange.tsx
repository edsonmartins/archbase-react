import { Box, Button, ButtonVariant } from '@mantine/core';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Calendar, Value } from 'react-multi-date-picker';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface ArchbaseFilterSelectRangeProps {
	id?: string;
	key?: string;
	isOpen?: boolean;
	top?: string | number | undefined;
	left?: string | number | undefined;
	onCancelSelectRange?: () => void;
	onConfirmSelectRange?: (value: Value | undefined) => void;
	width?: string | undefined;
	selectRangeType?: 'day' | 'week' | 'month' | 'range';
	variant?: ButtonVariant | string;
}

interface ArchbaseFilterSelectRangeState {
	value?: Value;
}

class ArchbaseFilterSelectRange extends Component<ArchbaseFilterSelectRangeProps, ArchbaseFilterSelectRangeState> {
	private dateRef: any;
	constructor(props: ArchbaseFilterSelectRangeProps) {
		super(props);
		this.state = { value: undefined };
		this.dateRef = React.createRef();
	}

	UNSAFE_componentWillReceiveProps = (_nextProps: ArchbaseFilterSelectRangeProps) => {
		this.setState({ value: undefined });
	};

	handleDateChange = (value: Value) => {
		this.setState({ value });
	};

	render = () => {
		return (
			<Modal
				id={this.props.id}
				key={this.props.key}
				isOpen={this.props.isOpen}
				style={{
					overlay: {
						position: 'fixed',
						left: this.props.left,
						top: this.props.top,
						zIndex: 600,
						width: this.props.selectRangeType === 'month' ? '260px' : this.props.width,
						height: this.props.selectRangeType === 'month' ? '350px' : '320px',
						backgroundColor: 'rgba(255, 255, 255, 0.75)',
					},
					content: {
						inset: 0,
						padding: 0,
						position: 'absolute',
						border: 0,
						background: 'rgb(255, 255, 255)',
						borderRadius: '4px',
						outline: 'none',
					},
				}}
				centered={true}
			>
				<Calendar
					ref={this.dateRef}
					value={this.state.value}
					shadow={false}
					weekDays={weekDays}
					months={months}
					weekPicker={this.props.selectRangeType === 'week'}
					onlyMonthPicker={this.props.selectRangeType === 'month'}
					range={
						this.props.selectRangeType === 'week' ||
						this.props.selectRangeType === 'month' ||
						this.props.selectRangeType === 'range'
					}
					multiple={this.props.selectRangeType === 'day'}
					format={'DD/MM/YYYY'}
					numberOfMonths={2}
					onChange={this.handleDateChange}
					// VER AQUI DEPOIS style={{
					//   height: '100%',
					//   width: '100%',
					//   border: '1px solid silver',
					// }}
				/>
				<Box
					style={{
						display: 'flex',
						justifyContent: 'end',
						width: '100%',
						height: '40px',
						marginTop: '10px',
					}}
				>
					<Button variant={this.props.variant} onClick={() => this.props.onConfirmSelectRange!(this.state.value)}>
						Aplicar
					</Button>
					<Button variant={this.props.variant} color="red" onClick={this.props.onCancelSelectRange}>
						Cancela
					</Button>
				</Box>
			</Modal>
		);
	};
}

export { ArchbaseFilterSelectRange };
