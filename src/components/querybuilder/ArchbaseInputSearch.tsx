import React, { Component } from 'react';
import { ActionIcon, Input, MantineTheme, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface ArchbaseInputSearchProps {
  placeholder?: string | undefined;
  theme: MantineTheme;
  onSearchClick?: () => void;
}

export class ArchbaseInputSearch extends Component<ArchbaseInputSearchProps> {
  render() {
    const { theme, onSearchClick } = this.props;
    return (
      <Input
        placeholder={this.props.placeholder}
        style={{ width: '100%' }}
        rightSection={
          <Tooltip label={'Localizar'}>
            <ActionIcon
              sx={{
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors[theme.primaryColor][5]
                    : theme.colors[theme.primaryColor][6],
              }}
              tabIndex={-1}
              variant="filled"
              onClick={onSearchClick}
            >
              <IconSearch />
            </ActionIcon>
          </Tooltip>
        }
      ></Input>
    );
  }
}
