#!/usr/bin/env node

/**
 * Script para linkar a lib archbase-react para desenvolvimento em outro projeto
 * Uso: node scripts/link-to-project.js /caminho/do/seu/projeto
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

function linkPackages(targetProject) {
  const packages = getAllPackages();
  
  log(`🔗 Linkando packages para ${targetProject}...`, BLUE);
  
  // Primeiro, criar links globais de cada package
  for (const packageName of packages) {
    const packageDir = path.join(process.cwd(), 'packages', packageName);
    
    try {
      log(`📦 Criando link global para @archbase/${packageName}...`, YELLOW);
      execSync(`cd ${packageDir} && pnpm link --global`, { stdio: 'inherit' });
    } catch (error) {
      log(`❌ Erro ao criar link para @archbase/${packageName}: ${error.message}`, RED);
    }
  }
  
  // Depois, linkar no projeto destino
  try {
    log(`\n🎯 Linkando packages no projeto destino...`, BLUE);
    
    const linkCommands = packages.map(pkg => `@archbase/${pkg}`).join(' ');
    execSync(`cd ${targetProject} && pnpm link --global ${linkCommands}`, { stdio: 'inherit' });
    
    log(`✅ Packages linkados com sucesso!`, GREEN);
  } catch (error) {
    log(`❌ Erro ao linkar no projeto destino: ${error.message}`, RED);
  }
}

function unlinkPackages(targetProject) {
  const packages = getAllPackages();
  
  log(`🔓 Removendo links do projeto ${targetProject}...`, YELLOW);
  
  // Remover links do projeto destino
  try {
    const unlinkCommands = packages.map(pkg => `@archbase/${pkg}`).join(' ');
    execSync(`cd ${targetProject} && pnpm unlink ${unlinkCommands}`, { stdio: 'inherit' });
    
    log(`✅ Links removidos do projeto destino`, GREEN);
  } catch (error) {
    log(`⚠️  Erro ao remover links: ${error.message}`, YELLOW);
  }
  
  // Remover links globais
  for (const packageName of packages) {
    const packageDir = path.join(process.cwd(), 'packages', packageName);
    
    try {
      execSync(`cd ${packageDir} && pnpm unlink --global`, { stdio: 'inherit' });
    } catch (error) {
      // Ignorar erros ao remover links globais
    }
  }
  
  log(`✅ Links globais removidos`, GREEN);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log(`❌ Uso: node scripts/link-to-project.js <caminho-do-projeto> [--unlink]`, RED);
    process.exit(1);
  }
  
  const targetProject = path.resolve(args[0]);
  const unlink = args.includes('--unlink');
  
  if (!fs.existsSync(targetProject)) {
    log(`❌ Projeto não encontrado: ${targetProject}`, RED);
    process.exit(1);
  }
  
  if (unlink) {
    unlinkPackages(targetProject);
  } else {
    linkPackages(targetProject);
    
    log(`\n📝 Instruções:`, BLUE);
    log(`1. Execute 'npm run dev:link' para usar código fonte direto`, YELLOW);
    log(`2. Edite arquivos em packages/*/src/`, YELLOW);
    log(`3. As mudanças serão refletidas imediatamente no projeto linkado`, YELLOW);
    log(`4. Para desfazer: node scripts/link-to-project.js ${targetProject} --unlink`, YELLOW);
  }
}

main();