import type { FileType, FileSource, ImageType, VideoType, AudioType, TextType, CodeType, OfficeType } from '../ArchbaseFilePreviewer.types';

/**
 * Extensões de arquivo por categoria
 */
const FILE_EXTENSIONS = {
  pdf: ['pdf'],

  image: [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico',
    'tiff', 'tif', 'psd', 'raw', 'heic', 'avif'
  ] as ImageType[],

  video: [
    'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv',
    'flv', 'wmv', 'm4v', '3gp'
  ] as VideoType[],

  audio: [
    'mp3', 'wav', 'ogg', 'aac', 'flac',
    'm4a', 'wma', 'aiff', 'opus'
  ] as AudioType[],

  text: [
    'txt', 'md', 'json', 'xml', 'html', 'htm',
    'css', 'js', 'ts', 'jsx', 'tsx', 'yaml', 'yml',
    'csv', 'rtf', 'log'
  ] as TextType[],

  code: [
    'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp',
    'h', 'hpp', 'go', 'rs', 'php', 'rb', 'sh', 'bash',
    'zsh', 'fish', 'sql', 'r', 'kt', 'swift', 'dart',
    'scala', 'lua', 'vb', 'cs', 'pl', 'pm'
  ] as CodeType[],

  office: [
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'odt', 'ods', 'odp'
  ] as OfficeType[],
};

/**
 * MIME types por categoria
 */
const MIME_TYPES: Record<string, FileType> = {
  // PDF
  'application/pdf': 'pdf',

  // Imagens
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/bmp': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/x-icon': 'image',
  'image/tiff': 'image',

  // Vídeos
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/ogg': 'video',
  'video/quicktime': 'video',
  'video/x-msvideo': 'video',
  'video/x-matroska': 'video',

  // Áudio
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'audio/aac': 'audio',
  'audio/flac': 'audio',
  'audio/x-m4a': 'audio',

  // Texto
  'text/plain': 'text',
  'text/markdown': 'text',
  'text/html': 'text',
  'text/css': 'text',
  'text/javascript': 'code',
  'application/json': 'text',
  'application/xml': 'text',
  'text/xml': 'text',

  // Office
  'application/msword': 'office',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'office',
  'application/vnd.ms-excel': 'office',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'office',
  'application/vnd.ms-powerpoint': 'office',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'office',
};

/**
 * Extrai a extensão de um filename ou URL
 */
function getExtension(filename: string): string | null {
  const parts = filename.split('.');
  if (parts.length < 2) return null;
  const ext = parts.pop()?.toLowerCase();
  return ext || null;
}

/**
 * Detecta o tipo de arquivo baseado na extensão
 */
export function detectFileTypeByExtension(extension: string): FileType {
  const ext = extension.toLowerCase().replace(/^\./, '');

  if (FILE_EXTENSIONS.pdf.includes(ext as any)) return 'pdf';
  if (FILE_EXTENSIONS.image.includes(ext as ImageType)) return 'image';
  if (FILE_EXTENSIONS.video.includes(ext as VideoType)) return 'video';
  if (FILE_EXTENSIONS.audio.includes(ext as AudioType)) return 'audio';
  if (FILE_EXTENSIONS.code.includes(ext as CodeType)) return 'code';
  if (FILE_EXTENSIONS.office.includes(ext as OfficeType)) return 'office';
  if (FILE_EXTENSIONS.text.includes(ext as TextType)) return 'text';

  return 'unknown';
}

/**
 * Detecta o tipo de arquivo baseado no MIME type
 */
export function detectFileTypeByMimeType(mimeType: string): FileType {
  return MIME_TYPES[mimeType] || 'unknown';
}

/**
 * Detecta o tipo de arquivo baseado no conteúdo (header/magic bytes)
 */
export function detectFileTypeByContent(buffer: ArrayBuffer): FileType {
  const view = new DataView(buffer);
  const firstBytes = [];

  // Lê os primeiros 16 bytes
  for (let i = 0; i < Math.min(16, buffer.byteLength); i++) {
    firstBytes.push(view.getUint8(i).toString(16).padStart(2, '0'));
  }

  const signature = firstBytes.join(' ');

  // PDF
  if (signature.startsWith('25 50 44 46')) return 'pdf';

  // Imagens
  if (signature.startsWith('ff d8 ff')) return 'image'; // JPEG
  if (signature.startsWith('89 50 4e 47')) return 'image'; // PNG
  if (signature.startsWith('47 49 46 38')) return 'image'; // GIF
  if (signature.startsWith('42 4d')) return 'image'; // BMP
  if (signature.startsWith('52 49 46 46')) {
    // Verifica se é WebP
    if (buffer.byteLength > 12) {
      const webpCheck = String.fromCharCode(
        view.getUint8(8),
        view.getUint8(9),
        view.getUint8(10),
        view.getUint8(11)
      );
      if (webpCheck === 'WEBP') return 'image';
    }
    return 'unknown';
  }

  // Vídeos
  if (signature.startsWith('00 00 00') || signature.startsWith('00 00 01')) {
    return 'video'; // Possível MP4 ou similar
  }

  // Áudio
  if (signature.startsWith('49 44 33')) return 'audio'; // MP3
  if (signature.startsWith('52 49 46 46') && buffer.byteLength > 12) {
    const waveCheck = String.fromCharCode(
      view.getUint8(8),
      view.getUint8(9),
      view.getUint8(10),
      view.getUint8(11)
    );
    if (waveCheck === 'WAVE') return 'audio';
  }

  return 'unknown';
}

/**
 * Detecta o tipo de arquivo a partir de uma FileSource
 */
export async function detectFileType(
  source: FileSource,
  mimeType?: string,
  fileName?: string
): Promise<FileType> {
  // 1. Se tem MIME type, usa ele
  if (mimeType) {
    const type = detectFileTypeByMimeType(mimeType);
    if (type !== 'unknown') return type;
  }

  // 2. Se tem filename, usa a extensão
  if (fileName) {
    const ext = getExtension(fileName);
    if (ext) {
      const type = detectFileTypeByExtension(ext);
      if (type !== 'unknown') return type;
    }
  }

  // 3. Se é string (URL), tenta extrair extensão da URL
  if (typeof source === 'string') {
    const url = source;
    if (url.startsWith('data:')) {
      // Base64 com MIME type
      const match = url.match(/^data:([^;]+);/);
      if (match) {
        const type = detectFileTypeByMimeType(match[1]);
        if (type !== 'unknown') return type;
      }
    } else {
      // URL normal - tenta extrair extensão
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const queryParts = lastPart.split('?');
      const ext = getExtension(queryParts[0]);
      if (ext) {
        const type = detectFileTypeByExtension(ext);
        if (type !== 'unknown') return type;
      }
    }
  }

  // 4. Se é File object, usa type e name
  if (source instanceof File) {
    const type = detectFileTypeByMimeType(source.type);
    if (type !== 'unknown') return type;

    const ext = getExtension(source.name);
    if (ext) {
      const fileExtType = detectFileTypeByExtension(ext);
      if (fileExtType !== 'unknown') return fileExtType;
    }
  }

  // 5. Última opção - lê o conteúdo para detectar
  if (source instanceof Blob || source instanceof File) {
    try {
      const buffer = await source.arrayBuffer();
      return detectFileTypeByContent(buffer);
    } catch {
      return 'unknown';
    }
  }

  return 'unknown';
}

/**
 * Verifica se um tipo de arquivo é suportado para preview
 */
export function isFileTypeSupported(fileType: FileType): boolean {
  return fileType !== 'unknown';
}

/**
 * Retorna mensagem para tipo não suportado
 */
export function getUnsupportedMessage(fileType: FileType, fileName?: string): string {
  const name = fileName ? `"${fileName}"` : 'Este arquivo';
  const typeLabel = {
    pdf: 'PDF',
    image: 'imagem',
    video: 'vídeo',
    audio: 'áudio',
    text: 'texto',
    code: 'código',
    office: 'Office',
    unknown: 'arquivo',
  }[fileType];

  return `${name} é um ${typeLabel} mas o preview não está disponível para este formato.`;
}

/**
 * Converte FileSource para URL
 */
export function fileSourceToUrl(source: FileSource): string | Promise<string> {
  // Se já é string, retorna
  if (typeof source === 'string') {
    return source;
  }

  // Se é objeto com url
  if (typeof source === 'object' && source !== null) {
    if ('url' in source && source.url) {
      return source.url;
    }
    if ('base64' in source && source.base64) {
      return source.base64.startsWith('data:') ? source.base64 : `data:application/octet-stream;base64,${source.base64}`;
    }
  }

  // Se é Blob ou File
  if (source instanceof Blob || source instanceof File) {
    return Promise.resolve(URL.createObjectURL(source));
  }

  // Fallback
  return '';
}

/**
 * Libera URL criada por URL.createObjectURL
 */
export function revokeFileUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
