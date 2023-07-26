import { ArchbaseDataSource } from "components/datasource";
import React from "react";

export interface ArchbaseCheckBoxProps<T,ID> {
    styles: React.CSSProperties;
    trueValue: any; 
    falseValue: any; 
    dataSource?: ArchbaseDataSource<T, ID>
    dataField?: string
}

export function ArchbaseCheckBox<T,ID>(_props: ArchbaseCheckBoxProps<T,ID>) {
    return <div></div>
}