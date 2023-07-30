import { Select } from "@mantine/core";
import { ArchbaseDataSource } from "components/datasource";
import React, { CSSProperties, FocusEventHandler, useState } from "react";

export interface ArchbaseAsyncSelectProps<T,ID> {
    allowDeselect?: boolean;
    clearable?: boolean;
    dataSource?: ArchbaseDataSource<T, ID>;
    dataField?: string;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties;
    placeholder?: string;
    label?: string;
    description?: string;
    error?: string;
    onFocusExit?: FocusEventHandler<T> | undefined;
    onFocusEnter?: FocusEventHandler<T> | undefined;
    initialOptions?: T[]; 
    getOptionLabel: (option : T) => string;
    getOptionValue: (option : T) => any;
    getOptions?: (page : number, value: string) => Promise<T>;
}
function buildOptions<T>(initialOptions : T[],getOptionLabel:(option : T) => string,getOptionValue:(option : T) => any) : any{
    if (!initialOptions){
        return [];
    }
    return initialOptions.map((item: T)=>{
        return {label: getOptionLabel(item), value: getOptionValue(item), origin: item};
    })
}

export function ArchbaseAsyncSelect<T,ID>({allowDeselect=true,clearable=true,dataSource,dataField,disabled=false,readOnly=false,
initialOptions=[], getOptionLabel, getOptionValue, getOptions}: ArchbaseAsyncSelectProps<T,ID>) {
    const [options, setOptions] = useState<any[]>(buildOptions<T>(initialOptions,getOptionLabel,getOptionValue));

    return <Select  maxDropdownHeight={280} data={options} />
}