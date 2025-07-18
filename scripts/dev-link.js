#!/usr/bin/env node

/**
 * Script para configurar desenvolvimento direto com o código fonte
 * Uso: node scripts/dev-link.js
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

function updatePackageForDev(packageName) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Fazer backup se não existir
  const backupPath = `${packageJsonPath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));
  }
  
  // Atualizar exports para apontar para src em desenvolvimento
  if (packageJson.exports) {
    for (const [key, value] of Object.entries(packageJson.exports)) {
      if (typeof value === 'object' && value.import) {
        // Apontar import para src em vez de dist
        const srcPath = value.import.replace('/dist/', '/src/').replace('.js', '.ts');
        if (fs.existsSync(path.join(process.cwd(), 'packages', packageName, srcPath))) {
          packageJson.exports[key] = {
            ...value,
            import: srcPath,
            types: srcPath.replace('.ts', '.d.ts')
          };
        }
      }
    }
  }
  
  // Atualizar main e module para src
  if (packageJson.main) {
    const srcMain = packageJson.main.replace('/dist/', '/src/').replace('.js', '.ts');
    if (fs.existsSync(path.join(process.cwd(), 'packages', packageName, srcMain))) {
      packageJson.main = srcMain;
    }
  }
  
  if (packageJson.module) {
    const srcModule = packageJson.module.replace('/dist/', '/src/').replace('.js', '.ts');
    if (fs.existsSync(path.join(process.cwd(), 'packages', packageName, srcModule))) {
      packageJson.module = srcModule;
    }
  }
  
  // Atualizar types
  if (packageJson.types) {
    const srcTypes = packageJson.types.replace('/dist/', '/src/').replace('.d.ts', '.ts');
    if (fs.existsSync(path.join(process.cwd(), 'packages', packageName, srcTypes))) {
      packageJson.types = srcTypes;
    }
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log(`✅ ${packageName} configurado para desenvolvimento`, GREEN);
}

function restorePackages() {
  const packages = getAllPackages();
  
  for (const packageName of packages) {
    const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');
    const backupPath = `${packageJsonPath}.backup`;
    
    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, packageJsonPath);
      log(`🔄 ${packageName} restaurado`, BLUE);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--restore')) {
    log('🔄 Restaurando packages para produção...', YELLOW);
    restorePackages();
    log('✅ Packages restaurados com sucesso!', GREEN);
    return;
  }
  
  log('🚀 Configurando desenvolvimento direto do código fonte...', BLUE);
  
  const packages = getAllPackages();
  
  for (const packageName of packages) {
    updatePackageForDev(packageName);
  }
  
  log('\n🎉 Configuração de desenvolvimento concluída!', GREEN);
  log('💡 Para restaurar, execute: node scripts/dev-link.js --restore', BLUE);
  log('⚠️  Lembre-se de fazer build antes de publicar!', YELLOW);
}

main();