'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconAdjustments, IconCode, IconFileText } from '@tabler/icons-react';
import { Container, Tabs } from '@mantine/core';
import { PropsTablesList } from '../PropsTable';
import { StylesApiTablesList } from '../StylesApiTable';
import { TableOfContents } from '../TableOfContents';
import classes from './DocsTabs.module.css';

interface DocsTabsProps {
  children: React.ReactNode;
  docgen?: Record<string, any>;
  stylesApiData?: Record<string, any>;
  componentsProps?: string[];
  componentsStyles?: string[];
}

export function DocsTabs({
  children,
  docgen,
  componentsProps,
  componentsStyles,
  stylesApiData,
}: DocsTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('docs');
  const hasProps = Array.isArray(componentsProps) && componentsProps.length > 0 && docgen;
  const hasStyles = Array.isArray(componentsStyles) && componentsStyles.length > 0 && stylesApiData;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveTab(window.location.search.replace('?t=', '') || 'docs');
    }
  }, []);

  // Se não tem props nem styles, renderiza só o conteúdo
  if (!hasProps && !hasStyles) {
    return (
      <Container size="lg">
        <div className={classes.tabContent} data-main>
          <div className={classes.main} id="mdx">
            {children}
          </div>
          <div className={classes.tableOfContents}>
            <TableOfContents />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Tabs
      variant="pills"
      value={activeTab}
      classNames={{ root: classes.root, list: classes.tabsList, tab: classes.tab }}
      keepMounted={false}
      radius="md"
      onChange={(value) => {
        router.replace(value === 'docs' ? router.pathname : `${router.pathname}?t=${value}`, undefined, { shallow: true });
        setActiveTab(value!);
      }}
    >
      <div className={classes.tabsWrapper}>
        <Container size="lg">
          <Tabs.List>
            <Tabs.Tab value="docs">
              <div className={classes.tabInner}>
                <IconFileText size={20} stroke={1.5} className={classes.tabIcon} />
                Documentação
              </div>
            </Tabs.Tab>
            {hasProps && (
              <Tabs.Tab value="props">
                <div className={classes.tabInner}>
                  <IconCode size={20} stroke={1.5} className={classes.tabIcon} />
                  Props
                </div>
              </Tabs.Tab>
            )}
            {hasStyles && (
              <Tabs.Tab value="styles-api">
                <div className={classes.tabInner}>
                  <IconAdjustments size={20} stroke={1.5} className={classes.tabIcon} />
                  Styles API
                </div>
              </Tabs.Tab>
            )}
          </Tabs.List>
        </Container>
      </div>

      <Container size="lg">
        <Tabs.Panel value="docs">
          <div className={classes.tabContent} data-main>
            <div className={classes.main} id="mdx">
              {children}
            </div>
            <div className={classes.tableOfContents}>
              <TableOfContents />
            </div>
          </div>
        </Tabs.Panel>

        {hasProps && (
          <Tabs.Panel value="props">
            <div className={classes.tabContent}>
              <PropsTablesList components={componentsProps!} data={docgen!} />
            </div>
          </Tabs.Panel>
        )}

        {hasStyles && (
          <Tabs.Panel value="styles-api">
            <div className={classes.tabContent}>
              <StylesApiTablesList data={stylesApiData!} components={componentsStyles!} />
            </div>
          </Tabs.Panel>
        )}
      </Container>
    </Tabs>
  );
}
