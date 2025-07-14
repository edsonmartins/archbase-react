/**
 * CropprCore
 * Here lies the main logic.
 */
import Box from "./box";
/**
 * Core class for Croppr containing most of its functional logic.
 */
export default class CropprCore {
    options: any;
    _initialized: any;
    _restore: any;
    cropperEl: any;
    box: any;
    containerEl: any;
    imageEl: any;
    eventBus: any;
    imageClippedEl: any;
    regionEl: HTMLElement;
    overlayEl: any;
    handles: any;
    activeHandle: any;
    currentMove: any;
    constructor(element: any, options: any, deferred?: boolean);
    /**
     * Initialize the Croppr instance
     */
    initialize(element: any): void;
    /**
     * Create Croppr's DOM elements
     */
    createDOM(targetEl: any): void;
    /**
     * Changes the image src.
     * @param {String} src
     */
    setImage(src: any): this;
    /**
     * Destroy the Croppr instance and replace with the original element.
     */
    destroy(): void;
    /**
     * Create a new box region with a set of options.
     * @param {Object} opts The options.
     * @returns {Box}
     */
    initializeBox(opts: any): Box;
    /**
     * Draw visuals (border, handles, etc) for the current box.
     */
    redraw(): void;
    /**
     * Attach listeners for events emitted by the handles.
     * Enables resizing of the region element.
     */
    attachHandlerEvents(): void;
    /**
     * Attach event listeners for the crop region element.
     * Enables dragging/moving of the region element.
     */
    attachRegionEvents(): void;
    /**
     * Attach event listeners for the overlay element.
     * Enables the creation of a new selection by dragging an empty area.
     */
    attachOverlayEvents(): void;
    /**
     * EVENT HANDLER
     * Executes when user begins dragging a handle.
     */
    onHandleMoveStart(e: any): void;
    /**
     * EVENT HANDLER
     * Executes on handle move. Main logic to manage the movement of handles.
     */
    onHandleMoveMoving(e: any): void;
    /**
     * EVENT HANDLER
     * Executes on handle move end.
     */
    onHandleMoveEnd(e: any): void;
    /**
     * EVENT HANDLER
     * Executes when user starts moving the crop region.
     */
    onRegionMoveStart(e: any): void;
    /**
     * EVENT HANDLER
     * Executes when user moves the crop region.
     */
    onRegionMoveMoving(e: any): void;
    /**
     * EVENT HANDLER
     * Executes when user stops moving the crop region (mouse up).
     */
    onRegionMoveEnd(e: any): void;
    /**
     * Calculate the value of the crop region.
     */
    getValue(mode?: any): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Parse user options and set default values.
     */
    static parseOptions(opts: any): {
        aspectRatio: any;
        maxSize: any;
        minSize: any;
        startSize: any;
        returnMode: any;
        onInitialize: any;
        onCropStart: any;
        onCropMove: any;
        onCropEnd: any;
        convertToPixels: (this: any, container: any) => void;
    };
}
//# sourceMappingURL=core.d.ts.map