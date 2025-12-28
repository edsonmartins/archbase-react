import type { StylesApiData } from '../components/StylesApiTable';
import { ArchbaseEditStylesApi } from './ArchbaseEdit.styles-api';
import { ArchbaseMaskEditStylesApi } from './ArchbaseMaskEdit.styles-api';
import { ArchbasePasswordEditStylesApi } from './ArchbasePasswordEdit.styles-api';
import { ArchbaseTextAreaStylesApi } from './ArchbaseTextArea.styles-api';
import { ArchbaseSelectStylesApi } from './ArchbaseSelect.styles-api';
import { ArchbaseAsyncSelectStylesApi } from './ArchbaseAsyncSelect.styles-api';
import { ArchbaseAsyncMultiSelectStylesApi } from './ArchbaseAsyncMultiSelect.styles-api';
import { ArchbaseTreeSelectStylesApi } from './ArchbaseTreeSelect.styles-api';
import { ArchbaseCheckboxStylesApi } from './ArchbaseCheckbox.styles-api';
import { ArchbaseSwitchStylesApi } from './ArchbaseSwitch.styles-api';
import { ArchbaseChipStylesApi } from './ArchbaseChip.styles-api';
import { ArchbaseChipGroupStylesApi } from './ArchbaseChipGroup.styles-api';
import { ArchbaseRadioGroupStylesApi } from './ArchbaseRadioGroup.styles-api';
import { ArchbaseDatePickerEditStylesApi } from './ArchbaseDatePickerEdit.styles-api';
import { ArchbaseTimeEditStylesApi } from './ArchbaseTimeEdit.styles-api';
import { ArchbaseNumberEditStylesApi } from './ArchbaseNumberEdit.styles-api';
import { ArchbaseLookupNumberStylesApi } from './ArchbaseLookupNumber.styles-api';
import { ArchbaseImageEditStylesApi } from './ArchbaseImageEdit.styles-api';
import { ArchbaseFileAttachmentStylesApi } from './ArchbaseFileAttachment.styles-api';
import { ArchbaseRichTextEditStylesApi } from './ArchbaseRichTextEdit.styles-api';
import { ArchbaseKeyValueEditorStylesApi } from './ArchbaseKeyValueEditor.styles-api';
import { ArchbaseLookupEditStylesApi } from './ArchbaseLookupEdit.styles-api';
import { ArchbaseLookupSelectStylesApi } from './ArchbaseLookupSelect.styles-api';
import { ArchbaseRatingStylesApi } from './ArchbaseRating.styles-api';
import { ArchbaseJsonEditStylesApi } from './ArchbaseJsonEdit.styles-api';
import { ArchbaseOperationHoursEditorStylesApi } from './ArchbaseOperationHoursEditor.styles-api';
import { ArchbaseCronExpressionEditStylesApi } from './ArchbaseCronExpressionEdit.styles-api';
import { ArchbaseSpreadsheetImportStylesApi } from './ArchbaseSpreadsheetImport.styles-api';
import { ArchbaseCompositeFiltersStylesApi } from './ArchbaseCompositeFilters.styles-api';

// Exporta todas as Styles API
export { ArchbaseEditStylesApi } from './ArchbaseEdit.styles-api';
export { ArchbaseMaskEditStylesApi } from './ArchbaseMaskEdit.styles-api';
export { ArchbasePasswordEditStylesApi } from './ArchbasePasswordEdit.styles-api';
export { ArchbaseTextAreaStylesApi } from './ArchbaseTextArea.styles-api';
export { ArchbaseSelectStylesApi } from './ArchbaseSelect.styles-api';
export { ArchbaseAsyncSelectStylesApi } from './ArchbaseAsyncSelect.styles-api';
export { ArchbaseAsyncMultiSelectStylesApi } from './ArchbaseAsyncMultiSelect.styles-api';
export { ArchbaseTreeSelectStylesApi } from './ArchbaseTreeSelect.styles-api';
export { ArchbaseCheckboxStylesApi } from './ArchbaseCheckbox.styles-api';
export { ArchbaseSwitchStylesApi } from './ArchbaseSwitch.styles-api';
export { ArchbaseChipStylesApi } from './ArchbaseChip.styles-api';
export { ArchbaseChipGroupStylesApi } from './ArchbaseChipGroup.styles-api';
export { ArchbaseRadioGroupStylesApi } from './ArchbaseRadioGroup.styles-api';
export { ArchbaseDatePickerEditStylesApi } from './ArchbaseDatePickerEdit.styles-api';
export { ArchbaseTimeEditStylesApi } from './ArchbaseTimeEdit.styles-api';
export { ArchbaseNumberEditStylesApi } from './ArchbaseNumberEdit.styles-api';
export { ArchbaseLookupNumberStylesApi } from './ArchbaseLookupNumber.styles-api';
export { ArchbaseImageEditStylesApi } from './ArchbaseImageEdit.styles-api';
export { ArchbaseFileAttachmentStylesApi } from './ArchbaseFileAttachment.styles-api';
export { ArchbaseRichTextEditStylesApi } from './ArchbaseRichTextEdit.styles-api';
export { ArchbaseKeyValueEditorStylesApi } from './ArchbaseKeyValueEditor.styles-api';
export { ArchbaseLookupEditStylesApi } from './ArchbaseLookupEdit.styles-api';
export { ArchbaseLookupSelectStylesApi } from './ArchbaseLookupSelect.styles-api';
export { ArchbaseRatingStylesApi } from './ArchbaseRating.styles-api';
export { ArchbaseJsonEditStylesApi } from './ArchbaseJsonEdit.styles-api';
export { ArchbaseOperationHoursEditorStylesApi } from './ArchbaseOperationHoursEditor.styles-api';
export { ArchbaseCronExpressionEditStylesApi } from './ArchbaseCronExpressionEdit.styles-api';
export { ArchbaseSpreadsheetImportStylesApi } from './ArchbaseSpreadsheetImport.styles-api';
export { ArchbaseCompositeFiltersStylesApi } from './ArchbaseCompositeFilters.styles-api';

// Dados consolidados para uso nas páginas
export const STYLES_API_DATA: Record<string, StylesApiData> = {
  ArchbaseEdit: ArchbaseEditStylesApi,
  ArchbaseMaskEdit: ArchbaseMaskEditStylesApi,
  ArchbasePasswordEdit: ArchbasePasswordEditStylesApi,
  ArchbaseTextArea: ArchbaseTextAreaStylesApi,
  ArchbaseSelect: ArchbaseSelectStylesApi,
  ArchbaseAsyncSelect: ArchbaseAsyncSelectStylesApi,
  ArchbaseAsyncMultiSelect: ArchbaseAsyncMultiSelectStylesApi,
  ArchbaseTreeSelect: ArchbaseTreeSelectStylesApi,
  ArchbaseCheckbox: ArchbaseCheckboxStylesApi,
  ArchbaseSwitch: ArchbaseSwitchStylesApi,
  ArchbaseChip: ArchbaseChipStylesApi,
  ArchbaseChipGroup: ArchbaseChipGroupStylesApi,
  ArchbaseRadioGroup: ArchbaseRadioGroupStylesApi,
  ArchbaseDatePickerEdit: ArchbaseDatePickerEditStylesApi,
  ArchbaseTimeEdit: ArchbaseTimeEditStylesApi,
  ArchbaseNumberEdit: ArchbaseNumberEditStylesApi,
  ArchbaseLookupNumber: ArchbaseLookupNumberStylesApi,
  ArchbaseImageEdit: ArchbaseImageEditStylesApi,
  ArchbaseFileAttachment: ArchbaseFileAttachmentStylesApi,
  ArchbaseRichTextEdit: ArchbaseRichTextEditStylesApi,
  ArchbaseKeyValueEditor: ArchbaseKeyValueEditorStylesApi,
  ArchbaseLookupEdit: ArchbaseLookupEditStylesApi,
  ArchbaseLookupSelect: ArchbaseLookupSelectStylesApi,
  ArchbaseRating: ArchbaseRatingStylesApi,
  ArchbaseJsonEdit: ArchbaseJsonEditStylesApi,
  ArchbaseOperationHoursEditor: ArchbaseOperationHoursEditorStylesApi,
  ArchbaseCronExpressionEdit: ArchbaseCronExpressionEditStylesApi,
  ArchbaseSpreadsheetImport: ArchbaseSpreadsheetImportStylesApi,
  ArchbaseCompositeFilters: ArchbaseCompositeFiltersStylesApi,
};
