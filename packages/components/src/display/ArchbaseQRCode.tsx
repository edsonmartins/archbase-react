import { useCallback, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Box, Input, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import {
  useArchbaseV1V2Compatibility,
  useArchbaseDataSourceListener,
} from '@archbase/data';
import type { IArchbaseDataSourceBase } from '@archbase/data';

export interface ArchbaseQRCodeImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
}

export interface ArchbaseQRCodeProps<T> {
  /** DataSource to read the string value from */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Field name within the DataSource */
  dataField?: string;
  /** Standalone string value to encode */
  value?: string;
  /** Render as SVG or Canvas */
  renderAs?: 'svg' | 'canvas';
  /** Size in pixels */
  size?: number;
  /** Error correction level */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** Background color (dark mode aware) */
  bgColor?: string;
  /** Foreground color (dark mode aware) */
  fgColor?: string;
  /** Include margin around the QR code */
  includeMargin?: boolean;
  /** Optional logo/image in the center of the QR code */
  imageSettings?: ArchbaseQRCodeImageSettings;
  /** Label for Input.Wrapper */
  label?: string;
  /** Description for Input.Wrapper */
  description?: string;
  /** Error message for Input.Wrapper */
  error?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

function ArchbaseQRCode<T>({
  dataSource,
  dataField,
  value: valueProp,
  renderAs = 'svg',
  size = 128,
  level = 'M',
  bgColor,
  fgColor,
  includeMargin = true,
  imageSettings,
  label,
  description,
  error,
  style,
  className,
}: ArchbaseQRCodeProps<T>) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  const defaultBgColor = isDark ? theme.colors.dark[7] : '#FFFFFF';
  const defaultFgColor = isDark ? '#FFFFFF' : '#000000';

  const resolvedBgColor = bgColor ?? defaultBgColor;
  const resolvedFgColor = fgColor ?? defaultFgColor;

  const {
    currentValue,
    loadDataSourceFieldValue,
  } = useArchbaseV1V2Compatibility<string>(
    'ArchbaseQRCode',
    dataSource,
    dataField,
    valueProp,
  );

  useEffect(() => {
    if (dataSource && dataField) {
      loadDataSourceFieldValue();
    }
  }, [dataSource, dataField, loadDataSourceFieldValue]);

  const dataSourceEvent = useCallback((_event: any) => {
    loadDataSourceFieldValue();
  }, [loadDataSourceFieldValue]);

  useArchbaseDataSourceListener({
    dataSource,
    listener: dataSourceEvent,
  });

  const qrValue = currentValue ?? '';

  const qrProps = {
    value: qrValue,
    size,
    level,
    bgColor: resolvedBgColor,
    fgColor: resolvedFgColor,
    includeMargin,
    imageSettings,
  };

  const qrElement = renderAs === 'canvas'
    ? <QRCodeCanvas {...qrProps} />
    : <QRCodeSVG {...qrProps} />;

  const content = (
    <Box style={style} className={className}>
      {qrElement}
    </Box>
  );

  if (label || description || error) {
    return (
      <Input.Wrapper label={label} description={description} error={error}>
        {content}
      </Input.Wrapper>
    );
  }

  return content;
}

ArchbaseQRCode.displayName = 'ArchbaseQRCode';

export { ArchbaseQRCode };
