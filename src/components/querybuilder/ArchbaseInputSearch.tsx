import React, { Component } from 'react';
import { ActionIcon, Input, MantineTheme, Tooltip, Variants } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface ArchbaseInputSearchProps {
  placeholder?: string | undefined;
  theme: MantineTheme;
  onSearchClick?: () => void;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
}

export class ArchbaseInputSearch extends Component<ArchbaseInputSearchProps> {
  render = () => {
    const { theme, onSearchClick, variant } = this.props;

    return (
      <Input
        placeholder={this.props.placeholder}
        style={{ width: '100%' }}
        rightSection={
          <Tooltip withinPortal withArrow label={'Localizar'}>
            <ActionIcon
              sx={{
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors[theme.primaryColor][5]
                    : theme.colors[theme.primaryColor][6],
              }}
              tabIndex={-1}
              variant={variant}
              onClick={onSearchClick}
            >
              <IconSearch size="1rem" />
            </ActionIcon>
          </Tooltip>
        }
      ></Input>
    );
  };
}
