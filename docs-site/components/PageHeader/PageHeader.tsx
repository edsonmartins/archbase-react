import React from 'react';
import { IconBook, IconBrandNpm, IconLicense, IconPackage, IconUserCode } from '@tabler/icons-react';
import { Badge, Container, Text, Title } from '@mantine/core';
import { GithubIcon } from '@mantinex/dev-icons';
import { PageHeaderLink } from './PageHeaderLink/PageHeaderLink';
import classes from './PageHeader.module.css';

export interface PageHeaderData {
  title: string;
  description: string;
  source?: string;
  package?: string;
  docsLink?: string;
  sourceUrl?: string;
  npmUrl?: string;
  license?: string;
  version?: string;
}

interface PageHeaderProps {
  data: PageHeaderData;
}

export function PageHeader({ data }: PageHeaderProps) {
  return (
    <header className={classes.root}>
      <Container size="lg">
        <Title className={classes.title}>{data.title}</Title>
        <Text className={classes.description}>{data.description}</Text>

        <div className={classes.links}>
          {data.version && (
            <PageHeaderLink label="Version" icon={<IconPackage size={18} stroke={1.5} />}>
              <Badge size="sm" variant="light" suppressHydrationWarning>v{data.version}</Badge>
            </PageHeaderLink>
          )}

          {data.sourceUrl && (
            <PageHeaderLink
              label="Source"
              icon={<GithubIcon size={16} />}
              link={data.sourceUrl}
            >
              View source code
            </PageHeaderLink>
          )}

          {data.npmUrl && (
            <PageHeaderLink
              label="Package"
              icon={<IconBrandNpm size={18} stroke={1.5} />}
              link={data.npmUrl}
            >
              {data.package || 'npm'}
            </PageHeaderLink>
          )}

          {data.docsLink && (
            <PageHeaderLink
              label="Docs"
              icon={<IconBook size={18} stroke={1.5} />}
              link={data.docsLink}
            >
              Documentação
            </PageHeaderLink>
          )}

          <PageHeaderLink
            label="License"
            icon={<IconLicense size={18} stroke={1.5} />}
            link="https://github.com/edsonmartins/archbase-react/blob/main/LICENSE"
          >
            MIT
          </PageHeaderLink>
        </div>
      </Container>
    </header>
  );
}
