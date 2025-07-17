#!/usr/bin/env node

/**
 * Script para publicar versões debug no Verdaccio
 * Uso: node scripts/publish-debug.js
 */

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

const VERDACCIO_URL = 'http://192.168.1.110:4873';

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

function updatePackageForDebug(packageName) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Fazer backup
  const backupPath = `${packageJsonPath}.backup`;
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));
  
  // Criar versão debug
  const baseVersion = packageJson.version.replace(/-debug.*$/, '');
  const debugVersion = `${baseVersion}-debug`;
  packageJson.version = debugVersion;
  packageJson.files = ['dist', 'src'];
  packageJson.publishConfig = { registry: VERDACCIO_URL };
  
  // Resolver dependências workspace:* para versões específicas
  const resolveWorkspaceDependencies = (deps) => {
    if (!deps) return;
    
    for (const [depName, depVersion] of Object.entries(deps)) {
      if (depVersion === 'workspace:*' && depName.startsWith('@archbase/')) {
        // Pegar a versão do package dependency
        const depPackageName = depName.split('/')[1];
        const depPackageJsonPath = path.join(process.cwd(), 'packages', depPackageName, 'package.json');
        
        if (fs.existsSync(depPackageJsonPath)) {
          const depPackageJson = JSON.parse(fs.readFileSync(depPackageJsonPath, 'utf8'));
          const depBaseVersion = depPackageJson.version.replace(/-debug.*$/, '');
          deps[depName] = `${depBaseVersion}-debug`;
          
          log(`🔗 Resolvendo ${depName}: workspace:* → ${deps[depName]}`, YELLOW);
        }
      }
    }
  };
  
  // Resolver em dependencies, devDependencies e peerDependencies
  resolveWorkspaceDependencies(packageJson.dependencies);
  resolveWorkspaceDependencies(packageJson.devDependencies);
  resolveWorkspaceDependencies(packageJson.peerDependencies);
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  return debugVersion;
}

function restorePackageJson(packageName) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const backupPath = `${packageJsonPath}.backup`;
  
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, packageJsonPath);
  }
}

function cleanupVerdaccioPackage(packageName) {
  log(`🧹 Limpando @archbase/${packageName} do Verdaccio...`, YELLOW);
  
  try {
    // Listar todas as versões do package
    const result = execSync(`npm view @archbase/${packageName} versions --json --registry=${VERDACCIO_URL}`, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    const versions = JSON.parse(result);
    const versionsArray = Array.isArray(versions) ? versions : [versions];
    
    // Despublicar todas as versões debug
    for (const version of versionsArray) {
      if (version.includes('-debug')) {
        try {
          execSync(`npm unpublish @archbase/${packageName}@${version} --registry=${VERDACCIO_URL} --force`, { 
            stdio: 'pipe' 
          });
          log(`🗑️  Removido @archbase/${packageName}@${version}`, YELLOW);
        } catch (e) {
          // Ignora erro se não conseguir remover
        }
      }
    }
    
    return true;
  } catch (error) {
    // Package pode não existir, não é erro
    log(`ℹ️  @archbase/${packageName} não encontrado no Verdaccio`, BLUE);
    return true;
  }
}

function publishDebugPackage(packageName) {
  const packageDir = path.join(process.cwd(), 'packages', packageName);
  
  log(`📦 Publicando @archbase/${packageName} (DEBUG)...`, BLUE);
  
  try {
    // Verificar se dist existe
    const distPath = path.join(packageDir, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error(`Diretório dist não encontrado. Execute build primeiro.`);
    }
    
    // Limpar versões antigas do Verdaccio
    cleanupVerdaccioPackage(packageName);
    
    // Atualizar package.json para debug
    const debugVersion = updatePackageForDebug(packageName);
    
    // Publicar
    execSync(`cd ${packageDir} && npm publish --registry=${VERDACCIO_URL}`, { stdio: 'inherit' });
    
    log(`✅ @archbase/${packageName}@${debugVersion} publicado`, GREEN);
    
    // Restaurar package.json original
    restorePackageJson(packageName);
    
    return { success: true, version: debugVersion };
  } catch (error) {
    log(`❌ Erro ao publicar @archbase/${packageName}: ${error.message}`, RED);
    
    // Restaurar package.json original
    restorePackageJson(packageName);
    
    return { success: false, error: error.message };
  }
}

function checkVerdaccioConnection() {
  try {
    execSync(`npm ping --registry=${VERDACCIO_URL}`, { stdio: 'pipe' });
    log(`✅ Verdaccio acessível em ${VERDACCIO_URL}`, GREEN);
    return true;
  } catch (error) {
    log(`❌ Verdaccio não acessível em ${VERDACCIO_URL}`, RED);
    log(`💡 Inicie o Verdaccio: npx verdaccio`, BLUE);
    return false;
  }
}

function cleanupAllVerdaccioPackages() {
  log(`🧹 Limpando TODOS os packages @archbase/* do Verdaccio...`, YELLOW);
  
  const packages = getAllPackages();
  
  for (const packageName of packages) {
    cleanupVerdaccioPackage(packageName);
  }
  
  log(`✅ Limpeza completa do Verdaccio concluída`, GREEN);
}

function main() {
  log(`🚀 Iniciando publicação DEBUG no Verdaccio...`, BLUE);
  
  // Verificar Verdaccio
  if (!checkVerdaccioConnection()) {
    process.exit(1);
  }
  
  // Limpar Verdaccio completamente
  cleanupAllVerdaccioPackages();
  
  // Build em modo debug
  log(`🔧 Fazendo build debug...`, YELLOW);
  execSync(`node ${path.join(__dirname, 'build-unified.js')} --debug`, { stdio: 'inherit' });
  
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
    const result = publishDebugPackage(packageName);
    results.push({ packageName, ...result });
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
    
    // Pausa entre publicações
    if (packageName !== allPackages[allPackages.length - 1]) {
      execSync('sleep 1');
    }
  }
  
  log(`\n📋 Resumo da publicação DEBUG:`, BLUE);
  results.forEach(({ packageName, success, version, error }) => {
    const status = success ? '✅' : '❌';
    const color = success ? GREEN : RED;
    const info = success ? `${version}` : error;
    log(`${status} @archbase/${packageName} - ${info}`, color);
  });
  
  log(`\n📊 Estatísticas:`, BLUE);
  log(`✅ Sucessos: ${successful}`, GREEN);
  if (failed > 0) {
    log(`❌ Falhas: ${failed}`, RED);
  }
  
  if (failed === 0) {
    log(`\n🎉 Publicação DEBUG concluída com sucesso!`, GREEN);
    log(`💡 Libs disponíveis em ${VERDACCIO_URL}`, BLUE);
  } else {
    log(`\n💥 Publicação DEBUG falhou em ${failed} package(s)`, RED);
    process.exit(1);
  }
}

main();