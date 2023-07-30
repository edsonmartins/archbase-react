// ArchbaseEdit.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ArchbaseEdit, ArchbaseEditProps } from './ArchbaseEdit';

const mockDataSource = {
  getFieldValue: jest.fn(),
  setFieldValue: jest.fn(),
  addListener: jest.fn(),
  addFieldChangeListener: jest.fn(),
  isBrowsing: jest.fn(),
};

const mockProps: ArchbaseEditProps<any> = {
  dataSource: mockDataSource,
  dataField: 'fieldName',
  disabled: false,
  readOnly: false,
  style: {},
  placeholder: 'Placeholder',
  label: 'Label',
  description: 'Description',
  error: 'Error',
  onFocusExit: jest.fn(),
  onFocusEnter: jest.fn(),
  onChangeValue: jest.fn(),
};

test('renders ArchbaseEdit component', () => {
  const { getByLabelText } = render(<ArchbaseEdit {...mockProps} />);
  const inputElement = getByLabelText('Label');
  expect(inputElement).toBeInTheDocument();
});

test('calls onChangeValue and dataSource.setFieldValue when input value changes', () => {
  const { getByLabelText } = render(<ArchbaseEdit {...mockProps} />);
  const inputElement = getByLabelText('Label');

  fireEvent.change(inputElement, { target: { value: 'New Value' } });

  expect(mockProps.onChangeValue).toHaveBeenCalled();
  expect(mockProps.dataSource?.setFieldValue).toHaveBeenCalled();
});

test('calls onFocusEnter and onFocusExit when input is focused and blurred', () => {
  const { getByLabelText } = render(<ArchbaseEdit {...mockProps} />);
  const inputElement = getByLabelText('Label');

  fireEvent.focus(inputElement);
  expect(mockProps.onFocusEnter).toHaveBeenCalled();

  fireEvent.blur(inputElement);
  expect(mockProps.onFocusExit).toHaveBeenCalled();
});
