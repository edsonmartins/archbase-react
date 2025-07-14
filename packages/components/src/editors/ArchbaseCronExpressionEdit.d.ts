interface ArchbaseCronExpressionEditProps {
    /** The current cron expression value */
    value: string;
    /** Callback function to handle changes in the cron expression */
    onChange: (newValue: string) => void;
    /** Label for the input field */
    label?: string;
    /** Error message to display (if any) */
    error?: string;
    /** Whether the component is in a read-only state */
    readOnly?: boolean;
    /** Placeholder text for the input field */
    placeholder?: string;
}
export declare function ArchbaseCronExpressionEdit({ value, onChange, label, error, readOnly, placeholder }: ArchbaseCronExpressionEditProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ArchbaseCronExpressionEdit.d.ts.map