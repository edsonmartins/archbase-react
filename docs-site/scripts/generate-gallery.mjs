// Gera docs-site/data/gallery.generated.json dinamicamente a partir de:
//  - component-catalog.json (gerado do source pela lib -> componentes reais)
//  - data/components-data.ts (metadados de documentação -> links + descrições curadas)
//
// Rode via `pnpm generate:gallery` (também executado em predev/prebuild).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(docsRoot, '..');

const catalogPath = path.join(repoRoot, 'component-catalog.json');
const componentsDataPath = path.join(docsRoot, 'data', 'components-data.ts');
const pagesDir = path.join(docsRoot, 'pages');
const outPath = path.join(docsRoot, 'data', 'gallery.generated.json');

// Um docLink só é válido se existir uma página Next correspondente (senão -> 404).
function pageExists(route) {
  const base = route.split('#')[0];
  return (
    fs.existsSync(path.join(pagesDir, base + '.tsx')) ||
    fs.existsSync(path.join(pagesDir, base, 'index.tsx'))
  );
}

// --- Categorias: pasta de origem (pkg/folder) -> { id, label, order } ---
const CATEGORY_MAP = {
  template: { id: 'template', label: 'Templates (CRUD, Form, Grid)', order: 0.5 },
  'components/editors': { id: 'editors', label: 'Editores & Inputs', order: 1 },
  'components/datagrid': { id: 'datagrid', label: 'DataGrid', order: 2 },
  'components/list': { id: 'lists', label: 'Listas & Árvores', order: 3 },
  'components/list-view': { id: 'lists', label: 'Listas & Árvores', order: 3 },
  'components/masonry': { id: 'lists', label: 'Listas & Árvores', order: 3 },
  'components/charts': { id: 'charts', label: 'Gráficos & Timeline', order: 4 },
  'components/display': { id: 'display', label: 'Exibição & Visualização', order: 5 },
  'components/viewers': { id: 'viewers', label: 'Visualizadores de Documentos', order: 6 },
  'components/image': { id: 'media', label: 'Imagem & Mídia', order: 7 },
  'components/video': { id: 'media', label: 'Imagem & Mídia', order: 7 },
  'components/markdown': { id: 'markdown', label: 'Markdown & Código', order: 8 },
  'components/forms': { id: 'forms', label: 'Formulários', order: 9 },
  'components/jsonschema': { id: 'forms', label: 'Formulários', order: 9 },
  'components/filters': { id: 'filters', label: 'Filtros', order: 10 },
  'advanced/querybuilder': { id: 'advanced', label: 'Filtros Avançados & QueryBuilder', order: 11 },
  'components/feedback': { id: 'feedback', label: 'Feedback & Notificações', order: 12 },
  'components/notification': { id: 'feedback', label: 'Feedback & Notificações', order: 12 },
  'components/onboarding': { id: 'feedback', label: 'Feedback & Notificações', order: 12 },
  'components/navigation': { id: 'navigation', label: 'Navegação', order: 13 },
  'components/buttons': { id: 'buttons', label: 'Botões & Ações', order: 14 },
  'components/containers': { id: 'layout', label: 'Layout & Containers', order: 15 },
  'layout/containers': { id: 'layout', label: 'Layout & Containers', order: 15 },
  'layout/dock': { id: 'layout', label: 'Layout & Containers', order: 15 },
  'components/printer': { id: 'printer', label: 'Impressão', order: 16 },
  'components/theme-editor': { id: 'themes', label: 'Temas', order: 17 },
  'components/themes': { id: 'themes', label: 'Temas', order: 17 },
  'components/debug': { id: 'debug', label: 'Debug & Inspeção', order: 18 },
  'admin': { id: 'admin', label: 'Admin & Layout Administrativo', order: 19 },
  'security-ui': { id: 'security', label: 'Segurança', order: 20 },
  'security': { id: 'security', label: 'Segurança', order: 20 },
};

// Pacotes excluídos (não são componentes visuais de UI)
const EXCLUDE_FOLDER = /packages\/(core|data|ssr|tools)\//;

// Nomes que não são cards de galeria (infraestrutura, serviços, classes internas)
const EXCLUDE_NAME =
  /(Context|Provider|Item|Slide|Service|Manager|Impl)$|(Error|Exception|Helper|Parser|Validator|Logger|Monitor|Detector|Boundary|Utils|DSL|ApiClient|RemoteApi|KeepAlive|AliveAble|DataSource|QueryUtils|JacksonParser|FilterDSL|ClickOutside|ObjectHelper)/;

// Sub-partes e variantes internas de um componente "pai" — não merecem card próprio
// no showroom (ex.: ArchbaseDataGridColumn é configuração do ArchbaseDataGrid).
const EXCLUDE_SUBPART = [
  /^ArchbaseDataGrid.+/, // Column, Toolbar, Pagination, AG, AGColumn, ExcelExport
  /^ArchbaseDetail(Drawer|HoverCard|Modal|Panel|Popover)$/,
  /^Archbase(ExpandButton|GridRowActions|ItemRender)$/,
  /^ArchbaseMarquee(Up|Down|Left|Right)$/, // variantes direcionais do Marquee
  /^Archbase(CODE128|EAN13|EAN8|UPC)Generator$/, // variantes do BarcodeGenerator
  /^ArchbaseSplitPane(Pane|Resizer)$/,
  /^ArchbaseResizable(Handle|Panel)$/, // partes do ResizableLayout
  /^ArchbaseExpansionPanel(Controlled|Single)$/, // variantes do ExpansionPanel
  /^ArchbaseDockLayoutPreset$/,
  /^ArchbaseMasonryResponsive$/, // variante do Masonry
  /^ArchbasePDF(Annotations|AnnotationsList|ViewerToolbar)$/, // partes do PDFViewer
  /^Archbase(DrawerContent|DrawerTrigger|StatefulRoutes)$/,
];

function folderKey(sourcePath = '') {
  const m = sourcePath.match(/packages\/([^/]+)\/src\/([^/]+)/);
  if (!m) return null;
  const pkg = m[1];
  const folder = m[2].replace(/\.[^/]*$/, ''); // remove .context etc
  const full = `${pkg}/${folder}`;
  if (CATEGORY_MAP[full]) return full;
  if (CATEGORY_MAP[pkg]) return pkg; // admin, security, security-ui (pasta por componente)
  return full;
}

// --- Mapa de documentação a partir de components-data.ts ---
function buildDocMap() {
  const src = fs.readFileSync(componentsDataPath, 'utf8');
  const re = /export const \w+: PageHeaderData = \{([\s\S]*?)\n\};/g;
  const map = {};
  let m;
  while ((m = re.exec(src))) {
    const body = m[1];
    const get = (k) => {
      const r = new RegExp(k + ":\\s*'((?:[^'\\\\]|\\\\.)*)'");
      const x = body.match(r);
      return x ? x[1].replace(/\\'/g, "'") : '';
    };
    const title = get('title');
    const docsLink = get('docsLink');
    const description = get('description');
    if (title) map[title] = { docsLink, description };
  }
  return map;
}

function kebab(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

// Resolve o link de documentação de um componente, validando contra páginas reais.
// 1) metadados curados (components-data.ts); 2) convenção de rota por pasta de doc; senão null.
function resolveDocLink(comp, doc) {
  if (doc?.docsLink && pageExists(doc.docsLink)) {
    return `${doc.docsLink}#${comp.name.toLowerCase()}`;
  }
  // Convenção: templates ficam em /templates/<kebab-sem-Archbase>
  const pkg = comp.exportsFrom || '';
  if (pkg.includes('/template')) {
    const route = `/templates/${kebab(comp.name.replace(/^Archbase/, ''))}`;
    if (pageExists(route)) return route;
  }
  return null;
}

// Descrição do catálogo só é confiável se descreve o componente (padrão "Nome — ...")
function catalogDescription(comp) {
  const raw = (comp.description || '').split('\n')[0].trim();
  if (!raw) return '';
  if (raw.startsWith(comp.name + ' —') || raw.startsWith(comp.name + ' -')) {
    return raw.replace(new RegExp('^' + comp.name + '\\s*[—-]\\s*'), '').trim();
  }
  return '';
}

function main() {
  // Resiliente: se o catálogo não estiver disponível mas já houver um
  // gallery.generated.json commitado, mantém o existente em vez de falhar o build.
  if (!fs.existsSync(catalogPath)) {
    if (fs.existsSync(outPath)) {
      console.warn(
        `[gallery] ${path.relative(repoRoot, catalogPath)} ausente — mantendo ${path.relative(repoRoot, outPath)} existente.`,
      );
      return;
    }
    throw new Error(
      `component-catalog.json não encontrado em ${catalogPath} e não há gallery.generated.json para usar como fallback.`,
    );
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const docMap = buildDocMap();

  const components = catalog.components.filter(
    (x) =>
      /^Archbase[A-Z]/.test(x.name) &&
      !EXCLUDE_NAME.test(x.name) &&
      !EXCLUDE_SUBPART.some((re) => re.test(x.name)) &&
      !EXCLUDE_FOLDER.test(x.sourcePath || ''),
  );

  const catById = {};
  let documented = 0;

  for (const comp of components) {
    const key = folderKey(comp.sourcePath);
    const cat = (key && CATEGORY_MAP[key]) || { id: 'outros', label: 'Outros Componentes', order: 99 };
    const doc = docMap[comp.name];
    // Só linka se a página realmente existir (evita 404 de rotas planejadas mas não criadas).
    const docLink = resolveDocLink(comp, doc);
    if (docLink) documented++;
    const description = doc?.description || catalogDescription(comp) || '';

    (catById[cat.id] ??= { id: cat.id, label: cat.label, order: cat.order, components: [] }).components.push({
      name: comp.name,
      description,
      pkg: comp.exportsFrom || '@archbase/components',
      docLink,
    });
  }

  const categories = Object.values(catById)
    .map((c) => ({
      ...c,
      components: c.components.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

  const total = components.length;
  const out = {
    generatedAt: catalog.generatedAt,
    catalogVersion: catalog.version,
    total,
    documented,
    categories: categories.map(({ order, ...c }) => c),
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `gallery.generated.json: ${total} componentes em ${categories.length} categorias (${documented} com doc) -> ${path.relative(repoRoot, outPath)}`,
  );
}

main();
