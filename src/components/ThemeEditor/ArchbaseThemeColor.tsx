import { Box, ColorInput, ColorPicker, Flex, MantineThemeColorsOverride, Popover, Text } from '@mantine/core';
import React from 'react';
import { generateColors } from '@components/core/utils';
import { OriginColor } from './ArchbaseThemeEditorCommon';

interface ArchbaseThemeColorProps {
  label: string;
  placeholder: string;
  onChangeValue?: (colors: MantineThemeColorsOverride, originColor: OriginColor) => void;
  initialColors: MantineThemeColorsOverride;
  initialOriginColor: string;
}

export function ArchbaseThemeColor({
  label,
  placeholder,
  onChangeValue,
  initialColors = ['', '', '', '', '', '', '', '', '', ''],
  initialOriginColor,
}: ArchbaseThemeColorProps) {
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

  const handleChange = (currentColor: string) => {
    const currentColors = { [label]: [...generateColors(currentColor)] };
    if (onChangeValue) {
      onChangeValue(currentColors, { [label]: currentColor });
    }
  };

  return (
    <>
      <Flex>
        <Text>{label}</Text>
      </Flex>
      <Flex justify={'space-between'} align={'center'}>
        <Popover trapFocus position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Box w={'2rem'} h={'2rem'} bg={initialOriginColor} sx={{ borderRadius: '1rem' }}></Box>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker value={initialOriginColor} onChange={handleChange} />
          </Popover.Dropdown>
        </Popover>

        <ColorInput
          placeholder={placeholder}
          withPreview={false}
          value={initialOriginColor}
          onChange={handleChange}
          w={'7rem'}
        />
        <Flex direction={'column'}>
          <Flex>
            {paletteAccents.slice(0, 5).map((accent, index) => (
              <Flex
                justify={'center'}
                align={'center'}
                w={'2.5rem'}
                h={'1.5rem'}
                bg={initialColors[index]}
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
                bg={initialColors[index + 5]}
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
