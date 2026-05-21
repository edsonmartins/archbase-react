export interface ArchbaseImagePickerConf {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  aspectRatio?: number | null;
  objectFit?: "cover" | "contain" | "fill" | "revert" | "scale-down";
  compressInitial?: number | undefined | null;
  hideDeleteBtn?: boolean;
  hideDownloadBtn?: boolean;
  hideEditBtn?: boolean;
  hideAddBtn?: boolean;
  showImageSize?: boolean;
  onChangeImage?: (image: string|undefined) => void;
  imageBackgroundColor?: string;
  /** Largura máxima da imagem em pixels (redimensiona automaticamente se exceder) */
  maxWidth?: number;
  /** Altura máxima da imagem em pixels (redimensiona automaticamente se exceder) */
  maxHeight?: number;
  /** Tamanho máximo da imagem em KB (recomprime se exceder) */
  maxSizeKb?: number;
  /**
   * Preserva a transparência (canal alfa) da imagem enviada.
   * Quando true:
   *  - desabilita a compressão automática (compressInitial é forçado para null),
   *    impedindo que a biblioteca subjacente reencodifique PNG/WebP como JPEG.
   *  - força o mime de saída para PNG (ou WebP, se a origem já for WebP) ao
   *    redimensionar via maxWidth/maxHeight/maxSizeKb.
   * Default: false.
   */
  preserveTransparency?: boolean;
}

export interface IState {
  quality: number;
  maxHeight: number;
  maxWidth: number;
  cropHeight: number;
  cropWidth: number;
  maintainAspectRatio: boolean;
  format: string;
  arrayCopiedImages: Array<ICacheData>;
  originImageSrc: string | null | undefined;
  basicFilters?: IBasicFilterState;
}

export interface ICacheData {
  lastImage: string;
  originImageSrc: string;
  width: number;
  height: number;
  quality: number;
  format: string;
  basicFilters?: IBasicFilterState | null | undefined;
}

export interface IBasicFilterState {
  contrast: number;
  blur: number;
  brightness: number;
  grayscale: number;
  invert: number;
  saturate: number;
  sepia: number;
}
