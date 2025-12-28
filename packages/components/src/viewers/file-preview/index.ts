/**
 * ArchbaseFilePreviewer - File Preview Component
 *
 * Preview de múltiplos tipos de arquivo:
 * - PDF
 * - Imagens (JPEG, PNG, GIF, SVG, etc)
 * - Vídeos (MP4, WebM, OGG, etc)
 * - Áudio (MP3, WAV, OGG, etc)
 * - Texto/Código (TXT, MD, JSON, XML, etc)
 */

// Main component
export { ArchbaseFilePreviewer } from './ArchbaseFilePreviewer';

// Types
export type {
  ArchbaseFilePreviewerProps,
  FileSource,
  FileType,
  FileRendererProps,
  ImageType,
  VideoType,
  AudioType,
  TextType,
  CodeType,
  OfficeType,
  LayoutMode,
  LoadingState,
  PreviewError,
  ToolbarActions,
} from './ArchbaseFilePreviewer.types';

// Utils
export {
  detectFileType,
  detectFileTypeByExtension,
  detectFileTypeByMimeType,
  detectFileTypeByContent,
  isFileTypeSupported,
  getUnsupportedMessage,
  fileSourceToUrl,
  revokeFileUrl,
} from './utils/fileTypeDetector';
