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

function isDebugMode() {
  return process.argv.includes('--debug');
}

function getAllPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs.readdirSync(packagesDir).filter(dir => {
    const packagePath = path.join(packagesDir, dir, 'package.json');
    return fs.existsSync(packagePath);
  });
  return packages;
}

function getPackageInfo(packageName) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson;
}

function updatePackageForPack(packageName, isDebug) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Limpar arquivos .tgz existentes no dist
  const distPath = path.join(process.cwd(), 'packages', packageName, 'dist');
  if (fs.existsSync(distPath)) {
    const tgzFiles = fs.readdirSync(distPath).filter(file => file.endsWith('.tgz'));
    tgzFiles.forEach(file => {
      const filePath = path.join(distPath, file);
      fs.unlinkSync(filePath);
      log(`   🗑️  Removido arquivo antigo: ${file}`, YELLOW);
    });
  }
  
  // Fazer backup do package.json original
  const backupPath = `${packageJsonPath}.backup`;
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Atualizar dependências internas para usar versões específicas no pack
  const version = packageJson.version;
  
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.dependencies[dep] = version;
      }
    });
  }
  
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.devDependencies[dep] = version;
      }
    });
  }
  
  // Garantir que exports estão corretos
  if (!packageJson.exports) {
    packageJson.exports = {};
  }
  
  packageJson.exports['.'] = {
    types: './dist/index.d.ts',
    import: './dist/index.js',
    require: './dist/index.js'
  };
  
  // Adicionar export CSS se houver
  const cssPath = path.join(process.cwd(), 'packages', packageName, 'dist', 'index.css');
  if (fs.existsSync(cssPath)) {
    packageJson.exports['./dist/index.css'] = './dist/index.css';
  }
  
  // Garantir campos obrigatórios
  packageJson.main = './dist/index.js';
  packageJson.module = './dist/index.js';
  packageJson.types = './dist/index.d.ts';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  return packageJson;
}

function restorePackageJson(packageName) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const backupPath = `${packageJsonPath}.backup`;
  
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, packageJsonPath);
  }
}

function packPackage(packageName, isDebug) {
  const packageDir = path.join(process.cwd(), 'packages', packageName);
  const distPath = path.join(packageDir, 'dist');
  
  log(`📦 Empacotando @archbase/${packageName}${isDebug ? ' (DEBUG)' : ''}...`, BLUE);
  
  try {
    // Verificar se o build existe
    if (!fs.existsSync(distPath)) {
      throw new Error(`Diretório dist não encontrado. Execute 'npm run build' primeiro.`);
    }
    
    const jsFile = path.join(distPath, 'index.js');
    if (!fs.existsSync(jsFile)) {
      throw new Error(`index.js não encontrado no dist. Execute 'npm run build' primeiro.`);
    }
    
    // Atualizar package.json para pack
    const updatedPackageJson = updatePackageForPack(packageName, isDebug);
    
    // Executar pack
    const result = execSync(`cd ${packageDir} && pnpm pack`, { encoding: 'utf8' });
    
    // Encontrar o arquivo .tgz gerado
    const tgzFiles = fs.readdirSync(packageDir).filter(file => file.endsWith('.tgz'));
    if (tgzFiles.length === 0) {
      throw new Error(`Arquivo .tgz não foi gerado`);
    }
    
    const tgzFile = tgzFiles[0];
    const tgzPath = path.join(packageDir, tgzFile);
    const tgzSize = (fs.statSync(tgzPath).size / 1024).toFixed(2);
    
    // Mover arquivo .tgz para diretório dist
    const finalTgzPath = path.join(distPath, tgzFile);
    fs.renameSync(tgzPath, finalTgzPath);
    
    log(`✅ @archbase/${packageName} - ${tgzFile} (${tgzSize}KB)`, GREEN);
    
    // Restaurar package.json original
    restorePackageJson(packageName);
    
    return { success: true, tgzFile, tgzSize };
  } catch (error) {
    log(`❌ Erro ao empacotar @archbase/${packageName}: ${error.message}`, RED);
    
    // Restaurar package.json original em caso de erro
    restorePackageJson(packageName);
    
    return { success: false, error: error.message };
  }
}

function main() {
  const isDebug = isDebugMode();
  const mode = isDebug ? 'DEBUG' : 'RELEASE';
  
  log(`📦 Iniciando empacotamento em modo ${mode}...`, BLUE);
  
  const packages = getAllPackages();
  const packOrder = [
    'core',
    'data',
    'security',
    'layout',
    'components',
    'advanced',
    'admin',
    'template',
    'tools'
  ];
  
  // Ordenar packages por dependências
  const sortedPackages = packOrder.filter(pkg => packages.includes(pkg));
  const remainingPackages = packages.filter(pkg => !packOrder.includes(pkg));
  const allPackages = [...sortedPackages, ...remainingPackages];
  
  log(`📦 Packages para empacotamento: ${allPackages.join(', ')}`, BLUE);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  let totalSize = 0;
  
  for (const packageName of allPackages) {
    const result = packPackage(packageName, isDebug);
    results.push({ packageName, ...result });
    
    if (result.success) {
      successful++;
      totalSize += parseFloat(result.tgzSize);
    } else {
      failed++;
    }
  }
  
  log(`\n📋 Resumo do empacotamento (${mode}):`, BLUE);
  results.forEach(({ packageName, success, tgzFile, tgzSize, error }) => {
    const status = success ? '✅' : '❌';
    const color = success ? GREEN : RED;
    const info = success ? `${tgzFile} (${tgzSize}KB)` : error;
    log(`${status} @archbase/${packageName} - ${info}`, color);
  });
  
  log(`\n📊 Estatísticas:`, BLUE);
  log(`✅ Sucessos: ${successful}`, GREEN);
  if (failed > 0) {
    log(`❌ Falhas: ${failed}`, RED);
  }
  log(`📦 Tamanho total: ${totalSize.toFixed(2)}KB`, BLUE);
  
  if (failed === 0) {
    log(`\n🎉 Empacotamento ${mode} concluído com sucesso!`, GREEN);
    log(`💡 Próximo passo: npm run publish:verdaccio`, BLUE);
  } else {
    log(`\n💥 Empacotamento ${mode} falhou em ${failed} package(s)`, RED);
    process.exit(1);
  }
}

main();