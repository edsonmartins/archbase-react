/**
 * ArchbaseBarcodeScanner — scanner de codigos de barras e QR codes usando a API nativa BarcodeDetector
 * com fallback para navegadores que nao suportam a API.
 * Integrado ao DataSource (v1/v2) com suporte a modo inline e modal.
 * @status stable
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Box, Button, Group, Input, Modal, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconScan, IconCamera, IconCameraOff } from '@tabler/icons-react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';
import { useForceUpdate } from '@mantine/hooks';

declare global {
	interface Window {
		BarcodeDetector: any;
	}
}

export interface ArchbaseBarcodeScannerProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor do scanner (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor do scanner na fonte de dados */
	dataField?: string;
	/** Valor controlado (uso standalone) */
	value?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido */
	error?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se o scanner esta desabilitado */
	disabled?: boolean;
	/** Indicador se e somente leitura */
	readOnly?: boolean;
	/** Continuar escaneando apos primeira leitura (default false) */
	continuous?: boolean;
	/** Formatos de codigo aceitos */
	formats?: string[];
	/** Intervalo entre tentativas de deteccao em ms (default 500) */
	scanInterval?: number;
	/** Callback quando um codigo e escaneado */
	onScan?: (code: string, format: string) => void;
	/** Callback quando ocorre um erro */
	onError?: (error: Error) => void;
	/** Largura do video (default 320) */
	width?: number;
	/** Altura do video (default 240) */
	height?: number;
	/** Mostrar botao de lanterna (default false) */
	showTorchButton?: boolean;
	/** Renderizar como botao que abre modal (default false) */
	asModal?: boolean;
	/** Titulo do modal (default 'Escanear codigo') */
	modalTitle?: string;
	/** Label do botao (default 'Escanear') */
	buttonLabel?: string;
	/** Icone do botao */
	buttonIcon?: ReactNode;
	/** Overlay customizado sobre o video */
	overlay?: ReactNode;
	/** Estilo do componente */
	style?: CSSProperties;
	/** Classe CSS */
	className?: string;
	/** Evento quando o valor e alterado */
	onChangeValue?: (value: string) => void;
}

interface DetectedBarcode {
	rawValue: string;
	format: string;
	boundingBox: DOMRectReadOnly;
	cornerPoints: { x: number; y: number }[];
}

const DEFAULT_FORMATS = ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39'];

function ArchbaseBarcodeScannerInner<T, ID>(
	props: ArchbaseBarcodeScannerProps<T, ID> & { onClose?: () => void },
) {
	const {
		dataSource,
		dataField,
		value: propValue,
		continuous = false,
		formats = DEFAULT_FORMATS,
		scanInterval = 500,
		onScan,
		onError,
		width = 320,
		height = 240,
		showTorchButton = false,
		overlay,
		onChangeValue,
		disabled = false,
		readOnly = false,
		onClose,
	} = props;

	const theme = useMantineTheme();

	// V1/V2 compatibility
	const v1v2 = useArchbaseV1V2Compatibility<string>(
		'ArchbaseBarcodeScanner',
		dataSource,
		dataField,
		propValue ?? '',
	);

	const [isScanning, setIsScanning] = useState(false);
	const [lastScannedCode, setLastScannedCode] = useState<string>('');
	const [lastScannedFormat, setLastScannedFormat] = useState<string>('');
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [torchEnabled, setTorchEnabled] = useState(false);
	const [supportsBarcodeDetector, setSupportsBarcodeDetector] = useState(true);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const detectorRef = useRef<any>(null);
	const animationFrameRef = useRef<number>(0);
	const lastDetectionTimeRef = useRef<number>(0);

	// DataSource listener setup
	const dataSourceEventRef = useRef(v1v2.dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = v1v2.dataSourceEvent;
	}, [v1v2.dataSourceEvent]);

	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	useEffect(() => {
		v1v2.loadDataSourceFieldValue();
		if (dataSource && dataField) {
			dataSource.addListener(stableDataSourceEvent);
			const hasFieldListener = typeof (dataSource as any).addFieldChangeListener === 'function';
			if (hasFieldListener) {
				(dataSource as any).addFieldChangeListener(dataField, v1v2.loadDataSourceFieldValue);
			}
			return () => {
				dataSource.removeListener(stableDataSourceEvent);
				if (hasFieldListener) {
					(dataSource as any).removeFieldChangeListener(dataField, v1v2.loadDataSourceFieldValue);
				}
			};
		}
	}, [dataSource, dataField, stableDataSourceEvent]);

	useArchbaseDidUpdate(() => {
		v1v2.loadDataSourceFieldValue();
	}, []);

	// Initialize BarcodeDetector
	useEffect(() => {
		if (typeof window !== 'undefined' && window.BarcodeDetector) {
			try {
				detectorRef.current = new window.BarcodeDetector({ formats });
			} catch {
				setSupportsBarcodeDetector(false);
			}
		} else {
			setSupportsBarcodeDetector(false);
		}
	}, [formats]);

	const handleCodeDetected = useCallback(
		(code: string, format: string) => {
			setLastScannedCode(code);
			setLastScannedFormat(format);
			v1v2.handleValueChange(code);

			if (onChangeValue) {
				onChangeValue(code);
			}
			if (onScan) {
				onScan(code, format);
			}

			if (!continuous) {
				stopCamera();
				if (onClose) {
					onClose();
				}
			}
		},
		[continuous, onScan, onChangeValue, onClose, v1v2.handleValueChange],
	);

	const detectBarcodes = useCallback(async () => {
		if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

		const now = Date.now();
		if (now - lastDetectionTimeRef.current < scanInterval) {
			animationFrameRef.current = requestAnimationFrame(detectBarcodes);
			return;
		}
		lastDetectionTimeRef.current = now;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx || video.readyState < video.HAVE_ENOUGH_DATA) {
			animationFrameRef.current = requestAnimationFrame(detectBarcodes);
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		try {
			const barcodes: DetectedBarcode[] = await detectorRef.current.detect(canvas);
			if (barcodes && barcodes.length > 0) {
				const barcode = barcodes[0];
				handleCodeDetected(barcode.rawValue, barcode.format);
				if (!continuous) return;
			}
		} catch (err) {
			// Silently continue on detection errors
		}

		animationFrameRef.current = requestAnimationFrame(detectBarcodes);
	}, [scanInterval, continuous, handleCodeDetected]);

	const startCamera = useCallback(async () => {
		if (disabled || readOnly) return;

		if (!supportsBarcodeDetector) {
			const errorMsg = 'BarcodeDetector API nao e suportada neste navegador. Use Chrome 83+ ou Edge 83+.';
			setCameraError(errorMsg);
			if (onError) {
				onError(new Error(errorMsg));
			}
			return;
		}

		setCameraError(null);

		try {
			const constraints: MediaStreamConstraints = {
				video: {
					facingMode: 'environment',
					width: { ideal: width * 2 },
					height: { ideal: height * 2 },
				},
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
				setIsScanning(true);
				animationFrameRef.current = requestAnimationFrame(detectBarcodes);
			}
		} catch (err: any) {
			let errorMsg = 'Erro ao acessar a camera.';
			if (err.name === 'NotAllowedError') {
				errorMsg = 'Permissao para acessar a camera foi negada.';
			} else if (err.name === 'NotFoundError') {
				errorMsg = 'Nenhuma camera encontrada no dispositivo.';
			} else if (err.name === 'NotReadableError') {
				errorMsg = 'Camera esta em uso por outro aplicativo.';
			}
			setCameraError(errorMsg);
			if (onError) {
				onError(new Error(errorMsg));
			}
		}
	}, [disabled, readOnly, width, height, supportsBarcodeDetector, detectBarcodes, onError]);

	const stopCamera = useCallback(() => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = 0;
		}
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setIsScanning(false);
		setTorchEnabled(false);
	}, []);

	const toggleTorch = useCallback(async () => {
		if (!streamRef.current) return;
		const track = streamRef.current.getVideoTracks()[0];
		if (!track) return;

		try {
			const capabilities = track.getCapabilities() as any;
			if (capabilities.torch) {
				const newTorchState = !torchEnabled;
				await track.applyConstraints({
					advanced: [{ torch: newTorchState } as any],
				});
				setTorchEnabled(newTorchState);
			}
		} catch {
			// torch not supported on this device
		}
	}, [torchEnabled]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	const isReadOnly = () => {
		let tmpReadOnly = readOnly;
		if (dataSource && !readOnly) {
			tmpReadOnly = dataSource.isBrowsing();
		}
		return tmpReadOnly;
	};

	return (
		<Stack gap="xs">
			<Box
				style={{
					position: 'relative',
					width,
					height,
					backgroundColor: theme.colors.dark[7],
					borderRadius: theme.radius.sm,
					overflow: 'hidden',
				}}
			>
				<video
					ref={videoRef}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: isScanning ? 'block' : 'none',
					}}
					playsInline
					muted
				/>

				{!isScanning && (
					<Stack
						align="center"
						justify="center"
						style={{
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					>
						{cameraError ? (
							<>
								<IconCameraOff size={48} color={theme.colors.red[5]} />
								<Text size="xs" c="red" ta="center" px="sm">
									{cameraError}
								</Text>
							</>
						) : (
							<>
								<IconCamera size={48} color={theme.colors.gray[5]} />
								<Text size="xs" c="dimmed" ta="center" px="sm">
									Clique em iniciar para ativar a camera
								</Text>
							</>
						)}
					</Stack>
				)}

				{/* Scan overlay */}
				{isScanning && !overlay && (
					<Box
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '60%',
							height: '60%',
							border: `2px solid ${theme.colors[theme.primaryColor][5]}`,
							borderRadius: theme.radius.sm,
							pointerEvents: 'none',
							opacity: 0.7,
						}}
					/>
				)}

				{/* Custom overlay */}
				{isScanning && overlay && (
					<Box
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							pointerEvents: 'none',
						}}
					>
						{overlay}
					</Box>
				)}

				{/* Hidden canvas for frame capture */}
				<canvas ref={canvasRef} style={{ display: 'none' }} />
			</Box>

			{/* Controls */}
			<Group gap="xs">
				{!isScanning ? (
					<Button
						size="xs"
						leftSection={<IconScan size={16} />}
						onClick={startCamera}
						disabled={disabled || isReadOnly()}
					>
						Iniciar scanner
					</Button>
				) : (
					<Button
						size="xs"
						variant="outline"
						color="red"
						leftSection={<IconCameraOff size={16} />}
						onClick={stopCamera}
					>
						Parar scanner
					</Button>
				)}
				{showTorchButton && isScanning && (
					<Button size="xs" variant="light" onClick={toggleTorch}>
						{torchEnabled ? 'Desligar lanterna' : 'Ligar lanterna'}
					</Button>
				)}
			</Group>

			{/* Last scanned code */}
			{lastScannedCode && (
				<Box
					style={{
						padding: theme.spacing.xs,
						backgroundColor:
							theme.colors[theme.primaryColor][0],
						borderRadius: theme.radius.sm,
						border: `1px solid ${theme.colors[theme.primaryColor][3]}`,
					}}
				>
					<Text size="xs" c="dimmed">
						Ultimo codigo ({lastScannedFormat}):
					</Text>
					<Text size="sm" fw={600}>
						{lastScannedCode}
					</Text>
				</Box>
			)}
		</Stack>
	);
}

export function ArchbaseBarcodeScanner<T, ID>(props: ArchbaseBarcodeScannerProps<T, ID>) {
	const {
		asModal = false,
		modalTitle = 'Escanear codigo',
		buttonLabel = 'Escanear',
		buttonIcon,
		label,
		description,
		error,
		required,
		style,
		className,
		disabled = false,
		readOnly = false,
		dataSource,
	} = props;

	const [modalOpened, setModalOpened] = useState(false);

	// Validation context
	const validationContext = useValidationErrors();
	const fieldKey = `${props.dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	const [internalError, setInternalError] = useState<string | undefined>(error);

	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const displayError = internalError || contextError;

	const isReadOnly = () => {
		let tmpReadOnly = readOnly;
		if (dataSource && !readOnly) {
			tmpReadOnly = dataSource.isBrowsing();
		}
		return tmpReadOnly;
	};

	if (asModal) {
		return (
			<Box style={style} className={className}>
				{label && (
					<Input.Label required={required}>{label}</Input.Label>
				)}
				{description && (
					<Input.Description>{description}</Input.Description>
				)}
				<Button
					leftSection={buttonIcon ?? <IconScan size={16} />}
					onClick={() => setModalOpened(true)}
					disabled={disabled || isReadOnly()}
					variant="light"
					mt={4}
				>
					{buttonLabel}
				</Button>
				{displayError && (
					<Input.Error mt={4}>{displayError}</Input.Error>
				)}
				<Modal
					opened={modalOpened}
					onClose={() => setModalOpened(false)}
					title={modalTitle}
					centered
					size="auto"
				>
					<ArchbaseBarcodeScannerInner<T, ID>
						{...props}
						onClose={() => setModalOpened(false)}
					/>
				</Modal>
			</Box>
		);
	}

	return (
		<Box style={style} className={className}>
			{label && (
				<Input.Label required={required}>{label}</Input.Label>
			)}
			{description && (
				<Input.Description>{description}</Input.Description>
			)}
			<ArchbaseBarcodeScannerInner<T, ID> {...props} />
			{displayError && (
				<Input.Error mt={4}>{displayError}</Input.Error>
			)}
		</Box>
	);
}

ArchbaseBarcodeScanner.displayName = 'ArchbaseBarcodeScanner';
