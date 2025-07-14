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

function getTgzFile(packageName) {
  const distPath = path.join(process.cwd(), 'packages', packageName, 'dist');
  if (!fs.existsSync(distPath)) {
    return null;
  }
  
  const tgzFiles = fs.readdirSync(distPath).filter(file => file.endsWith('.tgz'));
  return tgzFiles.length > 0 ? path.join(distPath, tgzFiles[0]) : null;
}

function checkVerdaccioStatus() {
  try {
    execSync('pnpm config get registry', { stdio: 'pipe' });
    const registry = execSync('pnpm config get registry', { encoding: 'utf8' }).trim();
    
    if (registry.includes('verdaccio') || registry.includes('localhost')) {
      log(`✅ Registry configurado para: ${registry}`, GREEN);
      return true;
    } else {
      log(`⚠️  Registry atual: ${registry}`, YELLOW);
      log(`💡 Para usar verdaccio, configure: pnpm config set registry http://localhost:4873`, BLUE);
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao verificar registry: ${error.message}`, RED);
    return false;
  }
}

function publishPackage(packageName) {
  const packageDir = path.join(process.cwd(), 'packages', packageName);
  const tgzFile = getTgzFile(packageName);
  
  log(`📦 Publicando @archbase/${packageName}...`, BLUE);
  
  try {
    // Verificar se o arquivo .tgz existe
    if (!tgzFile) {
      throw new Error(`Arquivo .tgz não encontrado. Execute 'npm run pack' primeiro.`);
    }
    
    // Verificar se o dist existe
    const distPath = path.join(packageDir, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error(`Diretório dist não encontrado. Execute 'npm run build' primeiro.`);
    }
    
    // Obter informações do package
    const packageInfo = getPackageInfo(packageName);
    
    // Tentar despublicar a versão existente primeiro (ignora erro se não existir)
    try {
      const unpublishCommand = `pnpm unpublish @archbase/${packageName}@${packageInfo.version} --force`;
      log(`   Removendo versão existente: ${unpublishCommand}`, YELLOW);
      execSync(unpublishCommand, { stdio: 'pipe' });
      log(`   ✅ Versão existente removida`, GREEN);
    } catch (unpublishError) {
      // Ignora erro se a versão não existir
      log(`   ℹ️  Versão não existia ou erro ao remover (continuando...)`, YELLOW);
    }
    
    // Publicar usando o arquivo .tgz
    const publishCommand = `pnpm publish ${tgzFile} --access public --no-git-checks`;
    
    log(`   Executando: ${publishCommand}`, YELLOW);
    execSync(publishCommand, { stdio: 'inherit' });
    
    log(`✅ @archbase/${packageName}@${packageInfo.version} publicado com sucesso`, GREEN);
    
    return { success: true, version: packageInfo.version };
  } catch (error) {
    log(`❌ Erro ao publicar @archbase/${packageName}: ${error.message}`, RED);
    return { success: false, error: error.message };
  }
}

function main() {
  log(`🚀 Iniciando publicação no Verdaccio...`, BLUE);
  
  // Verificar se o Verdaccio está configurado
  if (!checkVerdaccioStatus()) {
    log(`⚠️  Continuar mesmo assim? (Ctrl+C para cancelar)`, YELLOW);
    // Esperar 3 segundos para dar tempo ao usuário cancelar
    execSync('sleep 3', { stdio: 'inherit' });
  }
  
  const packages = getAllPackages();
  const publishOrder = [
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
  const sortedPackages = publishOrder.filter(pkg => packages.includes(pkg));
  const remainingPackages = packages.filter(pkg => !publishOrder.includes(pkg));
  const allPackages = [...sortedPackages, ...remainingPackages];
  
  log(`📦 Packages para publicação: ${allPackages.join(', ')}`, BLUE);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  for (const packageName of allPackages) {
    const result = publishPackage(packageName);
    results.push({ packageName, ...result });
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
    
    // Pequena pausa entre publicações
    if (packageName !== allPackages[allPackages.length - 1]) {
      log(`   Aguardando...`, YELLOW);
      execSync('sleep 1', { stdio: 'inherit' });
    }
  }
  
  log(`\n📋 Resumo da publicação:`, BLUE);
  results.forEach(({ packageName, success, version, error }) => {
    const status = success ? '✅' : '❌';
    const color = success ? GREEN : RED;
    const info = success ? `v${version}` : error;
    log(`${status} @archbase/${packageName} - ${info}`, color);
  });
  
  log(`\n📊 Estatísticas:`, BLUE);
  log(`✅ Sucessos: ${successful}`, GREEN);
  if (failed > 0) {
    log(`❌ Falhas: ${failed}`, RED);
  }
  
  if (failed === 0) {
    log(`\n🎉 Publicação concluída com sucesso!`, GREEN);
    log(`💡 Packages disponíveis no registry configurado`, BLUE);
  } else {
    log(`\n💥 Publicação falhou em ${failed} package(s)`, RED);
    process.exit(1);
  }
}

main();