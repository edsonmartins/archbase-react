import React from 'react';
import { Box, Text } from '@mantine/core';
import classes from './PageHeaderLink.module.css';

interface PageHeaderLinkProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  link?: string;
}

export function PageHeaderLink({ icon, label, children, link }: PageHeaderLinkProps) {
  return (
    <div className={classes.root}>
      <Box className={classes.icon}>{icon}</Box>
      <div className={classes.body}>
        <Text className={classes.label}>{label}</Text>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className={classes.link}>
            {children}
          </a>
        ) : (
          <Text className={classes.value}>{children}</Text>
        )}
      </div>
    </div>
  );
}
