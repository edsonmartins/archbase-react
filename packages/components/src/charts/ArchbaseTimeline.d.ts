export interface ArchbaseTimelineItem {
    startTime: Date;
    endTime: Date;
    type: string;
}
export interface ArchbaseTimelineProps {
    data: any[];
    formatData: (value: any) => ArchbaseTimelineItem;
    height?: string | number;
    width?: string | number;
    scale?: number;
    decimalPlaces?: 0 | 1 | 2 | 3;
    startTime?: Date;
    endTime?: Date;
    tickRate?: number;
    itemHeight?: number;
    withGridline?: boolean;
    withOnHoverVerticalLine?: boolean;
    tickLabelAngle?: number;
    verticalLineColor?: string;
    verticalLineStrokeWidth?: number;
    verticalLineStrokeOpacity?: number;
}
export declare function ArchbaseTimeline({ data, formatData, width, height, scale: customScale, decimalPlaces, startTime, endTime, tickRate, itemHeight, withGridline, withOnHoverVerticalLine, tickLabelAngle, verticalLineColor, verticalLineStrokeWidth, verticalLineStrokeOpacity, }: ArchbaseTimelineProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseTimeline.d.ts.map