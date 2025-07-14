/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 *
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 *
 * (C) 2017 James Ooi. Released under the MIT License.
 */
import CropprCore from "./core";
/**
 * This class is a wrapper for CropprCore that merely implements the main
 * interfaces for the Croppr instance. Look into CropprCore for all the
 * main logic.
 */
export default class Croppr extends CropprCore {
    /**
     * @constructor
     * Calls the CropprCore's constructor.
     */
    constructor(element: any, options: any, _deferred?: boolean);
    /**
     * Gets the value of the crop region.
     * @param {String} [mode] Which mode of calculation to use: 'real', 'ratio' or
     *      'raw'.
     */
    getValue(mode?: any): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Changes the image src.
     * @param {String} src
     */
    setImage(src: any): this;
    /**
     * Destroys the Croppr instance
     */
    destroy(): void;
    /**
     * Moves the crop region to a specified coordinate.
     * @param {Number} x
     * @param {Number} y
     */
    moveTo(x: any, y: any): this;
    /**
     * Resizes the crop region to a specified width and height.
     * @param {Number} width
     * @param {Number} height
     * @param {Array} origin The origin point to resize from.
     *      Defaults to [0.5, 0.5] (center).
     */
    resizeTo(width: any, height: any, origin?: number[]): this;
    /**
     * Scale the crop region by a factor.
     * @param {Number} factor
     * @param {Array} origin The origin point to resize from.
     *      Defaults to [0.5, 0.5] (center).
     */
    scaleBy(factor: any, origin?: number[]): this;
    /**
     * Resets the crop region to the initial settings.
     */
    reset(newOptions?: any): this;
    enableVisibility(state: boolean): void;
}
//# sourceMappingURL=croppr.d.ts.map