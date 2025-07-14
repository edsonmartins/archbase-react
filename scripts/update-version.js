#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

function log(message, color = '') {
  console.log(`${color}${message}${RESET}`);
}

function getNewVersion() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    log('❌ Você deve especificar uma versão. Ex: npm run version:update 3.0.11', RED);
    process.exit(1);
  }
  return args[0];
}

function validateVersion(version) {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(version)) {
    log(`❌ Versão inválida: ${version}. Use formato semver (ex: 3.0.11)`, RED);
    process.exit(1);
  }
}

function updateRootPackageJson(version) {
  const rootPackageJsonPath = path.join(process.cwd(), 'package.json');
  const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  
  rootPackageJson.version = version;
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2) + '\n');
  log(`✅ Versão do projeto principal atualizada para ${version}`, GREEN);
}

function getAllPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs.readdirSync(packagesDir).filter(dir => {
    const packagePath = path.join(packagesDir, dir, 'package.json');
    return fs.existsSync(packagePath);
  });
  return packages;
}

function updatePackageJson(packageName, version) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Atualizar versão do package
  packageJson.version = version;
  
  // Atualizar dependências internas usando workspace durante desenvolvimento
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.dependencies[dep] = 'workspace:*';
      }
    });
  }
  
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.devDependencies[dep] = 'workspace:*';
      }
    });
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  return packageJson;
}

function updateViteConfig(packageName, version) {
  const viteConfigPath = path.join(process.cwd(), 'packages', packageName, 'vite.config.ts');
  
  if (!fs.existsSync(viteConfigPath)) {
    return;
  }
  
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Atualizar versões específicas das dependências archbase no build
  const packages = getAllPackages();
  packages.forEach(pkg => {
    const packageName = `@archbase/${pkg}`;
    const workspacePattern = new RegExp(`'${packageName}': 'workspace:\\*'`, 'g');
    const versionPattern = new RegExp(`'${packageName}': '[^']*'`, 'g');
    
    if (viteConfig.includes(`'${packageName}'`)) {
      viteConfig = viteConfig.replace(workspacePattern, `'${packageName}': '${version}'`);
      viteConfig = viteConfig.replace(versionPattern, `'${packageName}': '${version}'`);
    }
  });
  
  fs.writeFileSync(viteConfigPath, viteConfig);
}

function createViteConfigTemplate(packageName, version) {
  const viteConfigPath = path.join(process.cwd(), 'packages', packageName, 'vite.config.ts');
  
  if (fs.existsSync(viteConfigPath)) {
    return;
  }
  
  const packages = getAllPackages();
  const externals = packages
    .filter(pkg => pkg !== packageName)
    .map(pkg => `    '@archbase/${pkg}': '${version}'`)
    .join(',\n');
  
  const viteConfigTemplate = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.*', '**/*.spec.*'],
      outputDir: 'dist',
      strictOutput: true,
      logLevel: 'warn'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/dates',
        '@mantine/notifications',
        '@mantine/modals',
        '@mantine/dropzone',
        '@mantine/spotlight',
        '@mantine/emotion'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'index.css';
          }
          return assetInfo.name || '';
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020'
  }
});
`;
  
  fs.writeFileSync(viteConfigPath, viteConfigTemplate);
}

function main() {
  const version = getNewVersion();
  validateVersion(version);
  
  log(`🚀 Atualizando versão para ${version}...`, BLUE);
  
  // Atualizar package.json principal
  updateRootPackageJson(version);
  
  // Obter todos os packages
  const packages = getAllPackages();
  
  log(`📦 Packages encontrados: ${packages.join(', ')}`, BLUE);
  
  // Atualizar cada package
  packages.forEach(packageName => {
    log(`\n📝 Atualizando package: @archbase/${packageName}`, YELLOW);
    
    const packageJson = updatePackageJson(packageName, version);
    updateViteConfig(packageName, version);
    createViteConfigTemplate(packageName, version);
    
    log(`✅ @archbase/${packageName} atualizado para ${version}`, GREEN);
  });
  
  log(`\n📋 Resumo da atualização:`, BLUE);
  log(`✅ Projeto principal: ${version}`, GREEN);
  packages.forEach(pkg => {
    log(`✅ @archbase/${pkg}: ${version}`, GREEN);
  });
  
  log(`\n📝 Dependências internas configuradas como workspace:* para desenvolvimento`, YELLOW);
  log(`📦 Vite configs configurados para usar versões específicas no build`, YELLOW);
  
  log(`\n🎉 Atualização de versão concluída!`, GREEN);
  log(`💡 Próximos passos:`, BLUE);
  log(`   1. npm run build - Compilar packages`, BLUE);
  log(`   2. npm run pack - Empacotar packages`, BLUE);
  log(`   3. npm run publish:verdaccio - Publicar no verdaccio`, BLUE);
}

main();