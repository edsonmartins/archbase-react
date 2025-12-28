import { useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Group,
  Button,
  Stack,
  Text,
  ColorSwatch,
  TextInput,
  Select,
  ActionIcon,
  ScrollArea,
  Alert,
  CopyButton,
  Tooltip,
  Modal,
  SegmentedControl,
} from '@mantine/core';
import {
  IconPalette,
  IconTypography,
  IconRuler,
  IconBorderAll,
  IconDownload,
  IconCopy,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import { MantineProvider, useMantineTheme } from '@mantine/core';
import type {
  ArchbaseThemeEditorProps,
  ThemeSection,
  ColorPreset,
} from './ArchbaseThemeEditor.types';
import {
  COLOR_PRESETS,
  exportTheme,
  downloadTheme,
  copyThemeToClipboard,
  themeFromPreset,
  mergeTheme,
  isValidColor,
  generateColorScale,
} from './utils/themeExport';

/**
 * Editor de cores do tema
 */
function ColorEditor({
  colors,
  onChange,
  primaryColor,
  onPrimaryColorChange,
}: {
  colors: Record<string, any>;
  onChange: (colors: Record<string, any>) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}) {
  const mantineTheme = useMantineTheme();

  const colorNames = Object.keys(colors).filter((key) => {
    const value = colors[key];
    return typeof value === 'object' && value !== null;
  });

  return (
    <Stack gap="md">
      {/* Primary Color Selector */}
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Cor Primária
        </Text>
        <Group gap="xs">
          {colorNames.map((colorName) => {
            const colorScale = colors[colorName];
            const mainColor = colorScale?.[6] || colorScale?.[5] || '#000';

            return (
              <ColorSwatch
                key={colorName}
                color={mainColor}
                size={36}
                radius="sm"
                onClick={() => onPrimaryColorChange(colorName)}
                style={{
                  cursor: 'pointer',
                  border: primaryColor === colorName ? '3px solid white' : 'none',
                  boxShadow: primaryColor === colorName ? '0 0 0 2px var(--mantine-color-blue-6)' : 'none',
                }}
              />
            );
          })}
        </Group>
      </Box>

      {/* Color Scales */}
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Paleta de Cores
        </Text>

        <ScrollArea.Autosize mah={400}>
          <Stack gap="sm">
            {colorNames.map((colorName) => {
              const colorScale = colors[colorName];

              if (typeof colorScale !== 'object') return null;

              return (
                <Box key={colorName}>
                  <Group justify="space-between" mb="xs">
                    <Text size="xs" tt="uppercase" fw={500}>
                      {colorName}
                    </Text>
                    <CopyButton value={JSON.stringify(colorScale)}>
                      {({ copied, copy }) => (
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={copy}
                          color={copied ? 'teal' : undefined}
                        >
                          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Group>

                  <Group gap="xs">
                    {Object.entries(colorScale).map(([shade, value]) => (
                      <Box key={shade} style={{ textAlign: 'center' }}>
                        <ColorSwatch
                          color={value as string}
                          size={32}
                          radius="sm"
                        >
                          <Text size="xs" c="white" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)', fontSize: '8px' }}>
                            {shade}
                          </Text>
                        </ColorSwatch>
                        <TextInput
                          size="xs"
                          value={value as string}
                          onChange={(e) => {
                            const newColors = { ...colors };
                            newColors[colorName] = { ...colorScale, [shade]: e.target.value };
                            onChange(newColors);
                          }}
                          styles={{ input: { height: 20, fontSize: 10 } }}
                          w={50}
                          mt={4}
                        />
                      </Box>
                    ))}
                  </Group>
                </Box>
              );
            })}
          </Stack>
        </ScrollArea.Autosize>
      </Box>
    </Stack>
  );
}

/**
 * Editor de tipografia do tema
 */
function TypographyEditor({
  theme,
  onChange,
}: {
  theme: any;
  onChange: (theme: any) => void;
}) {
  const fontSizes = theme.fontSizes || {};
  const lineHeight = theme.lineHeight || {};

  return (
    <Stack gap="md">
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Font Family
        </Text>
        <TextInput
          value={theme.fontFamily || 'sans-serif'}
          onChange={(e) => onChange({ ...theme, fontFamily: e.target.value })}
        />
      </Box>

      <Box>
        <Text size="sm" fw={500} mb="xs">
          Tamanhos de Fonte
        </Text>
        <Stack gap="xs">
          {Object.entries(fontSizes).map(([key, value]) => (
            <Group key={key} align="center">
              <Text size="xs" w={60}>
                {key}
              </Text>
              <TextInput
                flex={1}
                size="xs"
                value={String(value)}
                onChange={(e) => {
                  const newFontSizes = { ...fontSizes, [key]: e.target.value };
                  onChange({ ...theme, fontSizes: newFontSizes });
                }}
              />
            </Group>
          ))}
        </Stack>
      </Box>

      <Box>
        <Text size="sm" fw={500} mb="xs">
          Preview
        </Text>
        <Paper p="md" withBorder>
          <Text size="xs">Extra Small: Lorem ipsum dolor sit amet</Text>
          <Text size="sm">Small: Lorem ipsum dolor sit amet</Text>
          <Text size="md">Medium: Lorem ipsum dolor sit amet</Text>
          <Text size="lg">Large: Lorem ipsum dolor sit amet</Text>
          <Text size="xl">Extra Large: Lorem ipsum dolor sit amet</Text>
        </Paper>
      </Box>
    </Stack>
  );
}

/**
 * Editor de espaçamento do tema
 */
function SpacingEditor({
  theme,
  onChange,
}: {
  theme: any;
  onChange: (theme: any) => void;
}) {
  const spacing = theme.spacing || {};

  return (
    <Stack gap="md">
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Escala de Espaçamento
        </Text>
        <Stack gap="xs">
          {Object.entries(spacing).slice(0, 10).map(([key, value]) => (
            <Group key={key} align="center">
              <Text size="xs" w={40}>
                {key}
              </Text>
              <TextInput
                flex={1}
                size="xs"
                value={String(value)}
                onChange={(e) => {
                  const newSpacing = { ...spacing, [key]: e.target.value };
                  onChange({ ...theme, spacing: newSpacing });
                }}
              />
              <Box
                style={{
                  width: Number(value) * 4,
                  height: 20,
                  backgroundColor: 'var(--mantine-color-blue-6)',
                  borderRadius: 4,
                }}
              />
            </Group>
          ))}
        </Stack>
      </Box>

      <Box>
        <Text size="sm" fw={500} mb="xs">
          Preview
        </Text>
        <Paper p="md" withBorder>
          <Group gap="xs" mb="sm">
            <Text size="xs">xs</Text>
            <Text size="sm">sm</Text>
            <Text size="md">md</Text>
          </Group>
          <Group gap="sm" mb="sm">
            <Text size="xs">xs</Text>
            <Text size="sm">sm</Text>
            <Text size="md">md</Text>
          </Group>
          <Group gap="md" mb="sm">
            <Text size="xs">xs</Text>
            <Text size="sm">sm</Text>
            <Text size="md">md</Text>
          </Group>
        </Paper>
      </Box>
    </Stack>
  );
}

/**
 * Editor de bordas do tema
 */
function BorderEditor({
  theme,
  onChange,
}: {
  theme: any;
  onChange: (theme: any) => void;
}) {
  const radius = theme.radius || {};

  return (
    <Stack gap="md">
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Border Radius
        </Text>
        <Stack gap="xs">
          {Object.entries(radius).map(([key, value]) => (
            <Group key={key} align="center">
              <Text size="xs" w={50}>
                {key}
              </Text>
              <TextInput
                flex={1}
                size="xs"
                value={String(value)}
                onChange={(e) => {
                  const newRadius = { ...radius, [key]: e.target.value };
                  onChange({ ...theme, radius: newRadius });
                }}
              />
              <Box
                style={{
                  width: 40,
                  height: 40,
                  border: '2px solid var(--mantine-color-gray-6)',
                  borderRadius: value as string,
                }}
              />
            </Group>
          ))}
        </Stack>
      </Box>

      <Box>
        <Text size="sm" fw={500} mb="xs">
          Preview
        </Text>
        <Group>
          {Object.values(radius).slice(0, 6).map((value, i) => (
            <Button
              key={i}
              radius={value as string}
              variant="light"
              size="xs"
            >
              {value as ReactNode}
            </Button>
          ))}
        </Group>
      </Box>
    </Stack>
  );
}

/**
 * Modal de exportação
 */
function ExportModal({
  opened,
  onClose,
  theme,
  themeName,
}: {
  opened: boolean;
  onClose: () => void;
  theme: Partial<any>;
  themeName: string;
}) {
  const [format, setFormat] = useState<'json' | 'typescript' | 'css'>('typescript');
  const exported = useMemo(() => exportTheme(theme, format, themeName), [theme, format, themeName]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTheme(theme, format, themeName);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Export Theme" size="lg">
      <Stack gap="md">
        <SegmentedControl
          value={format}
          onChange={(v) => setFormat(v as 'json' | 'typescript' | 'css')}
          data={[
            { label: 'TypeScript', value: 'typescript' },
            { label: 'JSON', value: 'json' },
            { label: 'CSS', value: 'css' },
          ]}
          fullWidth
        />

        <Box
          p="md"
          style={{
            backgroundColor: '#1e1e1e',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Text
            size="xs"
            style={{
              fontFamily: 'monospace',
              color: '#d4d4d4',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {exported}
          </Text>
        </Box>

        <Group justify="flex-end">
          <Button
            leftSection={<IconCopy size={16} />}
            variant={copied ? 'filled' : 'light'}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/**
 * Componente ArchbaseThemeEditor - Editor de temas Mantine
 *
 * @example
 * ```tsx
 * <ArchbaseThemeEditor
 *   theme={{ primaryColor: 'blue' }}
 *   onChange={(theme) => console.log('Theme changed:', theme)}
 *   onApply={(theme) => setMantineTheme(theme)}
 * />
 * ```
 */
export function ArchbaseThemeEditor({
  theme: initialTheme = {},
  onChange,
  onApply,
  options = {},
  initialSection = 'colors',
  initialPreset,
  exportFormats = ['typescript', 'json', 'css'],
  onExport,
  themeName = 'myTheme',
  width = '100%',
  height = 600,
  layout = 'sidebar',
  style,
  className,
  editorClassName,
  previewClassName,
  disabled = false,
  loading,
  readOnly = false,
  hidePreview = false,
  ariaLabel,
  title,
  actions,
  header,
  footer,
}: ArchbaseThemeEditorProps) {
  const { t } = useArchbaseTranslation();
  const currentTheme = useMantineTheme();

  // State
  const [activeSection, setActiveSection] = useState<ThemeSection>(initialSection);
  const [editedTheme, setEditedTheme] = useState<Partial<any>>(() => {
    const merged = mergeTheme(currentTheme, initialTheme);
    if (initialPreset) {
      return mergeTheme(merged, themeFromPreset(initialPreset));
    }
    return merged;
  });
  const [primaryColor, setPrimaryColor] = useState(editedTheme.primaryColor || 'blue');
  const [exportModalOpened, setExportModalOpened] = useState(false);

  // Handlers
  const handleThemeChange = useCallback((newTheme: Partial<any>) => {
    setEditedTheme(newTheme);
    onChange?.(newTheme);
  }, [onChange]);

  const handleApply = useCallback(() => {
    onApply?.(editedTheme as any);
  }, [editedTheme, onApply]);

  const handlePresetChange = useCallback((presetName: string) => {
    const presetTheme = themeFromPreset(presetName);
    const merged = mergeTheme(editedTheme, presetTheme);
    setEditedTheme(merged);
    onChange?.(merged);
  }, [editedTheme, onChange]);

  const handleExport = useCallback((format: any, data: string) => {
    onExport?.(format, data);
  }, [onExport]);

  // Render sections
  const renderSection = () => {
    switch (activeSection) {
      case 'colors':
        return (
          <ColorEditor
            colors={editedTheme.colors || currentTheme.colors}
            onChange={(colors) => handleThemeChange({ ...editedTheme, colors })}
            primaryColor={primaryColor}
            onPrimaryColorChange={setPrimaryColor}
          />
        );
      case 'typography':
        return (
          <TypographyEditor
            theme={editedTheme}
            onChange={handleThemeChange}
          />
        );
      case 'spacing':
        return (
          <SpacingEditor
            theme={editedTheme}
            onChange={handleThemeChange}
          />
        );
      case 'borders':
        return (
          <BorderEditor
            theme={editedTheme}
            onChange={handleThemeChange}
          />
        );
      default:
        return (
          <Alert icon={<IconPalette size={16} />}>
            Seção {activeSection} em desenvolvimento
          </Alert>
        );
    }
  };

  // Section tabs
  const sectionTabs = [
    { icon: IconPalette, label: 'Cores', value: 'colors' },
    { icon: IconTypography, label: 'Tipografia', value: 'typography' },
    { icon: IconRuler, label: 'Espaçamento', value: 'spacing' },
    { icon: IconBorderAll, label: 'Bordas', value: 'borders' },
  ];

  return (
    <Paper
      shadow="sm"
      withBorder
      style={{ width, minHeight: height, display: 'flex', flexDirection: 'column', ...style }}
      className={className}
      aria-label={ariaLabel || title || 'Theme editor'}
    >
      {/* Header */}
      {header || (
        <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Text fw={500}>{title || t('Theme Editor') as ReactNode}</Text>

          <Group gap="xs">
            {/* Presets */}
            <Select
              size="xs"
              placeholder="Preset"
              data={COLOR_PRESETS.map((p) => p.name)}
              onChange={(v) => v && handlePresetChange(v)}
              clearable
              w={100}
            />

            {/* Export */}
            <ActionIcon
              variant="light"
              onClick={() => setExportModalOpened(true)}
              title={String(t('Export'))}
            >
              <IconDownload size={16} />
            </ActionIcon>

            {/* Apply */}
            {!readOnly && onApply && (
              <Button size="xs" onClick={handleApply}>
                {t('Apply') as ReactNode}
              </Button>
            )}
          </Group>
        </Group>
      )}

      {/* Content */}
      <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar with sections */}
        <Box
          w={200}
          style={{
            borderRight: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <Tabs
            orientation="vertical"
            value={activeSection}
            onChange={(v) => setActiveSection(v as ThemeSection)}
            variant="pills"
          >
            <Tabs.List>
              {sectionTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    leftSection={<Icon size={16} />}
                  >
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
        </Box>

        {/* Editor */}
        <Box p="md" style={{ flex: 1, overflowY: 'auto' }}>
          {renderSection()}
        </Box>

        {/* Preview (if not hidden) */}
        {!hidePreview && (
          <Box
            w={300}
            style={{
              borderLeft: '1px solid var(--mantine-color-gray-3)',
              overflowY: 'auto',
            }}
          >
            <MantineProvider theme={{ ...currentTheme, ...editedTheme, primaryColor }}>
              <Box p="md">
                <Text size="sm" fw={500} mb="md" tt="uppercase" c="dimmed">
                  Preview
                </Text>

                <Stack gap="md">
                  <Button>Primary Button</Button>
                  <Button variant="light">Light Button</Button>
                  <Button variant="outline">Outline Button</Button>

                  <Paper p="md" withBorder>
                    <Text>Card with border</Text>
                  </Paper>

                  <Text size="lg">Large Text</Text>
                  <Text size="md">Medium Text</Text>
                  <Text size="sm">Small Text</Text>

                  <Group>
                    {sectionTabs.slice(0, 4).map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <ActionIcon key={tab.value}>
                          <Icon size={16} />
                        </ActionIcon>
                      );
                    })}
                  </Group>
                </Stack>
              </Box>
            </MantineProvider>
          </Box>
        )}
      </Box>

      {/* Footer */}
      {footer && (
        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          {footer}
        </Box>
      )}

      {/* Custom actions */}
      {actions}

      {/* Export Modal */}
      <ExportModal
        opened={exportModalOpened}
        onClose={() => setExportModalOpened(false)}
        theme={editedTheme}
        themeName={themeName}
      />
    </Paper>
  );
}

ArchbaseThemeEditor.displayName = 'ArchbaseThemeEditor';
