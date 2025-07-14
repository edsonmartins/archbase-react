import React from 'react';
interface InputProps extends React.InputHTMLAttributes<any> {
    onInputChangedEnd?: Function;
    onChangedDelayed?: Function;
    onChangedValue?: Function;
    delayMs?: number;
}
declare const Input: React.MemoExoticComponent<(props: React.InputHTMLAttributes<any> | InputProps) => import("react/jsx-runtime").JSX.Element>;
export default Input;
//# sourceMappingURL=Input.d.ts.map