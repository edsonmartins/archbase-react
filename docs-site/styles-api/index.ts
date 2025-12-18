import type { StylesApiData } from '../components/StylesApiTable';
import { ArchbaseEditStylesApi } from './ArchbaseEdit.styles-api';
import { ArchbaseSelectStylesApi } from './ArchbaseSelect.styles-api';

// Exporta todas as Styles API
export { ArchbaseEditStylesApi } from './ArchbaseEdit.styles-api';
export { ArchbaseSelectStylesApi } from './ArchbaseSelect.styles-api';

// Dados consolidados para uso nas páginas
export const STYLES_API_DATA: Record<string, StylesApiData> = {
  ArchbaseEdit: ArchbaseEditStylesApi,
  ArchbaseSelect: ArchbaseSelectStylesApi,
};
