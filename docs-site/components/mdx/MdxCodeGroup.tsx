'use client';

import React, { useState } from 'react';
import { Tabs, Code, Group, Text, useMantineColorScheme, CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './MdxCodeGroup.module.css';

interface CodeTabProps {
  label: string;
  children: string;
}

interface CodeGroupProps {
  children: React.ReactNode;
}

function CodeTab({ label, children }: CodeTabProps) {
  const { colorScheme } = useMantineColorScheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cx(classes.codeTab, classes[colorScheme])}>
      <Group justify="space-between" className={classes.header} px="md" py="xs">
        <Text size="sm" fw={500}>{label}</Text>
        <CopyButton value={children.trim()}>
          {(props) => (
            <Tooltip label={copied ? 'Copiado!' : 'Copiar'} withArrow position="right">
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <pre className={classes.pre}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function MdxCodeGroup({ children }: CodeGroupProps) {
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> =>
      React.isValidElement(child) && child.type === CodeTab
  );

  if (tabs.length === 0) {
    return <>{children}</>;
  }

  return (
    <Tabs defaultValue={tabs[0].props.label} variant="none" className={classes.tabs}>
      <Tabs.List className={classes.tabList}>
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.props.label}
            value={tab.props.label}
            leftSection={<Code className={classes.tabCode}>{tab.props.label}</Code>}
          >
            {tab.props.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel key={tab.props.label} value={tab.props.label}>
          <CodeTab {...tab.props} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

MdxCodeGroup.Tab = CodeTab;
