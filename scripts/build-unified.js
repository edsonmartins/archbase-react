#!/usr/bin/env node

/**
 * Script unificado de build usando Turbo
 * Uso: 
 *   npm run build              # Produção
 *   npm run build:debug        # Debug
 *   npm run build:publish      # Produção + publicação
 *   npm run build:publish:debug # Debug + publicação Verdaccio
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

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    debug: args.includes('--debug'),
    publish: args.includes('--publish'),
    verdaccio: args.includes('--verdaccio')
  };
}

function configureMode(isDebug) {
  const mode = isDebug ? 'debug' : 'production';
  log(`⚙️  Configurando para modo ${mode}...`, YELLOW);
  
  const configScript = path.join(__dirname, 'build-config.js');
  execSync(`node ${configScript} ${mode}`, { stdio: 'inherit' });
}

function buildWithTurbo(isDebug) {
  const mode = isDebug ? 'DEBUG' : 'PRODUCTION';
  log(`🚀 Build ${mode} com Turbo...`, BLUE);
  
  const env = {
    ...process.env,
    NODE_ENV: isDebug ? 'development' : 'production'
  };
  
  execSync('turbo build', { stdio: 'inherit', env });
  log(`✅ Build ${mode} concluído!`, GREEN);
}

function publishPackages(isDebug) {
  const mode = isDebug ? 'DEBUG (Verdaccio)' : 'PRODUCTION (NPM)';
  log(`📦 Publicando ${mode}...`, BLUE);
  
  if (isDebug) {
    execSync('node scripts/publish-debug.js', { stdio: 'inherit' });
  } else {
    execSync('node scripts/publish.js', { stdio: 'inherit' });
  }
  
  log(`✅ Publicação ${mode} concluída!`, GREEN);
}

function main() {
  const { debug, publish, verdaccio } = parseArgs();
  const isDebug = debug || verdaccio;
  
  log(`🎯 Iniciando build Archbase React v3...`, BLUE);
  
  try {
    // 1. Configurar modo
    configureMode(isDebug);
    
    // 2. Build com Turbo
    buildWithTurbo(isDebug);
    
    // 3. Publicar se solicitado
    if (publish || verdaccio) {
      publishPackages(isDebug);
    }
    
    // 4. Resumo
    const mode = isDebug ? 'DEBUG' : 'PRODUCTION';
    log(`\n🎉 Processo ${mode} concluído com sucesso!`, GREEN);
    
    if (!publish && !verdaccio) {
      log(`💡 Para publicar: npm run build:${isDebug ? 'publish:debug' : 'publish'}`, BLUE);
    }
    
  } catch (error) {
    log(`❌ Erro no build: ${error.message}`, RED);
    process.exit(1);
  }
}

main();