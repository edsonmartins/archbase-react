/**
 * Handle component
 */
export default class Handle {
    /**
     * Creates a new Handle instance.
     * @constructor
     * @param {Array} position The x and y ratio position of the handle
     *      within the crop region. Accepts a value between 0 to 1 in the order
     *      of [X, Y].
     * @param {Array} constraints Define the side of the crop region that
     *      is to be affected by this handle. Accepts a value of 0 or 1 in the
     *      order of [TOP, RIGHT, BOTTOM, LEFT].
     * @param {String} cursor The CSS cursor of this handle.
     * @param {Element} eventBus The element to dispatch events to.
     */
    position: any;
    constraints: any;
    cursor: any;
    eventBus: any;
    el: any;
    constructor(position: any, constraints: any, cursor: any, eventBus: any);
}
//# sourceMappingURL=handle.d.ts.map