'use client';

import React, { useMemo, useState } from 'react';
import cx from 'clsx';
import {
  Badge,
  Box,
  Chip,
  Group,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconSearch,
  IconComponents,
  IconCategory,
  IconMoodEmptyFilled,
  IconCircleCheck,
  IconCursorText,
  IconTable,
  IconList,
  IconChartLine,
  IconLayoutGrid,
  IconFileTypePdf,
  IconPhoto,
  IconMarkdown,
  IconForms,
  IconFilter,
  IconAdjustmentsHorizontal,
  IconBell,
  IconMenu2,
  IconHandClick,
  IconLayoutDashboard,
  IconPrinter,
  IconPalette,
  IconBug,
  IconLayoutSidebar,
  IconShieldLock,
  IconTemplate,
  type IconProps,
} from '@tabler/icons-react';
import gallery from '../../data/gallery.generated.json';
import classes from './ComponentGallery.module.css';

type TablerIcon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

interface GalleryComponentItem {
  name: string;
  description: string;
  pkg: string;
  docLink: string | null;
}

interface GalleryCategoryData {
  id: string;
  label: string;
  components: GalleryComponentItem[];
}

const CATEGORY_ICONS: Record<string, TablerIcon> = {
  template: IconTemplate,
  editors: IconCursorText,
  datagrid: IconTable,
  lists: IconList,
  charts: IconChartLine,
  display: IconLayoutGrid,
  viewers: IconFileTypePdf,
  media: IconPhoto,
  markdown: IconMarkdown,
  forms: IconForms,
  filters: IconFilter,
  advanced: IconAdjustmentsHorizontal,
  feedback: IconBell,
  navigation: IconMenu2,
  buttons: IconHandClick,
  layout: IconLayoutDashboard,
  printer: IconPrinter,
  themes: IconPalette,
  debug: IconBug,
  admin: IconLayoutSidebar,
  security: IconShieldLock,
};

// Cada categoria ganha uma cor Mantine própria — dá vida e ajuda a escanear a página.
const CATEGORY_COLORS: Record<string, string> = {
  template: 'violet',
  editors: 'blue',
  datagrid: 'indigo',
  lists: 'cyan',
  charts: 'teal',
  display: 'grape',
  viewers: 'red',
  media: 'pink',
  markdown: 'orange',
  forms: 'green',
  filters: 'lime',
  advanced: 'yellow',
  feedback: 'orange',
  navigation: 'cyan',
  buttons: 'pink',
  layout: 'indigo',
  printer: 'gray',
  themes: 'grape',
  debug: 'red',
  admin: 'blue',
  security: 'teal',
  outros: 'gray',
};

const categories = (gallery.categories as GalleryCategoryData[]) ?? [];
const TOTAL = gallery.total ?? 0;
const DOCUMENTED = gallery.documented ?? 0;

const PACKAGES = Array.from(
  categories
    .flatMap((c) => c.components)
    .reduce((map, c) => map.set(c.pkg, (map.get(c.pkg) ?? 0) + 1), new Map<string, number>()),
)
  .sort((a, b) => b[1] - a[1])
  .map(([pkg, count]) => ({ pkg, count }));

function shortPkg(pkg: string) {
  return pkg.replace('@archbase/', '');
}

function matches(c: GalleryComponentItem, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
}

function getIcon(id: string): TablerIcon {
  return CATEGORY_ICONS[id] ?? IconComponents;
}

function getColor(id: string): string {
  return CATEGORY_COLORS[id] ?? 'blue';
}

/** Define as CSS custom properties de cor da categoria para o card/seção. */
function colorVars(color: string): React.CSSProperties {
  return {
    ['--cat-color' as string]: `var(--mantine-color-${color}-6)`,
    ['--cat-color-filled' as string]: `var(--mantine-color-${color}-filled)`,
    ['--cat-light' as string]: `var(--mantine-color-${color}-light)`,
    ['--cat-light-hover' as string]: `var(--mantine-color-${color}-light-hover)`,
  } as React.CSSProperties;
}

function ComponentCard({
  component,
  Icon,
  color,
}: {
  component: GalleryComponentItem;
  Icon: TablerIcon;
  color: string;
}) {
  const hasDoc = Boolean(component.docLink);

  const inner = (
    <Paper
      className={cx(classes.card, !hasDoc && classes.cardNoDoc)}
      p="md"
      radius="md"
      withBorder
      style={colorVars(color)}
    >
      <Group gap="sm" wrap="nowrap" align="flex-start">
        <ThemeIcon
          variant={hasDoc ? 'light' : 'default'}
          color={hasDoc ? color : 'gray'}
          size={44}
          radius="md"
          className={classes.cardIcon}
        >
          <Icon size={24} stroke={1.7} />
        </ThemeIcon>
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Group gap={6} wrap="nowrap" justify="space-between" align="center">
            <Text fw={650} size="sm" className={classes.cardName}>
              {component.name}
            </Text>
            {!hasDoc && (
              <Tooltip label="Documentação em breve" withArrow>
                <Badge size="xs" variant="default" radius="sm" className={classes.noDocBadge}>
                  sem doc
                </Badge>
              </Tooltip>
            )}
          </Group>
          {component.description ? (
            <Text size="xs" c="dimmed" className={classes.cardDescription} mt={4}>
              {component.description}
            </Text>
          ) : (
            <Text size="xs" c="dimmed" fs="italic" className={classes.cardDescription} mt={4}>
              {shortPkg(component.pkg)}
            </Text>
          )}
          <Badge
            size="xs"
            variant="light"
            color={hasDoc ? color : 'gray'}
            radius="sm"
            mt="xs"
            className={classes.pkgBadge}
          >
            {shortPkg(component.pkg)}
          </Badge>
        </Box>
      </Group>
    </Paper>
  );

  if (!hasDoc) {
    return <div className={classes.cardLink}>{inner}</div>;
  }
  return (
    <a href={component.docLink!} className={classes.cardLink}>
      {inner}
    </a>
  );
}

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <Paper className={classes.statPill} radius="md" p="sm" style={colorVars(color)}>
      <ThemeIcon variant="light" color={color} size={38} radius="md">
        {icon}
      </ThemeIcon>
      <div>
        <Text fw={800} size="lg" lh={1} className={classes.statValue}>
          {value}
        </Text>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mt={2}>
          {label}
        </Text>
      </div>
    </Paper>
  );
}

export function ComponentGallery() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activePackages, setActivePackages] = useState<string[]>([]);

  const visibleCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        components: category.components.filter(
          (c) =>
            matches(c, query) && (activePackages.length === 0 || activePackages.includes(c.pkg)),
        ),
      }))
      .filter(
        (category) =>
          category.components.length > 0 &&
          (activeCategories.length === 0 || activeCategories.includes(category.id)),
      );
  }, [query, activeCategories, activePackages]);

  const visibleCount = visibleCategories.reduce((sum, c) => sum + c.components.length, 0);

  return (
    <div className={classes.root}>
      <header className={cx(classes.hero, isDark && classes.heroDark)}>
        <div className={classes.heroGlow} aria-hidden />
        <div className={classes.heroContent}>
          <Group gap="sm" mb="sm">
            <ThemeIcon
              size={46}
              radius="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'violet', deg: 135 }}
            >
              <IconComponents size={26} />
            </ThemeIcon>
            <Title order={1} className={classes.heroTitle}>
              Componentes
            </Title>
          </Group>
          <Text c="dimmed" maw={720} mb="lg" className={classes.heroSubtitle}>
            Catálogo completo do Archbase React, gerado automaticamente a partir do código-fonte da
            biblioteca. Todos com integração ao DataSource, tema claro/escuro e TypeScript.
          </Text>

          <Group gap="sm" mb="xl">
            <StatPill
              icon={<IconComponents size={22} />}
              value={TOTAL}
              label="Componentes"
              color="blue"
            />
            <StatPill
              icon={<IconCategory size={22} />}
              value={categories.length}
              label="Categorias"
              color="grape"
            />
            <StatPill
              icon={<IconCircleCheck size={22} />}
              value={DOCUMENTED}
              label="Documentados"
              color="teal"
            />
          </Group>

          <TextInput
            size="md"
            radius="xl"
            placeholder="Buscar componente por nome ou descrição..."
            leftSection={<IconSearch size={18} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className={classes.search}
          />

          <Group gap="xs" mt="md" align="flex-start">
            <Group gap={6} c="dimmed" mt={6}>
              <IconCategory size={16} />
              <Text size="xs" fw={700} tt="uppercase">
                Categorias
              </Text>
            </Group>
            <Chip.Group multiple value={activeCategories} onChange={setActiveCategories}>
              <Group gap={6}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    value={category.id}
                    size="xs"
                    radius="xl"
                    variant="outline"
                    color={getColor(category.id)}
                  >
                    {category.label} ({category.components.length})
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Group>

          {PACKAGES.length > 1 && (
            <Group gap="xs" mt="sm" align="flex-start">
              <Group gap={6} c="dimmed" mt={6}>
                <IconComponents size={16} />
                <Text size="xs" fw={700} tt="uppercase">
                  Pacote
                </Text>
              </Group>
              <Chip.Group multiple value={activePackages} onChange={setActivePackages}>
                <Group gap={6}>
                  {PACKAGES.map(({ pkg, count }) => (
                    <Chip key={pkg} value={pkg} size="xs" radius="xl" variant="outline" color="indigo">
                      {shortPkg(pkg)} ({count})
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </Group>
          )}

          <Text size="xs" c="dimmed" mt="md" fw={500}>
            {visibleCount} de {TOTAL} componentes
          </Text>
        </div>
      </header>

      {visibleCategories.length === 0 ? (
        <Paper className={classes.empty} p="xl" radius="md" withBorder>
          <ThemeIcon variant="light" color="gray" size={48} radius="xl" mb="sm">
            <IconMoodEmptyFilled size={28} />
          </ThemeIcon>
          <Text fw={600}>Nenhum componente encontrado</Text>
          <Text size="sm" c="dimmed">
            Tente outro termo de busca ou limpe os filtros.
          </Text>
        </Paper>
      ) : (
        visibleCategories.map((category) => {
          const CategoryIcon = getIcon(category.id);
          const color = getColor(category.id);
          return (
            <section key={category.id} className={classes.section} style={colorVars(color)}>
              <Group gap="sm" mb="md" className={classes.sectionHeader}>
                <ThemeIcon variant="light" color={color} size={36} radius="md">
                  <CategoryIcon size={22} stroke={1.7} />
                </ThemeIcon>
                <Title order={2} className={classes.sectionTitle}>
                  {category.label}
                </Title>
                <Badge variant="light" color={color} radius="sm" size="lg">
                  {category.components.length}
                </Badge>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {category.components.map((component) => (
                  <ComponentCard
                    key={component.name}
                    component={component}
                    Icon={CategoryIcon}
                    color={color}
                  />
                ))}
              </SimpleGrid>
            </section>
          );
        })
      )}
    </div>
  );
}
