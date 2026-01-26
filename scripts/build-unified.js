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
    verdaccio: args.includes('--verdaccio'),
    noDocs: args.includes('--no-docs')
  };
}

function configureMode(isDebug) {
  const mode = isDebug ? 'debug' : 'production';
  log(`⚙️  Configurando para modo ${mode}...`, YELLOW);
  
  // Configuração integrada - não precisa mais de arquivo separado
  log(`📝 Modo configurado: ${mode}`, BLUE);
}

function buildWithTurbo(isDebug, noDocs = false) {
  const mode = isDebug ? 'DEBUG' : 'PRODUCTION';
  log(`🚀 Build ${mode} com Turbo...`, BLUE);

  const env = {
    ...process.env,
    NODE_ENV: isDebug ? 'development' : 'production'
  };

  const filter = noDocs ? " --filter='!archbase-react-docs'" : '';
  if (noDocs) {
    log(`📝 Excluindo docs-site do build`, YELLOW);
  }

  execSync(`turbo build${filter}`, { stdio: 'inherit', env });
  log(`✅ Build ${mode} concluído!`, GREEN);
}

function main() {
  const { debug, verdaccio, noDocs } = parseArgs();
  const isDebug = debug || verdaccio;

  log(`🎯 Iniciando build Archbase React v3...`, BLUE);

  try {
    // 1. Configurar modo
    configureMode(isDebug);

    // 2. Build com Turbo
    buildWithTurbo(isDebug, noDocs);

    // 3. Resumo
    const mode = isDebug ? 'DEBUG' : 'PRODUCTION';
    log(`\n🎉 Processo ${mode} concluído com sucesso!`, GREEN);
    log(`💡 Para publicar: npm run publish:${isDebug ? 'dev' : 'prod'}`, BLUE);

  } catch (error) {
    log(`❌ Erro no build: ${error.message}`, RED);
    process.exit(1);
  }
}

main();