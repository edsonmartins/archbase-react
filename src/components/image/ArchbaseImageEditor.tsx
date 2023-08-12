import React from 'react';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
import { languages } from './languages';
import { useMantineTheme } from '@mantine/core';

export interface ArchbaseImageEditorProps {
  src: string | HTMLImageElement;
  language?: 'pt_br' | 'en' | 'es';
  showCloseButton?: boolean;
  defaultSavedImageType?: 'png' | 'jpeg' | 'jpg' | 'webp';
  defaultSavedImageQuality?: number;
  forceToPngInEllipticalCrop?: boolean;
  closeAfterSave?: boolean;
  avoidChangesNotSavedAlertOnLeave?: boolean
}

export function ArchbaseImageEditor({
  src,
  language = 'pt_br',
  showCloseButton = false,
  defaultSavedImageType='png',
  defaultSavedImageQuality=0.92,
  forceToPngInEllipticalCrop=true,
  closeAfterSave=false,
  avoidChangesNotSavedAlertOnLeave=false
}: ArchbaseImageEditorProps) {
  const closeImgEditor = () => {};
  const theme = useMantineTheme();
  return (
    <div>
      <FilerobotImageEditor
        source={src}
        onSave={(editedImageObject, designState) => console.log('saved', editedImageObject, designState)}
        onClose={closeImgEditor}
        annotationsCommon={{
          fill: '#ff0000',
        }}
        language="pt"
        translations={languages[language]}
        tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE, TABS.RESIZE, TABS.WATERMARK]}
        defaultTabId={TABS.ADJUST}
        defaultToolId={TOOLS.TEXT}
        savingPixelRatio={0}
        previewPixelRatio={0}
        useBackendTranslations={false}
        showBackButton={showCloseButton}
        defaultSavedImageType={defaultSavedImageType}
        defaultSavedImageQuality={defaultSavedImageQuality}
        forceToPngInEllipticalCrop={forceToPngInEllipticalCrop}
        avoidChangesNotSavedAlertOnLeave={avoidChangesNotSavedAlertOnLeave}
        closeAfterSave={closeAfterSave}
        theme={{
          palette: {
            'bg-secondary': theme.colorScheme==='dark'?theme.colors.dark[6]:theme.white,
            'bg-primary': theme.colorScheme==='dark'?theme.colors.blue[4]:theme.colors.blue[4],
            'bg-primary-active': theme.colorScheme==='dark'?theme.colors.archbase[3]:theme.colors.archbase[3],
            'accent-primary': theme.colors.blue[6],
            'accent-primary-active': theme.colorScheme==='dark'?theme.black:theme.white,
            'icons-primary': theme.colorScheme==='dark'?theme.white:theme.black,
            'icons-secondary': 'white',
            'borders-secondary': 'white',
            'borders-primary': 'white',
            'borders-strong': 'white',
            'light-shadow': 'white',
            'warning': 'white',        
          }
        }}
      />
    </div>
  );
}
