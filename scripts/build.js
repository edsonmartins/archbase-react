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

function updatePackageForBuild(packageName, isDebug) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Fazer backup do package.json original
  const backupPath = `${packageJsonPath}.backup`;
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Atualizar dependências internas para usar versões específicas no build
  const version = packageJson.version;
  
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.dependencies[dep] = isDebug ? `${version}-debug.${Date.now()}` : version;
      }
    });
  }
  
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => {
      if (dep.startsWith('@archbase/')) {
        packageJson.devDependencies[dep] = isDebug ? `${version}-debug.${Date.now()}` : version;
      }
    });
  }
  
  // Atualizar versão se for debug
  if (isDebug) {
    packageJson.version = `${version}-debug.${Date.now()}`;
  }
  
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

function buildPackage(packageName, isDebug) {
  const packageDir = path.join(process.cwd(), 'packages', packageName);
  const buildOptions = isDebug ? '' : '--minify';
  
  log(`📦 Construindo @archbase/${packageName}${isDebug ? ' (DEBUG)' : ''}...`, BLUE);
  
  try {
    // Limpar dist anterior
    execSync(`rm -rf ${path.join(packageDir, 'dist')}`, { stdio: 'inherit' });
    
    // Atualizar package.json para build
    const updatedPackageJson = updatePackageForBuild(packageName, isDebug);
    
    // Executar build
    execSync(`cd ${packageDir} && pnpm build ${buildOptions}`, { stdio: 'inherit' });
    
    // Verificar se o build foi bem-sucedido
    const distPath = path.join(packageDir, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error(`Build falhou - diretório dist não foi criado`);
    }
    
    const jsFile = path.join(distPath, 'index.js');
    const cssFile = path.join(distPath, 'index.css');
    const dtsFile = path.join(distPath, 'index.d.ts');
    
    if (!fs.existsSync(jsFile)) {
      throw new Error(`Build falhou - index.js não foi gerado`);
    }
    
    // Exibir estatísticas
    const stats = [];
    if (fs.existsSync(jsFile)) {
      const jsSize = (fs.statSync(jsFile).size / 1024).toFixed(2);
      stats.push(`JS: ${jsSize}KB`);
    }
    if (fs.existsSync(cssFile)) {
      const cssSize = (fs.statSync(cssFile).size / 1024).toFixed(2);
      stats.push(`CSS: ${cssSize}KB`);
    }
    if (fs.existsSync(dtsFile)) {
      stats.push(`Types: ✓`);
    }
    
    log(`✅ @archbase/${packageName} - ${stats.join(', ')}`, GREEN);
    
    // Restaurar package.json original
    restorePackageJson(packageName);
    
    return true;
  } catch (error) {
    log(`❌ Erro ao construir @archbase/${packageName}: ${error.message}`, RED);
    
    // Restaurar package.json original em caso de erro
    restorePackageJson(packageName);
    
    return false;
  }
}

function main() {
  const isDebug = isDebugMode();
  const mode = isDebug ? 'DEBUG' : 'RELEASE';
  
  log(`🚀 Iniciando build em modo ${mode}...`, BLUE);
  
  const packages = getAllPackages();
  const buildOrder = [
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
  const sortedPackages = buildOrder.filter(pkg => packages.includes(pkg));
  const remainingPackages = packages.filter(pkg => !buildOrder.includes(pkg));
  const allPackages = [...sortedPackages, ...remainingPackages];
  
  log(`📦 Packages para build: ${allPackages.join(', ')}`, BLUE);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  for (const packageName of allPackages) {
    const result = buildPackage(packageName, isDebug);
    results.push({ packageName, success: result });
    
    if (result) {
      successful++;
    } else {
      failed++;
    }
  }
  
  log(`\n📋 Resumo do build (${mode}):`, BLUE);
  results.forEach(({ packageName, success }) => {
    const status = success ? '✅' : '❌';
    const color = success ? GREEN : RED;
    log(`${status} @archbase/${packageName}`, color);
  });
  
  log(`\n📊 Estatísticas:`, BLUE);
  log(`✅ Sucessos: ${successful}`, GREEN);
  if (failed > 0) {
    log(`❌ Falhas: ${failed}`, RED);
  }
  
  if (failed === 0) {
    log(`\n🎉 Build ${mode} concluído com sucesso!`, GREEN);
    log(`💡 Próximo passo: npm run pack${isDebug ? ':debug' : ''}`, BLUE);
  } else {
    log(`\n💥 Build ${mode} falhou em ${failed} package(s)`, RED);
    process.exit(1);
  }
}

main();