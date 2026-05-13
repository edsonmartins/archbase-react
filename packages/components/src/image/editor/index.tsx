/**
 * ArchbaseImagePickerEditor - Wrapper para react-image-picker-editor
 * Componente para seleção, edição e compressão de imagens em png, jpeg e webp
 *
 * Funcionalidades:
 * - Suporta diferentes tipos de entrada: URL, data URI (base64), blob URL
 * - Debounce para evitar múltiplas chamadas do callback
 * - Mantém compatibilidade total com a API anterior
 */
import { ActionIconVariant, Text, useMantineColorScheme } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useArchbaseTranslation } from '@archbase/core';
import React, { memo, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useArchbaseTheme } from '@archbase/core';
import ReactImagePickerEditor, { ImagePickerConf } from 'react-image-picker-editor';
import 'react-image-picker-editor/dist/index.css';
import './image_editor_styles.scss';
import { ArchbaseImagePickerConf } from './models/index.models';

export * from './models/index.models';

// Mapeamento de idiomas para o react-image-picker-editor
const LANGUAGE_MAP: Record<string, string> = {
	'pt-BR': 'pt',
	'pt': 'pt',
	'en': 'en',
	'en-US': 'en',
	'es': 'es',
	'es-ES': 'es',
	'fr': 'fr',
	'fr-FR': 'fr',
	'de': 'de',
	'de-DE': 'de',
	'fa': 'fa',
};

/**
 * Verifica se uma string é um data URI válido (com prefixo data:image/...)
 */
function isDataUri(str: string | null | undefined): boolean {
	if (!str) return false;
	return str.startsWith('data:');
}

/**
 * Verifica se uma string é um blob URL
 */
function isBlobUrl(str: string | null | undefined): boolean {
	if (!str) return false;
	return str.startsWith('blob:');
}

/**
 * Verifica se uma string é uma URL externa (http/https)
 */
function isExternalUrl(str: string | null | undefined): boolean {
	if (!str) return false;
	return str.startsWith('http://') || str.startsWith('https://');
}

/**
 * Verifica se uma string parece ser base64 puro (sem prefixo data:)
 * Base64 válido contém apenas A-Z, a-z, 0-9, +, /, = e tem comprimento múltiplo de 4
 */
function isRawBase64(str: string | null | undefined): boolean {
	if (!str || str.length < 100) return false; // Imagens base64 são geralmente grandes
	// Verificar se não começa com prefixos conhecidos
	if (isDataUri(str) || isBlobUrl(str) || isExternalUrl(str)) return false;
	// Verificar padrão de base64
	const base64Regex = /^[A-Za-z0-9+/]+=*$/;
	// Verificar apenas os primeiros 100 caracteres para performance
	return base64Regex.test(str.substring(0, 100));
}

/**
 * Normaliza a imagem de entrada para um formato que o componente pode exibir
 * Converte base64 puro para data URI se necessário
 */
function normalizeImageSrc(src: string | null | undefined): string | null {
	if (!src) return null;

	// Se já é um formato válido, retornar como está
	if (isDataUri(src) || isBlobUrl(src) || isExternalUrl(src)) {
		return src;
	}

	// Se parece ser base64 puro, converter para data URI
	if (isRawBase64(src)) {
		// Tentar detectar o tipo da imagem pelo header base64
		// JPEG começa com /9j/
		// PNG começa com iVBOR
		// GIF começa com R0lGOD
		// WebP começa com UklGR
		let mimeType = 'image/jpeg'; // Padrão
		if (src.startsWith('/9j/')) {
			mimeType = 'image/jpeg';
		} else if (src.startsWith('iVBOR')) {
			mimeType = 'image/png';
		} else if (src.startsWith('R0lGOD')) {
			mimeType = 'image/gif';
		} else if (src.startsWith('UklGR')) {
			mimeType = 'image/webp';
		}
		return `data:${mimeType};base64,${src}`;
	}

	// Se não reconhecemos o formato, retornar como está (pode ser uma URL relativa)
	return src;
}

/**
 * Converte a configuração do Archbase para o formato do react-image-picker-editor
 */
function toImagePickerConf(
	config: ArchbaseImagePickerConf,
	colorScheme: 'light' | 'dark',
	language: string
): ImagePickerConf {
	return {
		width: typeof config.width === 'number' ? `${config.width}px` : (config.width as string),
		height: typeof config.height === 'number' ? `${config.height}px` : (config.height as string),
		borderRadius: typeof config.borderRadius === 'number' ? `${config.borderRadius}px` : (config.borderRadius as string),
		aspectRatio: config.aspectRatio ?? undefined,
		objectFit: config.objectFit,
		compressInitial: config.compressInitial ?? undefined,
		hideDeleteBtn: config.hideDeleteBtn,
		hideDownloadBtn: config.hideDownloadBtn,
		hideEditBtn: config.hideEditBtn,
		hideAddBtn: config.hideAddBtn,
		darkMode: colorScheme === 'dark',
		language: LANGUAGE_MAP[language] || 'en',
	};
}

/**
 * Calcula o tamanho da imagem em KB a partir de uma string base64
 */
function calculateImageSize(dataUri: string | null | undefined): number | null {
	if (!dataUri || !dataUri.length || !isDataUri(dataUri)) return null;
	// Remove o header do data URI para calcular apenas o conteúdo base64
	const base64 = dataUri.split(',')[1];
	if (!base64) return null;
	// Fórmula: (3/4) * length / 1024 para obter KB aproximado
	return Math.ceil(((3 / 4) * base64.length) / 1024);
}

/**
 * Extrai o formato da imagem do data URI
 */
function extractFormat(dataUri: string | null | undefined): string {
	if (!dataUri || !isDataUri(dataUri)) return '';
	const match = dataUri.match(/data:image\/([a-zA-Z]+);base64,/);
	if (match && match[1]) {
		return match[1] === 'jpeg' ? 'jpeg' : match[1];
	}
	return 'png';
}

/**
 * Redimensiona uma imagem se exceder os limites de tamanho
 * @param dataUri Data URI da imagem original
 * @param maxWidth Largura máxima em pixels
 * @param maxHeight Altura máxima em pixels
 * @param maxSizeKb Tamanho máximo em KB
 * @param quality Qualidade inicial da compressão (0-100)
 * @returns Promise com o data URI redimensionado
 */
async function resizeImageIfNeeded(
	dataUri: string,
	maxWidth?: number,
	maxHeight?: number,
	maxSizeKb?: number,
	quality: number = 80
): Promise<string> {
	return new Promise((resolve) => {
		// Se não há limites definidos, retorna como está
		if (!maxWidth && !maxHeight && !maxSizeKb) {
			resolve(dataUri);
			return;
		}

		const img = new Image();
		img.onload = () => {
			let targetWidth = img.width;
			let targetHeight = img.height;

			// Calcular novo tamanho se exceder limites
			if (maxWidth && img.width > maxWidth) {
				const ratio = maxWidth / img.width;
				targetWidth = maxWidth;
				targetHeight = Math.round(img.height * ratio);
			}
			if (maxHeight && targetHeight > maxHeight) {
				const ratio = maxHeight / targetHeight;
				targetHeight = maxHeight;
				targetWidth = Math.round(targetWidth * ratio);
			}

			// Se não precisa redimensionar e não há limite de tamanho, retorna original
			if (targetWidth === img.width && targetHeight === img.height && !maxSizeKb) {
				resolve(dataUri);
				return;
			}

			// Criar canvas para redimensionar
			const canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(dataUri);
				return;
			}

			ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

			// Determinar formato de saída
			const format = extractFormat(dataUri);
			const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

			// Função para comprimir até atingir o tamanho desejado
			const compressToSize = (currentQuality: number): string => {
				const result = canvas.toDataURL(mimeType, currentQuality / 100);
				if (maxSizeKb) {
					const sizeKb = Math.ceil(((3 / 4) * result.split(',')[1].length) / 1024);
					// Se ainda está grande e qualidade pode ser reduzida
					if (sizeKb > maxSizeKb && currentQuality > 20) {
						return compressToSize(currentQuality - 10);
					}
				}
				return result;
			};

			resolve(compressToSize(quality));
		};
		img.onerror = () => {
			resolve(dataUri);
		};
		img.src = dataUri;
	});
}

/**
 * Props do ArchbaseImagePickerEditor
 * Mantém compatibilidade total com a versão anterior
 */
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

/**
 * ArchbaseImagePickerEditor - Componente de seleção e edição de imagens
 *
 * Funcionalidades:
 * - Seleção de imagens (upload)
 * - Edição com crop, redimensionamento
 * - Compressão de qualidade (JPEG/WebP)
 * - Conversão de formatos (PNG, JPEG, WebP)
 * - Filtros (contraste, brilho, saturação, sépia, blur)
 * - Suporte a dark mode
 * - Suporte a URL externa, data URI e blob URL
 *
 * @example
 * ```tsx
 * <ArchbaseImagePickerEditor
 *   imageSrcProp={imageValue}
 *   config={{
 *     width: 300,
 *     height: 200,
 *     compressInitial: 80,
 *     objectFit: 'contain',
 *     onChangeImage: (newImage) => setImageValue(newImage),
 *   }}
 * />
 * ```
 */
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
		const { t, i18n } = useArchbaseTranslation();

		// Normalizar a imagem de entrada para formato suportado
		const normalizedInitialSrc = useMemo(() => normalizeImageSrc(imageSrcProp), [imageSrcProp]);

		const [imageSrc, setImageSrc] = useState<string | null>(normalizedInitialSrc);
		const [loadImage, setLoadImage] = useState<boolean>(!!normalizedInitialSrc);
		const imageName = useRef('download');

		// Ref para rastrear a última imagem reportada (evitar callbacks duplicados)
		const lastReportedImageRef = useRef<string | null | undefined>(undefined);

		// Ref para a imagem original (antes de normalização) para comparação
		const originalImagePropRef = useRef<string | undefined>(imageSrcProp);

		// Ref para onProcessingChange para evitar closure stale no debounce
		const onProcessingChangeRef = useRef(onProcessingChange);
		onProcessingChangeRef.current = onProcessingChange;

		// Ref para saber se é a primeira renderização
		const isFirstRender = useRef(true);

		// Configuração padrão
		const defaultConfig: ArchbaseImagePickerConf = {
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

		const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

		// Converter para configuração do react-image-picker-editor
		const pickerConfig = useMemo(
			() => toImagePickerConf(mergedConfig, colorScheme as 'light' | 'dark', i18n.language),
			[mergedConfig, colorScheme, i18n.language]
		);

		// Callback com debounce para evitar múltiplas chamadas rápidas
		const debouncedOnChange = useDebouncedCallback((newDataUri: string | undefined) => {
			// Verificar se a imagem realmente mudou
			if (lastReportedImageRef.current === newDataUri) {
				// Notificar que o processamento terminou (usando ref para evitar closure stale)
				onProcessingChangeRef.current?.(false);
				return;
			}

			lastReportedImageRef.current = newDataUri;

			// Chamar callback do config (API principal)
			if (mergedConfig.onChangeImage) {
				mergedConfig.onChangeImage(newDataUri);
			}

			// Chamar callback legado (para compatibilidade)
			if (imageChanged) {
				imageChanged(newDataUri);
			}

			// Notificar que o processamento terminou (usando ref para evitar closure stale)
			onProcessingChangeRef.current?.(false);
		}, 300); // 300ms de debounce

		// Sincronizar com prop externa
		useEffect(() => {
			// Sempre atualizar quando a prop mudar (mesmo que seja a mesma do ref inicial)
			const normalizedSrc = normalizeImageSrc(imageSrcProp);

			console.log('[ImagePickerEditor] useEffect sync:', {
				imageSrcProp: imageSrcProp?.substring(0, 50),
				normalizedSrc: normalizedSrc?.substring(0, 50),
				currentImageSrc: imageSrc?.substring(0, 50),
				willUpdate: normalizedSrc !== imageSrc
			});

			// Só atualizar o estado se o valor normalizado for diferente do atual
			if (normalizedSrc !== imageSrc) {
				setImageSrc(normalizedSrc);
				setLoadImage(!!normalizedSrc);
			}

			// Atualizar a referência
			originalImagePropRef.current = imageSrcProp;

			// Atualizar a referência sem disparar callback na sincronização inicial
			if (isFirstRender.current) {
				lastReportedImageRef.current = normalizedSrc;
				isFirstRender.current = false;
			}
		}, [imageSrcProp]);

		// Handler quando a imagem muda no editor
		const handleImageChanged = useCallback(async (newDataUri: string) => {
			console.log('[ImagePickerEditor] handleImageChanged:', {
				newDataUri: newDataUri?.substring(0, 50),
				currentImageSrc: imageSrc?.substring(0, 50),
				isDifferent: imageSrc !== newDataUri
			});

			// Só processa se for diferente do valor atual
			if (imageSrc === newDataUri) {
				return;
			}

			// Ignorar se o novo valor for vazio mas já temos uma imagem
			if (!newDataUri && imageSrc) {
				console.log('[ImagePickerEditor] Ignorando valor vazio - já temos imagem');
				return;
			}

			// Notificar que o processamento iniciou
			onProcessingChange?.(true);

			// Redimensionar se necessário
			let processedDataUri = newDataUri;
			if (newDataUri && (mergedConfig.maxWidth || mergedConfig.maxHeight || mergedConfig.maxSizeKb)) {
				processedDataUri = await resizeImageIfNeeded(
					newDataUri,
					mergedConfig.maxWidth,
					mergedConfig.maxHeight,
					mergedConfig.maxSizeKb,
					mergedConfig.compressInitial ?? 80
				);
			}

			const newValue = processedDataUri || undefined;

			setImageSrc(processedDataUri || null);
			setLoadImage(!!processedDataUri);

			// Usar callback com debounce
			debouncedOnChange(newValue);
		}, [imageSrc, debouncedOnChange, onProcessingChange, mergedConfig.maxWidth, mergedConfig.maxHeight, mergedConfig.maxSizeKb, mergedConfig.compressInitial]);

		// Calcular tamanho e formato da imagem (apenas para data URIs)
		const sizeImage = useMemo(() => calculateImageSize(imageSrc), [imageSrc]);
		const format = useMemo(() => extractFormat(imageSrc), [imageSrc]);

		// Verificar se deve mostrar informações de tamanho
		const showSizeInfo = loadImage && sizeImage !== null && mergedConfig.showImageSize && isDataUri(imageSrc);

		// Estilo do container
		const containerStyle = useMemo(() => ({
			width: typeof mergedConfig.width === 'number' ? `${mergedConfig.width}px` : mergedConfig.width,
			backgroundColor: mergedConfig.imageBackgroundColor ?? (colorScheme === 'dark' ? theme.colors.dark[7] : theme.white),
		}), [mergedConfig.width, mergedConfig.imageBackgroundColor, colorScheme, theme]);

		return (
			<div className="ArchbaseImagePickerEditor" style={containerStyle}>
				{/* Componente react-image-picker-editor */}
				<ReactImagePickerEditor
					config={pickerConfig}
					imageSrcProp={imageSrc || ''}
					imageChanged={handleImageChanged}
					color={color}
				/>

				{/* Informação de tamanho (quando habilitado, imagem carregada e é data URI) */}
				{showSizeInfo && (
					<div
						className="caption image-caption"
						style={{
							color: sizeImage! > 120 ? '#f44336' : 'unset',
							fontWeight: sizeImage! > 120 ? '500' : 'unset',
							marginTop: '4px',
							textAlign: 'center',
						}}
					>
						<Text size="sm">{`${t('archbase:size')}: ${sizeImage}Kb ${format}`}</Text>
					</div>
				)}
			</div>
		);
	},
);

ArchbaseImagePickerEditor.displayName = 'ArchbaseImagePickerEditor';
