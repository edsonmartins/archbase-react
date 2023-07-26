import * as React from 'react';
import ArchbaseJsonViewDataRender, { JsonRenderProps } from './ArchbaseJsonViewDataRenderer';
import { allExpanded, collapseAllNested } from './index';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const commonProps: JsonRenderProps<any> = {
  lastElement: false,
  level: 0,
  style: {
    container: '',
    basicChildStyle: '',
    expander: '',
    label: '',
    nullValue: '',
    undefinedValue: '',
    numberValue: '',
    stringValue: '',
    booleanValue: '',
    otherValue: '',
    punctuation: '',
    pointer: ''
  },
  shouldInitiallyExpand: allExpanded,
  value: undefined,
  field: undefined
};

const collapseAll = () => false;

describe('DataRender', () => {
  it('should render booleans: true', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: true }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('should render booleans: false', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: false }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('should render strings', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: 'string' }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText(`"string"`)).toBeInTheDocument();
  });

  it('should render numbers', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: 42 }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render bigints', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: BigInt(42) }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('42n')).toBeInTheDocument();
  });

  it('should render nulls', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: null }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('should render undefineds', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: undefined }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('undefined')).toBeInTheDocument();
  });

  it('should render unknown types', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: Symbol('2020') }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
  });

  it('should render arrays', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={[1, 2, 3]} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render arrays with key', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ array: [1, 2, 3] }} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render nested objects', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ obj: { test: 123 } }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render nested objects collapsed', () => {
    render(
      <ArchbaseJsonViewDataRender
        {...commonProps}
        value={{ obj: { test: 123 } }}
        shouldInitiallyExpand={collapseAllNested}
      />
    );
    expect(screen.getByText(/obj/)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  it('should render nested objects collapsed and expand it once property changed', () => {
    const { rerender } = render(
      <ArchbaseJsonViewDataRender
        {...commonProps}
        value={{ obj: { test: 123 } }}
        shouldInitiallyExpand={collapseAllNested}
      />
    );
    expect(screen.getByText(/obj/)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();

    rerender(
      <ArchbaseJsonViewDataRender
        {...commonProps}
        value={{ obj: { test: 123 } }}
        shouldInitiallyExpand={allExpanded}
      />
    );
    expect(screen.getByText(/obj/)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).toBeInTheDocument();
    expect(screen.queryByText('123')).toBeInTheDocument();
  });

  it('should render nested arrays collapsed', () => {
    render(
      <ArchbaseJsonViewDataRender
        {...commonProps}
        value={{ test: [123] }}
        shouldInitiallyExpand={collapseAllNested}
      />
    );
    expect(screen.queryByText(/test/)).toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  it('should render nested arrays collapsed and expand it once property changed', () => {
    const { rerender } = render(
      <ArchbaseJsonViewDataRender
        {...commonProps}
        value={{ test: [123] }}
        shouldInitiallyExpand={collapseAllNested}
      />
    );
    expect(screen.queryByText(/test/)).toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();

    rerender(
      <ArchbaseJsonViewDataRender {...commonProps} value={{ test: [123] }} shouldInitiallyExpand={allExpanded} />
    );
    expect(screen.queryByText(/test/)).toBeInTheDocument();
    expect(screen.queryByText('123')).toBeInTheDocument();
  });

  it('should render top arrays collapsed', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={[123]} shouldInitiallyExpand={collapseAll} />);
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  it('should collapse ojbects', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={{ test: true }} />);
    expect(screen.getByText(/test/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('\u25BE'));
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('\u25B8'));
    expect(screen.getByText(/test/)).toBeInTheDocument();
  });

  it('should collapse arrays', () => {
    render(<ArchbaseJsonViewDataRender {...commonProps} value={[1, 2, 3]} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('\u25BE'));
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('\u25B8'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should expand objects by clicking on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={{ test: true }} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('...'));
    expect(screen.getByText(/test/)).toBeInTheDocument();
  });

  it('should expand objects by pressing Spacebar on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={{ test: true }} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByText('...'), { key: ' ', code: 'Space' });

    expect(screen.getByText(/test/)).toBeInTheDocument();
  });

  it('should not expand objects by pressing other keys on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={{ test: true }} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByText('...'), { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
  });

  it('should expand arrays by clicking on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={['test', 'array']} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText(/array/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('...'));
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText(/array/)).toBeInTheDocument();
  });

  it('should expand arrays by pressing Spacebar on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={['test', 'array']} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText(/array/)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByText('...'), { key: ' ', code: 'Space' });

    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText(/array/)).toBeInTheDocument();
  });

  it('should not expand arrays by pressing other keys on', () => {
    render(
      <ArchbaseJsonViewDataRender {...commonProps} value={['test', 'array']} shouldInitiallyExpand={collapseAll} />
    );
    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText(/array/)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByText('...'), { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/.../)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toBeInTheDocument();
    expect(screen.queryByText(/array/)).not.toBeInTheDocument();
  });
});
