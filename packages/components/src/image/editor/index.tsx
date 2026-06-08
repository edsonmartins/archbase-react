/**
 * ArchbaseImagePickerEditor — picker + editor de imagens próprio do Archbase.
 *
 * Implementação:
 *  - Upload via @mantine/dropzone (drag-and-drop + click). O conteúdo do
 *    arquivo é lido com FileReader.readAsDataURL(), o que preserva os bytes
 *    originais — sem nenhum canvas roundtrip. Logo, PNGs/WebPs com canal
 *    alfa chegam ao callback com a transparência intacta.
 *  - Preview com <img> nativa, sem any third-party.
 *  - Botões de adicionar (re-upload), editar (crop/rotate em modal),
 *    download e deletar — ActionIcons do Mantine.
 *  - Crop opcional via react-easy-crop, com mime de saída respeitando
 *    `preserveTransparency` (ver crop-image.ts).
 *
 * Mantém a API externa anterior (props `config`, `imageSrcProp`,
 * `imageChanged`, `variant`, `onProcessingChange`) para compatibilidade
 * com ArchbaseImageEdit e demais consumidores.
 */
import { ActionIcon, ActionIconVariant, Box, Button, Group, Modal, Slider, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { useArchbaseTranslation, useArchbaseTheme } from '@archbase/core';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
	IconCrop,
	IconDownload,
	IconPhoto,
	IconPhotoPlus,
	IconRotate,
	IconTrash,
	IconUpload,
	IconX,
} from '@tabler/icons-react';
import { ArchbaseImagePickerConf } from './models/index.models';
import { getCroppedImage, resizeDataUri } from './functions/crop-image';

export * from './models/index.models';

// ---------------------------------------------------------------------------
// Utilidades de detecção de formato — exportadas para uso em outros pontos do
// pacote (ArchbaseImageEdit, etc).
// ---------------------------------------------------------------------------

function isDataUri(str: string | null | undefined): boolean {
	return !!str && str.startsWith('data:');
}
function isBlobUrl(str: string | null | undefined): boolean {
	return !!str && str.startsWith('blob:');
}
function isExternalUrl(str: string | null | undefined): boolean {
	return !!str && (str.startsWith('http://') || str.startsWith('https://'));
}

/**
 * Verifica se uma string parece ser base64 puro (sem prefixo data:).
 */
function isRawBase64(str: string | null | undefined): boolean {
	if (!str || str.length < 100) return false;
	if (isDataUri(str) || isBlobUrl(str) || isExternalUrl(str)) return false;
	const head = str.substring(0, 100);
	return /^[A-Za-z0-9+/]+=*$/.test(head);
}

/**
 * Normaliza a imagem de entrada para um formato que o componente pode exibir:
 *  - data URIs, blob URLs e URLs externas são retornados como estão;
 *  - base64 puro é convertido em data URI, com mime inferido pelos primeiros
 *    bytes do conteúdo (JPEG/PNG/GIF/WebP).
 */
function normalizeImageSrc(src: string | null | undefined): string | null {
	if (!src) return null;
	if (isDataUri(src) || isBlobUrl(src) || isExternalUrl(src)) return src;
	if (isRawBase64(src)) {
		let mimeType = 'image/jpeg';
		if (src.startsWith('/9j/')) mimeType = 'image/jpeg';
		else if (src.startsWith('iVBOR')) mimeType = 'image/png';
		else if (src.startsWith('R0lGOD')) mimeType = 'image/gif';
		else if (src.startsWith('UklGR')) mimeType = 'image/webp';
		return `data:${mimeType};base64,${src}`;
	}
	return src;
}

function calculateImageSizeKb(dataUri: string | null | undefined): number | null {
	if (!dataUri || !isDataUri(dataUri)) return null;
	const base64 = dataUri.split(',')[1];
	if (!base64) return null;
	return Math.ceil(((3 / 4) * base64.length) / 1024);
}

function extractFormat(dataUri: string | null | undefined): string {
	if (!dataUri || !isDataUri(dataUri)) return '';
	const match = dataUri.match(/data:image\/([a-zA-Z+\-.]+);base64,/);
	if (match && match[1]) return match[1] === 'jpeg' ? 'jpeg' : match[1];
	return '';
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export interface ArchbaseImagePickerEditorProps {
	/** Configuração do editor (interface ArchbaseImagePickerConf) */
	config?: ArchbaseImagePickerConf;
	/** Imagem inicial (data URI, URL externa ou blob URL) */
	imageSrcProp?: string;
	/** Cor de destaque */
	color?: string;
	/**
	 * Callback quando a imagem é alterada
	 * @deprecated Use config.onChangeImage ao invés
	 */
	imageChanged?: (newDataUri: string | undefined) => void;
	/** Variante dos botões de ação */
	variant?: ActionIconVariant;
	/** Callback quando o estado de processamento muda (útil para desabilitar botões enquanto processa) */
	onProcessingChange?: (isProcessing: boolean) => void;
}

const DEFAULT_CONFIG: ArchbaseImagePickerConf = {
	objectFit: 'cover',
	hideDeleteBtn: false,
	hideDownloadBtn: false,
	hideEditBtn: false,
	hideAddBtn: false,
	compressInitial: null,
	showImageSize: true,
	width: 330,
	height: 250,
	borderRadius: '8px',
};

export const ArchbaseImagePickerEditor = memo(
	({
		config = {},
		imageSrcProp = '',
		color = '#1e88e5',
		imageChanged,
		variant = 'transparent',
		onProcessingChange,
	}: ArchbaseImagePickerEditorProps) => {
		const theme = useArchbaseTheme();
		const { colorScheme } = useMantineColorScheme();
		const { t } = useArchbaseTranslation();
		// Wrapper para silenciar o tipo `string | object` retornado pelo i18next
		// e prover fallback ao próprio default em pt-BR quando a chave não existir.
		const tr = useCallback(
			(key: string, fallback: string): string => {
				const out = t(key, { defaultValue: fallback }) as unknown;
				return typeof out === 'string' ? out : fallback;
			},
			[t],
		);

		const mergedConfig = useMemo<ArchbaseImagePickerConf>(
			() => ({ ...DEFAULT_CONFIG, ...config }),
			[config],
		);

		// ---- Estado --------------------------------------------------------
		const initialSrc = useMemo(() => normalizeImageSrc(imageSrcProp), [imageSrcProp]);
		const [imageSrc, setImageSrc] = useState<string | null>(initialSrc);
		const [isProcessing, setIsProcessing] = useState(false);

		// Modal de crop
		const [cropOpen, { open: openCrop, close: closeCrop }] = useDisclosure(false);
		const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
		const [cropZoom, setCropZoom] = useState(1);
		const [cropRotation, setCropRotation] = useState(0);
		const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

		// Refs auxiliares
		const fileInputRef = useRef<HTMLInputElement | null>(null);
		const lastReportedRef = useRef<string | null | undefined>(initialSrc);
		const onProcessingChangeRef = useRef(onProcessingChange);
		onProcessingChangeRef.current = onProcessingChange;

		// Sincronizar com prop externa, evitando reentrância do que nós mesmos emitimos.
		useEffect(() => {
			const normalized = normalizeImageSrc(imageSrcProp);
			if (normalized === lastReportedRef.current) return;
			lastReportedRef.current = normalized;
			setImageSrc(normalized);
		}, [imageSrcProp]);

		// Manter ref de processing sincronizada e refletir externamente
		useEffect(() => {
			onProcessingChangeRef.current?.(isProcessing);
		}, [isProcessing]);

		// Notificação debounceada — evita rajadas de callbacks ao redimensionar.
		const debouncedNotify = useDebouncedCallback((dataUri: string | undefined) => {
			if (lastReportedRef.current === dataUri) return;
			lastReportedRef.current = dataUri ?? null;
			mergedConfig.onChangeImage?.(dataUri);
			imageChanged?.(dataUri);
			if (mergedConfig.debug) {
				const mime = dataUri?.match(/^data:(image\/[a-zA-Z+\-.]+);/)?.[1] ?? null;
				// eslint-disable-next-line no-console
				console.log('[ArchbaseImagePickerEditor] notify', {
					mime,
					sizeKb: dataUri ? calculateImageSizeKb(dataUri) : null,
				});
			}
		}, 200);

		// ---- Upload -------------------------------------------------------
		const ingestFile = useCallback(
			async (file: File) => {
				setIsProcessing(true);
				try {
					// Ler arquivo como data URI puro — preserva bytes originais
					// (sem canvas roundtrip), garantindo PNG/WebP com alpha intactos.
					const dataUri = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = () => reject(reader.error);
						reader.readAsDataURL(file);
					});

					// Aplicar limites de tamanho/peso (opcionais).
					const processed = await resizeDataUri(
						dataUri,
						mergedConfig.maxWidth,
						mergedConfig.maxHeight,
						mergedConfig.maxSizeKb,
						mergedConfig.compressInitial ?? 92,
						mergedConfig.preserveTransparency ?? false,
					);

					setImageSrc(processed);
					debouncedNotify(processed);
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error('[ArchbaseImagePickerEditor] failed to read file', e);
				} finally {
					setIsProcessing(false);
				}
			},
			[
				debouncedNotify,
				mergedConfig.maxWidth,
				mergedConfig.maxHeight,
				mergedConfig.maxSizeKb,
				mergedConfig.compressInitial,
				mergedConfig.preserveTransparency,
			],
		);

		const handleDrop = useCallback(
			(files: File[]) => {
				const file = files?.[0];
				if (file) ingestFile(file);
			},
			[ingestFile],
		);

		const handleHiddenInputChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (file) ingestFile(file);
				// Permite re-selecionar o mesmo arquivo
				e.target.value = '';
			},
			[ingestFile],
		);

		const triggerReupload = useCallback(() => {
			fileInputRef.current?.click();
		}, []);

		// ---- Actions ------------------------------------------------------
		const handleDelete = useCallback(() => {
			setImageSrc(null);
			debouncedNotify(undefined);
		}, [debouncedNotify]);

		const handleDownload = useCallback(() => {
			if (!imageSrc) return;
			// Para data URI, fazer download manual para evitar bloqueio em alguns browsers
			const ext = extractFormat(imageSrc) || 'png';
			const a = document.createElement('a');
			a.href = imageSrc;
			a.download = `image.${ext === 'jpeg' ? 'jpg' : ext}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}, [imageSrc]);

		// ---- Crop ---------------------------------------------------------
		const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPx: Area) => {
			setCroppedAreaPixels(croppedAreaPx);
		}, []);

		const handleOpenCrop = useCallback(() => {
			setCropPosition({ x: 0, y: 0 });
			setCropZoom(1);
			setCropRotation(0);
			setCroppedAreaPixels(null);
			openCrop();
		}, [openCrop]);

		const handleApplyCrop = useCallback(async () => {
			if (!imageSrc || !croppedAreaPixels) {
				closeCrop();
				return;
			}
			setIsProcessing(true);
			try {
				const cropped = await getCroppedImage(
					imageSrc,
					croppedAreaPixels,
					cropRotation,
					mergedConfig.preserveTransparency ?? false,
					mergedConfig.compressInitial ?? 92,
				);
				setImageSrc(cropped);
				debouncedNotify(cropped);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('[ArchbaseImagePickerEditor] crop failed', e);
			} finally {
				setIsProcessing(false);
				closeCrop();
			}
		}, [
			imageSrc,
			croppedAreaPixels,
			cropRotation,
			mergedConfig.preserveTransparency,
			mergedConfig.compressInitial,
			closeCrop,
			debouncedNotify,
		]);

		// ---- Render -------------------------------------------------------
		const sizeKb = useMemo(() => calculateImageSizeKb(imageSrc), [imageSrc]);
		const format = useMemo(() => extractFormat(imageSrc), [imageSrc]);
		const showSizeInfo = !!(mergedConfig.showImageSize && sizeKb !== null);

		const widthStyle = typeof mergedConfig.width === 'number' ? `${mergedConfig.width}px` : mergedConfig.width;
		const heightStyle = typeof mergedConfig.height === 'number' ? `${mergedConfig.height}px` : mergedConfig.height;
		const borderRadiusStyle =
			typeof mergedConfig.borderRadius === 'number'
				? `${mergedConfig.borderRadius}px`
				: mergedConfig.borderRadius;

		const containerBg =
			mergedConfig.imageBackgroundColor ??
			(colorScheme === 'dark' ? theme.colors.dark[7] : theme.white);

		const showPlaceholder = !imageSrc;

		return (
			<Box style={{ width: widthStyle }}>
				{/* Input file escondido — reaproveitado para botão "Adicionar" */}
				<input
					ref={fileInputRef}
					type="file"
					accept={IMAGE_MIME_TYPE.join(',')}
					style={{ display: 'none' }}
					onChange={handleHiddenInputChange}
				/>

				{showPlaceholder ? (
					<Dropzone
						onDrop={handleDrop}
						accept={IMAGE_MIME_TYPE}
						maxFiles={1}
						multiple={false}
						loading={isProcessing}
						styles={{
							root: {
								width: widthStyle,
								height: heightStyle,
								borderRadius: borderRadiusStyle,
								backgroundColor: containerBg,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							},
						}}
					>
						<Stack align="center" gap="xs" justify="center" style={{ pointerEvents: 'none' }}>
							<Dropzone.Accept>
								<IconUpload size={32} color={color} />
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconX size={32} color="var(--mantine-color-red-6)" />
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconPhotoPlus size={32} color={color} />
							</Dropzone.Idle>
							<Text size="sm" c="dimmed" ta="center">
								{tr('archbase:Arraste uma imagem ou clique para selecionar', 'Arraste uma imagem ou clique para selecionar')}
							</Text>
						</Stack>
					</Dropzone>
				) : (
					<Box
						style={{
							position: 'relative',
							width: widthStyle,
							height: heightStyle,
							borderRadius: borderRadiusStyle,
							overflow: 'hidden',
							backgroundColor: containerBg,
						}}
					>
						<img
							src={imageSrc}
							alt=""
							style={{
								width: '100%',
								height: '100%',
								objectFit: mergedConfig.objectFit ?? 'contain',
								display: 'block',
							}}
						/>
					</Box>
				)}

				{/* Barra de ações — fora da imagem para não competir por área de clique
				    em previews pequenos (ex.: favicons 48px). */}
				{imageSrc && (
					<Group gap={4} mt={6} justify="flex-start" wrap="nowrap">
						{!mergedConfig.hideAddBtn && (
							<ActionIcon variant={variant} color={color} title={tr('archbase:Trocar imagem', 'Trocar imagem')} onClick={triggerReupload}>
								<IconPhoto size={18} />
							</ActionIcon>
						)}
						{!mergedConfig.hideEditBtn && (
							<ActionIcon variant={variant} color={color} title={tr('archbase:Editar', 'Editar')} onClick={handleOpenCrop}>
								<IconCrop size={18} />
							</ActionIcon>
						)}
						{!mergedConfig.hideDownloadBtn && (
							<ActionIcon variant={variant} color={color} title={tr('archbase:Baixar', 'Baixar')} onClick={handleDownload}>
								<IconDownload size={18} />
							</ActionIcon>
						)}
						{!mergedConfig.hideDeleteBtn && (
							<ActionIcon variant={variant} color="red" title={tr('archbase:Remover', 'Remover')} onClick={handleDelete}>
								<IconTrash size={18} />
							</ActionIcon>
						)}
					</Group>
				)}

				{showSizeInfo && imageSrc && (
					<Text size="xs" c="dimmed" mt={4} ta="center">
						{`${tr('archbase:size', 'tamanho')}: ${sizeKb}Kb ${format}`}
					</Text>
				)}

				{/* Modal de crop/rotate */}
				<Modal
					opened={cropOpen}
					onClose={closeCrop}
					title={tr('archbase:Editar imagem', 'Editar imagem')}
					size="xl"
					centered
				>
					{imageSrc && (
						<Stack>
							<Box style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
								<Cropper
									image={imageSrc}
									crop={cropPosition}
									zoom={cropZoom}
									rotation={cropRotation}
									aspect={mergedConfig.aspectRatio ?? undefined}
									onCropChange={setCropPosition}
									onZoomChange={setCropZoom}
									onRotationChange={setCropRotation}
									onCropComplete={onCropComplete}
									restrictPosition={false}
								/>
							</Box>
							<Group grow align="flex-end">
								<Stack gap={2}>
									<Text size="xs">{tr('archbase:Zoom', 'Zoom')}</Text>
									<Slider min={1} max={5} step={0.1} value={cropZoom} onChange={setCropZoom} />
								</Stack>
								<Stack gap={2}>
									<Text size="xs">{tr('archbase:Rotação', 'Rotação')}</Text>
									<Slider
										min={0}
										max={360}
										step={1}
										value={cropRotation}
										onChange={setCropRotation}
										thumbChildren={<IconRotate size={12} />}
									/>
								</Stack>
							</Group>
							<Group justify="flex-end">
								<Button variant="default" onClick={closeCrop} disabled={isProcessing}>
									{tr('archbase:Cancelar', 'Cancelar')}
								</Button>
								<Button onClick={handleApplyCrop} loading={isProcessing}>
									{tr('archbase:Aplicar', 'Aplicar')}
								</Button>
							</Group>
						</Stack>
					)}
				</Modal>
			</Box>
		);
	},
);

ArchbaseImagePickerEditor.displayName = 'ArchbaseImagePickerEditor';
