import { Anchor, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import type { LinkRendererProps } from '../ArchbaseMarkdown.types';

/**
 * Verifica se uma URL é externa ao domínio atual
 */
function isExternalUrl(href: string): boolean {
  if (!href) return false;

  // Verifica se é um link âncora
  if (href.startsWith('#')) return false;

  // Verifica se é um protocolo relativo ou mailto/tel
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('/')) {
    return false;
  }

  // Verifica se tem protocolo (http, https, etc)
  if (/^[a-z]+:\/\//i.test(href)) {
    // Se tiver servidor, compara com o domínio atual
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(href, window.location.origin);
        return url.hostname !== window.location.hostname;
      } catch {
        return true;
      }
    }
    return true;
  }

  return false;
}

/**
 * Renderizador de links para Markdown
 *
 * @example
 * ```tsx
 * <LinkRenderer
 *   href="https://example.com"
 *   openExternalInNewTab
 *   onClick={(href) => console.log('Clicked:', href)}
 * >
 *   Link Text
 * </LinkRenderer>
 * ```
 */
export function ArchbaseLinkRenderer({
  href = '#',
  children,
  openExternalInNewTab = true,
  onClick,
}: LinkRendererProps) {
  const isExternal = isExternalUrl(href);
  const shouldOpenInNewTab = openExternalInNewTab && isExternal;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      const result = onClick(href);
      if (result === false) {
        e.preventDefault();
        return;
      }
    }

    if (shouldOpenInNewTab) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const anchor = (
    <Anchor
      href={href}
      target={shouldOpenInNewTab ? '_blank' : undefined}
      rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
    >
      {children}
      {isExternal && (
        <IconExternalLink size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
      )}
    </Anchor>
  );

  if (isExternal) {
    return (
      <Tooltip label={href} position="top" openDelay={500}>
        {anchor}
      </Tooltip>
    );
  }

  return anchor;
}
