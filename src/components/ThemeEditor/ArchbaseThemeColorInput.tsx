import { Box, ColorInput, ColorPicker, Popover } from '@mantine/core';
import React from 'react';

interface ArchbaseThemeColorInputProps {
  handleChange: (color: string) => void;
  value: string;
  placeholder: string;
}

export function ArchbaseThemeColorInput({ handleChange, value, placeholder }: ArchbaseThemeColorInputProps) {
  return (
    <>
      <Popover trapFocus position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Box w={'2rem'} h={'2rem'} bg={value} sx={{ borderRadius: '1rem' }}></Box>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker value={value} onChange={handleChange} />
        </Popover.Dropdown>
      </Popover>
      <ColorInput placeholder={placeholder} withPreview={false} value={value} onChange={handleChange} w={'7rem'} />
    </>
  );
}
