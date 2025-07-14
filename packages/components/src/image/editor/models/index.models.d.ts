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
    onChangeImage?: (image: string | undefined) => void;
    imageBackgroundColor?: string;
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
//# sourceMappingURL=index.models.d.ts.map