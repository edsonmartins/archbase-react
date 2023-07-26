import * as React from 'react';
import { useArchbaseBool } from './useArchbaseBool';

import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

describe('useBool', () => {
  it('should use initial value creator function', async () => {
    let value: boolean;
    const HookComponent: React.FunctionComponent<{ initialValue: boolean }> = ({
      initialValue
    }) => {
      [value] = useArchbaseBool(() => initialValue);
      return <div />;
    };

    render(<HookComponent initialValue={true} />);
    expect(value!).toBe(true);

    render(<HookComponent initialValue={false} />);
    expect(value!).toBe(false);
  });

  it('change value when calling toggle()', () => {
    let value: boolean;
    let toggle: () => void = () => {};

    const HookComponent = () => {
      [value, toggle] = useArchbaseBool(() => true);
      return <div />;
    };

    render(<HookComponent />);
    act(() => {
      toggle();
    });

    expect(value!).toBe(false);

    act(() => {
      toggle();
    });
    expect(value!).toBe(true);
  });

  it('change value when calling setValue()', () => {
    let value: boolean;
    let setValue: (value: boolean) => void = () => {};

    const HookComponent = () => {
      [value, , setValue] = useArchbaseBool(() => true);
      return <div />;
    };

    render(<HookComponent />);
    act(() => {
      setValue(false);
    });

    expect(value!).toBe(false);

    act(() => {
      setValue(true);
    });
    expect(value!).toBe(true);
  });
});
