import { ArchbaseStore } from './useArchbaseStore';
import React from 'react';

const getCurrentTimeFormatted = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}


export interface ArchbaseState {

}

export type ArchbaseReducerAction<ArchbaseState> = {
  type: string
  payload: Partial<ArchbaseState>
  info?: string
}

export type ArchbaseReducer<S extends ArchbaseState,A extends ArchbaseReducerAction<S>> = (state: S, action: A) => S;

export function useArchbaseReducer<S extends ArchbaseState,A extends ArchbaseReducerAction<S>>(
  key: string,
  store: ArchbaseStore,
  initialState: S,  customReducer: ArchbaseReducer<S,A>  
) {
  // Certificando para inicializar o estado apenas uma vez, usando useEffect
  React.useEffect(() => {
    const storedState = store.getValue(key);
    if (storedState) {
      store.setValue(key, { ...initialState, ...storedState });
    } else {
      store.setValue(key, initialState);
    }
  }, []);

  const dispatch = (action: A) => {
    const currentState = store.getValue(key);
    const newState = customReducer(currentState, action);
    store.setValue(key, newState);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.group(`%cAction: %c${action.type} %cat ${getCurrentTimeFormatted()}`, "color: lightgreen; font-weight: bold;", "color: white; font-weight: bold;", "color: lightblue; font-weight: lighter;");
      console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", currentState);
      console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
      console.log("%cNext State:", "color: #47B04B; font-weight: 700;", newState);
      console.groupEnd();
    }    
  };

  const state : S = store.getValue(key) || initialState;

  return { dispatch, state };
};


