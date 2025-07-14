import React, { FC } from 'react';
export type RangeOption = {
    label: string;
    value: string;
    rangeFunction: (current: Date) => {
        start: Date;
        end: Date;
    };
};
export type ArchbaseTimeRangeSelectorRef = {
    updateCurrentRange: () => {
        start: Date | null;
        end: Date | null;
    };
    getCurrentRange: () => {
        selectedValue: string | null;
        range: {
            start: Date | null;
            end: Date | null;
        };
    };
};
export type ArchbaseTimeRangeSelectorProps = {
    ranges: RangeOption[];
    onRangeChange?: (selectedValue: string | null, range: {
        start: Date | null;
        end: Date | null;
    }) => void;
    defaultRangeValue?: string | null;
    defaultDateRange?: {
        start: Date | null;
        end: Date | null;
    };
    label?: string;
    popoverTitle?: string;
    width?: number | string;
    position?: 'bottom' | 'top' | 'left' | 'right';
    componentRef?: React.MutableRefObject<ArchbaseTimeRangeSelectorRef>;
};
export declare const ArchbaseTimeRangeSelector: FC<ArchbaseTimeRangeSelectorProps>;
//# sourceMappingURL=ArchbaseTimeRangeSelector.d.ts.map