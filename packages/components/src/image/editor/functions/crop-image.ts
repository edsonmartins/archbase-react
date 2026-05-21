/**
 * Utilidades de crop usadas pelo modal de edição do ArchbaseImagePickerEditor.
 * Trabalham diretamente sobre data URIs, preservando o mime original (PNG/WebP
 * mantêm alpha; JPEG continua JPEG). Não há "fallback silencioso" para JPEG.
 *
 * Algoritmo de crop com rotação adaptado do exemplo oficial do react-easy-crop:
 * https://github.com/ValentinH/react-easy-crop/blob/master/example/utils.ts
 */

export interface PixelCrop {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Detecta o mime de saída do crop respeitando alpha:
 *  - se a origem é PNG ou WebP, ou se `preserveTransparency` está ligado,
 *    retornamos um mime com suporte a alpha (PNG ou WebP);
 *  - caso contrário, JPEG.
 */
function pickOutputMime(sourceDataUri: string, preserveTransparency: boolean): string {
	const match = sourceDataUri.match(/^data:(image\/[a-zA-Z+\-.]+);/);
	const sourceMime = match?.[1] ?? '';
	if (preserveTransparency || sourceMime === 'image/png' || sourceMime === 'image/webp') {
		return sourceMime === 'image/webp' ? 'image/webp' : 'image/png';
	}
	return 'image/jpeg';
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(e);
		img.src = src;
	});
}

function toRadians(deg: number): number {
	return (deg * Math.PI) / 180;
}

/**
 * Bounding box que comporta a imagem após rotação. Necessário para o canvas
 * intermediário não cortar a imagem rotacionada.
 */
function rotateSize(width: number, height: number, rotation: number): { width: number; height: number } {
	const rotRad = toRadians(rotation);
	return {
		width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
}

/**
 * Aplica rotação (em graus) + crop sobre `imageSrc` e retorna o data URI
 * resultante.
 *
 * Estratégia:
 *   1. Desenha a imagem rotacionada centralizada num canvas auxiliar do
 *      tamanho do bounding box rotacionado.
 *   2. Faz drawImage do recorte (pixelCrop) desse canvas auxiliar para o
 *      canvas final do tamanho do recorte.
 *
 * Output mime respeita `preserveTransparency` e a origem (ver pickOutputMime).
 */
export async function getCroppedImage(
	imageSrc: string,
	pixelCrop: PixelCrop,
	rotation: number = 0,
	preserveTransparency: boolean = false,
	quality: number = 92,
): Promise<string> {
	const image = await loadImage(imageSrc);
	const mime = pickOutputMime(imageSrc, preserveTransparency);

	// 1) Canvas intermediário: imagem rotacionada centralizada.
	const { width: bBoxW, height: bBoxH } = rotateSize(image.width, image.height, rotation);
	const work = document.createElement('canvas');
	work.width = Math.round(bBoxW);
	work.height = Math.round(bBoxH);
	const workCtx = work.getContext('2d');
	if (!workCtx) throw new Error('Canvas 2D context not available');

	workCtx.translate(bBoxW / 2, bBoxH / 2);
	workCtx.rotate(toRadians(rotation));
	workCtx.translate(-image.width / 2, -image.height / 2);
	workCtx.drawImage(image, 0, 0);

	// 2) Canvas final do tamanho do recorte (em pixels reais).
	const out = document.createElement('canvas');
	out.width = Math.round(pixelCrop.width);
	out.height = Math.round(pixelCrop.height);
	const outCtx = out.getContext('2d');
	if (!outCtx) throw new Error('Canvas 2D context not available');

	outCtx.drawImage(
		work,
		Math.round(pixelCrop.x),
		Math.round(pixelCrop.y),
		Math.round(pixelCrop.width),
		Math.round(pixelCrop.height),
		0,
		0,
		Math.round(pixelCrop.width),
		Math.round(pixelCrop.height),
	);

	// PNG ignora o parâmetro de qualidade; passamos mesmo assim para JPEG/WebP.
	return out.toDataURL(mime, quality / 100);
}

/**
 * Redimensiona um data URI para respeitar maxWidth/maxHeight, preservando
 * proporção e mime apropriado. Usado fora do fluxo de crop, ao subir um arquivo.
 */
export async function resizeDataUri(
	dataUri: string,
	maxWidth?: number,
	maxHeight?: number,
	maxSizeKb?: number,
	quality: number = 92,
	preserveTransparency: boolean = false,
): Promise<string> {
	if (!maxWidth && !maxHeight && !maxSizeKb) return dataUri;

	const img = await loadImage(dataUri);
	let targetWidth = img.width;
	let targetHeight = img.height;

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

	if (targetWidth === img.width && targetHeight === img.height && !maxSizeKb) {
		return dataUri;
	}

	const canvas = document.createElement('canvas');
	canvas.width = targetWidth;
	canvas.height = targetHeight;
	const ctx = canvas.getContext('2d');
	if (!ctx) return dataUri;
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	const mime = pickOutputMime(dataUri, preserveTransparency);

	const compressToSize = (currentQuality: number): string => {
		const result = canvas.toDataURL(mime, currentQuality / 100);
		if (maxSizeKb) {
			const base64 = result.split(',')[1] ?? '';
			const sizeKb = Math.ceil(((3 / 4) * base64.length) / 1024);
			if (sizeKb > maxSizeKb && currentQuality > 20 && mime !== 'image/png') {
				// PNG é lossless; reduzir quality não diminui o tamanho.
				return compressToSize(currentQuality - 10);
			}
		}
		return result;
	};

	return compressToSize(quality);
}
