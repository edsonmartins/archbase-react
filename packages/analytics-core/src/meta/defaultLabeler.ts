import type { MemberLabeler } from '../ports/types';
import { resolveDescription, resolveLabel } from './resolveLabel';

/**
 * Implementacao default da porta `labeler`. O hospedeiro pode substitui-la para
 * integrar ao i18n proprio da aplicacao. RFC de metadados, secao 6.5.
 */
export function createDefaultLabeler(defaultLocale: string): MemberLabeler {
  return {
    label: (member, locale) => resolveLabel(member, locale, defaultLocale),
    description: (member, locale) => resolveDescription(member, locale, defaultLocale),
  };
}
