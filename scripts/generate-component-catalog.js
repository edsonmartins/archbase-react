// Generate a component catalog by scanning exports in packages/*/index.ts*
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const repoRoot = process.cwd();

const recipes = [
  {
    name: 'Form completo',
    description: 'ArchbaseEdit + DatePicker + ActionButtons com dataSource',
    code: "<ArchbaseEdit dataSource={ds} dataField='name' required />",
    componentsUsed: ['ArchbaseEdit', 'ArchbaseDatePickerEdit', 'ArchbaseActionButtons']
  },
  {
    name: 'DataGrid com actions',
    description: 'Grid com toolbar, paginação e export',
    code: "<ArchbaseDataGrid dataSource={ds} columns={cols} toolbar={{globalSearch:true}} />",
    componentsUsed: ['ArchbaseDataGrid']
  },
  {
    name: 'Fluxo modal/drawer',
    description: 'Confirm dialog para ações destrutivas',
    code: "<ArchbaseDialog title='Excluir' message='Confirmar?' onConfirm={doDelete} onCancel={close} />",
    componentsUsed: ['ArchbaseDialog']
  },
  {
    name: 'Layout admin',
    description: 'Header + filtros + grid usando templates',
    code: "<ArchbaseSpaceTemplate title='Clientes' content={<ArchbaseDataGrid dataSource={ds} columns={cols} />} />",
    componentsUsed: ['ArchbaseSpaceTemplate', 'ArchbaseDataGrid']
  },
  {
    name: 'Notificações',
    description: 'Toast padrão via Notifications',
    code: "<ArchbaseNotifications position='top-right' />",
    componentsUsed: ['ArchbaseNotifications']
  },
  {
    name: 'Busca remota',
    description: 'Autocomplete com loadData remoto',
    code: "<ArchbaseAsyncSelect label='Empresa' loadData={fetchCompanies} onChangeValue={(v)=>ds.setFieldValue('companyId', v)} />",
    componentsUsed: ['ArchbaseAsyncSelect']
  },
  {
    name: 'Upload/anexos',
    description: 'Gerenciar anexos simples',
    code: "<ArchbaseFileAttachment accept='image/*' maxFiles={3} onAttachmentsChange={uploadFiles} />",
    componentsUsed: ['ArchbaseFileAttachment']
  },
  {
    name: 'Wizard/Stepper',
    description: 'Fluxo multi-etapas com FormTemplate ou AdvancedTabs',
    code: "<ArchbaseFormTemplate dataSource={ds} title='Wizard' renderForm={()=><ArchbaseEdit dataSource={ds} dataField='name' />} />",
    componentsUsed: ['ArchbaseFormTemplate', 'ArchbaseEdit']
  }
];

const foundations = {
  providers: ['ArchbaseGlobalProvider', 'ArchbaseSSRProvider', 'ArchbaseTanStackProvider', 'ArchbaseSecurityProvider'],
  theme: 'MantineThemeOverride via ArchbaseGlobalProvider (themeLight/themeDark, colorScheme)',
  tokens: ['colorScheme', 'radius', 'spacing', 'fontFamily'],
  i18n: 'initArchbaseI18nEarly + useArchbaseTranslation'
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/index\.tsx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function derivePackageName(filePath) {
  const parts = filePath.split(path.sep);
  const pkgIndex = parts.indexOf('packages');
  if (pkgIndex >= 0 && pkgIndex + 1 < parts.length) {
    return parts[pkgIndex + 1];
  }
  return 'root';
}

function deriveTags(name, sourcePath) {
  const tags = new Set();
  const lower = name.toLowerCase();
  const pathLower = sourcePath.toLowerCase();

  if (lower.startsWith('use')) tags.add('hook');
  if (lower.includes('provider') || lower.includes('context')) tags.add('provider');
  if (lower.includes('template')) tags.add('template');
  if (pathLower.includes('editors')) tags.add('editor');
  if (pathLower.includes('form')) tags.add('form');
  if (pathLower.includes('datagrid') || lower.includes('grid')) tags.add('data');
  if (pathLower.includes('security')) tags.add('security');
  if (pathLower.includes('layout')) tags.add('layout');
  if (pathLower.includes('debug') || pathLower.includes('dev-utils')) tags.add('devtools');
  if (pathLower.includes('ssr')) tags.add('ssr');
  if (pathLower.includes('jsonschema')) tags.add('json');
  if (pathLower.includes('charts') || lower.includes('chart')) tags.add('chart');

  return Array.from(tags);
}

function cleanComment(text) {
  return text
    .replace(/^[\s]*\/\/+[\s]?/gm, '')
    .replace(/^[\s]*\/\*+[\s]?/gm, '')
    .replace(/\*+\/[\s]?$/gm, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();
}

const propDescriptionOverrides = {
  dataSource:
    'Instância do ArchbaseDataSource (v1 ou v2) usada para sincronizar registros, validações e payloads.',
  dataField: 'Nome do campo no dataSource que o editor lê e escreve.',
  value: 'Valor controlado atual exibido no componente.',
  label: 'Texto principal exibido acima do controle.',
  description: 'Texto auxiliar exibido abaixo do label para orientar o usuário.',
  placeholder: 'Dica exibida enquanto não há valor definido.',
  onChange: 'Callback nativo acionado quando o campo muda.',
  onChangeValue: 'Callback com o novo valor (sem o evento) para sincronizar com o dataSource.',
  onConfirm: 'Callback executado quando o usuário confirma a ação.',
  onCancel: 'Callback executado quando o usuário cancela a ação.',
  onClose: 'Callback disparado ao fechar modal/drawer.',
  opened: 'Controla se o modal/drawer está aberto ou fechado.',
  renderItem: 'Função que recebe cada item e retorna o JSX correspondente.',
  itemComponent: 'Componente customizado para renderizar itens da lista.',
  children: 'Elementos React renderizados dentro do componente.',
  columns: 'Definição das colunas apresentadas em listas ou grids.',
  actions: 'Lista de ações exibidas no toolbar ou footer.',
  toolbar: 'Configuração de toolbar (botões, filtros, search).',
  pagination: 'Configuração e componentes usados para paginação.',
  filters: 'Valores e controles aplicados ao filtro dos dados.',
  loading: 'Indicador booleano que sinaliza carregamento de dados.',
  disabled: 'Bloqueia interações quando verdadeiro.',
  readOnly: 'Evita edição direta quando verdadeiro.',
  required: 'Marca o campo como obrigatório na validação.',
  size: 'Define a escala (sm/md/lg) do componente.',
  variant: 'Variação visual (filled, outlined, light, subtle).',
  className: 'Classe CSS adicionada ao wrapper principal.',
  styles: 'Objeto Mantine que sobrescreve estilos por parte.',
  classNames: 'Mapeamento Mantine de classes para slots internos.',
  icon: 'Ícone exibido dentro do controle.',
  valueField: 'Nome do campo que representa o valor interno.',
  displayField: 'Nome do campo usado para renderizar labels lidos.',
  maxLength: 'Limite máximo de caracteres permitido.',
  minLength: 'Limite mínimo de caracteres obrigatório.',
  maxDate: 'Data máxima aceitável (Date ou string compatível).',
  minDate: 'Data mínima aceitável (Date ou string compatível).',
  theme: 'Objeto MantineThemeOverride para personalizar tema.',
  onAction: 'Callback executado ao selecionar uma ação de toolbar.',
  items: 'Array com os dados/itens exibidos pela lista.',
  detailPanel: 'Componente ou função que renderiza o painel detalhado por linha na grid.'
};

function describeProp(propName, type) {
  if (propDescriptionOverrides[propName]) {
    return propDescriptionOverrides[propName];
  }

  const normalized = propName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  const words = normalized.trim().toLowerCase();
  const typeSuffix = type ? ` (${type})` : '';

  if (/^on[A-Z]/.test(propName)) {
    const action = words
      .replace(/^on /, '')
      .replace(/^action /, '')
      .trim();
    const target = action || 'o evento correspondente';
    return `Callback acionado quando ${target}.${typeSuffix}`;
  }

  if (/^(is|has|allow|can|should)/.test(propName.toLowerCase())) {
    return `Indica se ${words} está habilitado.${typeSuffix}`;
  }

  if (words.includes('render')) {
    const target = words.replace(/render/g, '').trim() || 'conteúdo';
    return `Função para renderizar ${target.trim()}.${typeSuffix}`;
  }

  if (words.includes('children')) {
    return `Conteúdo filho renderizado dentro do componente.${typeSuffix}`;
  }

  if (words) {
    return `Define ${words}.${typeSuffix}`;
  }

  return `Configura ${propName}.${typeSuffix}`;
}

function splitWords(value = '') {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .toLowerCase();
}

function guessCategory(tags = [], sourcePath = '') {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  const pathLower = sourcePath.toLowerCase();
  if (normalizedTags.includes('provider')) return 'provider de contexto';
  if (normalizedTags.includes('hook')) return 'hook utilitário';
  if (normalizedTags.includes('editor') || pathLower.includes('/editors/')) return 'editor de formulários';
  if (normalizedTags.includes('template')) return 'template CRUD';
  if (normalizedTags.includes('security') || pathLower.includes('/security/')) return 'componente de segurança';
  if (normalizedTags.includes('layout') || pathLower.includes('/layout/')) return 'layout estrutural';
  if (normalizedTags.includes('data') || pathLower.includes('/datagrid/')) return 'componente de visualização de dados';
  if (normalizedTags.includes('notification') || pathLower.includes('/notification/')) return 'componente de feedback';
  if (normalizedTags.includes('devtools') || pathLower.includes('/tools/')) return 'ferramenta devtools';
  if (normalizedTags.includes('ssr') || pathLower.includes('/ssr/')) return 'helper SSR';
  return 'componente Archbase';
}

function describeComponent(name, tags, sourcePath) {
  const shortName = name.replace(/^Archbase/i, '').trim();
  const descriptor = splitWords(shortName) || splitWords(name);
  const target = descriptor || 'uso específico';
  const category = guessCategory(tags, sourcePath);
  return `${name} — ${category} focado em ${target}.`;
}

function getJsDocDescription(node, sf) {
  const jsDocs = ts.getJSDocCommentsAndTags(node) || [];
  if (jsDocs.length === 0) return '';
  const raw = jsDocs.map((d) => d.getText(sf)).join('\n');
  return cleanComment(raw);
}

function getJsDocTags(node) {
  const tags = {};
  const jsDocs = ts.getJSDocTags(node) || [];
  for (const tag of jsDocs) {
    const tagName = tag.tagName.getText();
    const comment = cleanComment(tag.comment ? tag.comment.toString() : '');
    tags[tagName] = comment || true;
  }
  return tags;
}

function slugify(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function resolveSourceFile(sourcePath) {
  const candidates = [
    sourcePath,
    `${sourcePath}.tsx`,
    `${sourcePath}.ts`,
    `${sourcePath}.jsx`,
    `${sourcePath}.js`,
    path.join(sourcePath, 'index.ts'),
    path.join(sourcePath, 'index.tsx'),
    path.join(sourcePath, 'index.js')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const stat = fs.statSync(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    }
  }
  return null;
}

function extractDescriptionAndProps(sourcePath) {
  const resolvedPath = resolveSourceFile(sourcePath);
  if (!resolvedPath) return { description: '', propsByBase: {}, interfaceDescriptions: {}, interfaceStatus: {}, fileStatus: '' };
  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) return { description: '', propsByBase: {}, interfaceDescriptions: {}, interfaceStatus: {}, fileStatus: '' };
  const text = fs.readFileSync(resolvedPath, 'utf-8');
  const sf = ts.createSourceFile(sourcePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  // Grab first leading comment as description
  const commentRanges = ts.getLeadingCommentRanges(text, 0) || [];
  let description = '';
  if (commentRanges.length > 0) {
    const first = commentRanges[0];
    description = cleanComment(text.slice(first.pos, first.end));
  } else {
    const match = text.match(/\/\*\*([\s\S]*?)\*\//);
    if (match) {
      description = cleanComment(match[0]);
    }
  }

  const propsByBase = {};
  const interfaceDescriptions = {};
  const interfaceStatus = {};
  let fileStatus = '';

  function visit(node) {
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      if (name.endsWith('Props')) {
        const base = name.replace(/Props$/, '');
        const interfaceDesc = getJsDocDescription(node, sf);
        if (interfaceDesc) interfaceDescriptions[base] = interfaceDesc;
        const tags = getJsDocTags(node);
        if (tags.status) interfaceStatus[base] = String(tags.status).toLowerCase();
        const props = node.members
          .filter(ts.isPropertySignature)
          .map((m) => {
            const propName = m.name.getText(sf);
            const type = m.type ? m.type.getText(sf) : 'unknown';
            const optional = Boolean(m.questionToken);
            const propDescription = getJsDocDescription(m, sf);
            const tags = getJsDocTags(m);
            const defaultValue = tags.default || undefined;
            const fallbackDescription = propDescription || describeProp(propName, type);
            return { name: propName, type, required: !optional, description: fallbackDescription, default: defaultValue };
          });
        propsByBase[base] = props;
      }
    } else if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
      // try to capture component description from JSdoc on function/variable
      const jsDesc = getJsDocDescription(node, sf);
      const tags = getJsDocTags(node);
      if (jsDesc && !description) {
        description = jsDesc;
      }
      if (!fileStatus && tags.status) fileStatus = String(tags.status).toLowerCase();
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  return { description, propsByBase, interfaceDescriptions, interfaceStatus, fileStatus };
}

function parseExports(filePath, components) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, rawNames, source] = match;
    if (!source.startsWith('.')) continue; // ignore package reexports; focus on local components
    const names = rawNames.split(',').map((n) => n.trim()).filter(Boolean);
    for (const nameRaw of names) {
      const name = nameRaw.includes(' as ') ? nameRaw.split(' as ').pop().trim() : nameRaw;
      const absSource = path.resolve(path.dirname(filePath), source);
      const relSource = path.relative(repoRoot, absSource);
      const pkg = derivePackageName(filePath);
      const tags = deriveTags(name, relSource);
      const existing = components.get(name);
      components.set(name, {
        name,
        description: existing?.description || '',
        sourcePath: relSource,
        exportsFrom: `@archbase/${pkg}`,
        props: existing?.props || [],
        examples: existing?.examples || [],
        tags: tags.length ? tags : existing?.tags || []
      });
    }
  }
}

function enrichWithProps(components) {
  const bySource = new Map();
  for (const comp of components.values()) {
    if (!bySource.has(comp.sourcePath)) {
      const abs = path.join(repoRoot, comp.sourcePath);
      bySource.set(comp.sourcePath, extractDescriptionAndProps(abs));
    }
  }

  for (const comp of components.values()) {
    const info = bySource.get(comp.sourcePath);
    if (!info) continue;
    if (!comp.description && info.description) comp.description = info.description;
    const base = comp.name;
    const props = info.propsByBase[base];
    if (props && props.length > 0) comp.props = props;
    if (!comp.description && info.interfaceDescriptions?.[base]) comp.description = info.interfaceDescriptions[base];
    const statusFromInterface = info.interfaceStatus?.[base];
    if (statusFromInterface) comp.status = statusFromInterface;
    if (!comp.status && info.fileStatus) comp.status = info.fileStatus;
    const statusMatch = /@status\\s+(\\w+)/i.exec(comp.description || '');
    if (!comp.status && statusMatch) comp.status = statusMatch[1].toLowerCase();
    if (!comp.description || comp.description.trim().length === 0) {
      comp.description = describeComponent(comp.name, comp.tags || [], comp.sourcePath || '');
    }
  }
}

function buildCatalog() {
  const components = new Map();
  const files = walk(path.join(repoRoot, 'packages'));
  files.forEach((file) => parseExports(file, components));
  enrichWithProps(components);
  const canonicalBase = (process.env.CATALOG_CANONICAL_BASE || '').replace(/\/+$/, '');
  if (canonicalBase) {
    for (const comp of components.values()) {
      comp.canonicalUrl = `${canonicalBase}/${slugify(comp.name)}`;
    }
  } else {
    for (const comp of components.values()) {
      if (!comp.canonicalUrl) {
        comp.canonicalUrl = comp.sourcePath;
      }
    }
  }

  return {
    version: '0.6.1',
    generatedAt: new Date().toISOString().split('T')[0],
    foundations,
    components: Array.from(components.values()).sort((a, b) => a.name.localeCompare(b.name)),
    recipes
  };
}

function main() {
  const catalog = buildCatalog();
  const targetPath = path.join(repoRoot, 'component-catalog.json');
  fs.writeFileSync(targetPath, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Catalog generated with ${catalog.components.length} entries at ${targetPath}`);
}

main();
