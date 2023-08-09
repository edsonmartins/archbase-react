import React from 'react';
import {ArchbaseScreenClassProvider, ArchbaseScreenClassContext, NO_PROVIDER_FLAG } from '../ScreenClassProvider';

export const ArchbaseScreenClassResolver = ({ children }) => (
  <ArchbaseScreenClassContext.Consumer>
    {(screenClassCheck) => {
      if (screenClassCheck === NO_PROVIDER_FLAG) {
        return (
          <ArchbaseScreenClassProvider>
            <ArchbaseScreenClassContext.Consumer>
              {(screenClassResolved) => children(screenClassResolved)}
            </ArchbaseScreenClassContext.Consumer>
          </ArchbaseScreenClassProvider>
        );
      }
      return children(screenClassCheck);
    }}
  </ArchbaseScreenClassContext.Consumer>
);

