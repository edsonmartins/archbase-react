import { Box, ColorInput, ColorPicker, Flex, Popover, Text } from '@mantine/core';
import React, { useState } from 'react';
import { generateColors } from '@components/core/utils';

interface ArchbaseThemeColorProps {
  label: string;
  placeholder: string;
}

export function ArchbaseThemeColor({ label, placeholder }: ArchbaseThemeColorProps) {
  const [color, setColor] = useState('');
  const [colors, setColors] = useState(['', '', '', '', '', '', '', '', '', '']);

  const paletteAccents = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const borderRadius = (accent) => {
    if (accent === 50) {
      return '0.25rem 0 0 0';
    }
    if (accent === 400) {
      return '0 0.25rem 0 0';
    }
    if (accent === 500) {
      return '0 0 0 0.25rem';
    }
    if (accent === 900) {
      return '0 0 0.25rem 0';
    }

    return '0';
  };

  const handleChange = (currentColor) => {
    setColor(currentColor);
    setColors([...generateColors(currentColor)]);
    console.log(colors);
  };

  return (
    <>
      <Flex>
        <Text>{label}</Text>
      </Flex>
      <Flex justify={'space-between'} align={'center'}>
        <Popover trapFocus position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Box w={'2rem'} h={'2rem'} bg={color} sx={{ borderRadius: '1rem' }}></Box>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker value={color} onChange={setColor} />
          </Popover.Dropdown>
        </Popover>

        <ColorInput placeholder={placeholder} withPreview={false} value={color} onChange={handleChange} w={'7rem'} />
        <Flex direction={'column'}>
          <Flex>
            {paletteAccents.slice(0, 5).map((accent, index) => (
              <Flex
                justify={'center'}
                align={'center'}
                w={'2.5rem'}
                h={'1.5rem'}
                bg={colors[index]}
                key={accent}
                sx={{ borderRadius: borderRadius(accent) }}
              >
                {accent}
              </Flex>
            ))}
          </Flex>
          <Flex>
            {paletteAccents.slice(5).map((accent, index) => (
              <Flex
                justify={'center'}
                align={'center'}
                w={'2.5rem'}
                h={'1.5rem'}
                bg={colors[index + 5]}
                key={accent}
                sx={{ borderRadius: borderRadius(accent) }}
              >
                {accent}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
