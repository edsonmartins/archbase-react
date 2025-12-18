const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../../docs-site-backup/docs');
const CONTENT_DIR = path.join(__dirname, '../content');
const PAGES_DIR = path.join(__dirname, '../pages');

// Remove frontmatter from MDX content
function removeFrontmatter(content) {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return content.replace(frontmatterRegex, '');
}

// Convert Docusaurus admonitions to MdxInfo
function convertAdmonitions(content) {
  // :::note -> <MdxInfo type="info">
  // :::warning -> <MdxInfo type="warning">
  // :::danger -> <MdxInfo type="danger">
  // :::tip -> <MdxInfo type="success">
  return content
    .replace(/:::note\n([\s\S]*?):::/g, '<MdxInfo type="info">\n$1</MdxInfo>')
    .replace(/:::warning\n([\s\S]*?):::/g, '<MdxInfo type="warning">\n$1</MdxInfo>')
    .replace(/:::danger\n([\s\S]*?):::/g, '<MdxInfo type="danger">\n$1</MdxInfo>')
    .replace(/:::tip\n([\s\S]*?):::/g, '<MdxInfo type="success">\n$1</MdxInfo>')
    .replace(/:::info\n([\s\S]*?):::/g, '<MdxInfo type="info">\n$1</MdxInfo>');
}

// Process MDX content
function processMdxContent(content) {
  let processed = removeFrontmatter(content);
  processed = convertAdmonitions(processed);
  return processed;
}

// Generate page file content
function generatePageContent(relativePath) {
  const pathParts = relativePath.replace('.mdx', '').split('/');
  const importPath = pathParts.join('/');
  const currentPath = '/' + importPath;

  // Calculate relative path to components
  const depth = pathParts.length;
  const prefix = '../'.repeat(depth);

  return `import { Shell } from '${prefix}components/Shell';
import Content from '${prefix}content/${importPath}.mdx';

export default function Page() {
  return (
    <Shell currentPath="${currentPath}">
      <Content />
    </Shell>
  );
}
`;
}

// Recursively get all MDX files
function getMdxFiles(dir, basePath = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath, relativePath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push({
        fullPath,
        relativePath,
      });
    }
  }

  return files;
}

// Main migration function
function migrate() {
  console.log('Starting MDX migration...\n');

  const mdxFiles = getMdxFiles(SOURCE_DIR);
  console.log(`Found ${mdxFiles.length} MDX files to migrate.\n`);

  for (const { fullPath, relativePath } of mdxFiles) {
    // Skip intro.mdx as we handle it separately
    if (relativePath === 'intro.mdx') {
      console.log(`Skipping ${relativePath} (handled separately)`);
      continue;
    }

    // Read and process content
    const content = fs.readFileSync(fullPath, 'utf-8');
    const processedContent = processMdxContent(content);

    // Write content file
    const contentPath = path.join(CONTENT_DIR, relativePath);
    const contentDir = path.dirname(contentPath);
    fs.mkdirSync(contentDir, { recursive: true });
    fs.writeFileSync(contentPath, processedContent);
    console.log(`Created content: ${relativePath}`);

    // Generate and write page file
    const pagePath = path.join(PAGES_DIR, relativePath.replace('.mdx', '.tsx'));
    const pageDir = path.dirname(pagePath);
    fs.mkdirSync(pageDir, { recursive: true });
    const pageContent = generatePageContent(relativePath);
    fs.writeFileSync(pagePath, pageContent);
    console.log(`Created page: ${relativePath.replace('.mdx', '.tsx')}`);
  }

  console.log('\nMigration complete!');
}

migrate();
