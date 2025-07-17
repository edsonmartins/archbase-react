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

function cleanPackage(packageName) {
  const packageDir = path.join(process.cwd(), 'packages', packageName);
  
  log(`🧹 Limpando @archbase/${packageName}...`, BLUE);
  
  try {
    const itemsToClean = [
      'dist',
      'node_modules',
      '.turbo',
      '.tsbuildinfo',
      '*.tgz',
      '*.log',
      'package.json.backup'
    ];
    
    let cleanedItems = 0;
    
    itemsToClean.forEach(item => {
      const itemPath = path.join(packageDir, item);
      
      if (item.includes('*')) {
        // Usar glob para arquivos com wildcard
        try {
          const files = fs.readdirSync(packageDir).filter(file => {
            if (item === '*.tgz') return file.endsWith('.tgz');
            if (item === '*.log') return file.endsWith('.log');
            return false;
          });
          
          files.forEach(file => {
            const filePath = path.join(packageDir, file);
            fs.unlinkSync(filePath);
            cleanedItems++;
          });
        } catch (error) {
          // Ignorar erro se não houver arquivos correspondentes
        }
      } else {
        // Limpar diretórios e arquivos específicos
        if (fs.existsSync(itemPath)) {
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            execSync(`rm -rf "${itemPath}"`, { stdio: 'pipe' });
          } else {
            fs.unlinkSync(itemPath);
          }
          cleanedItems++;
        }
      }
    });
    
    log(`✅ @archbase/${packageName} - ${cleanedItems} itens removidos`, GREEN);
    return { success: true, cleanedItems };
  } catch (error) {
    log(`❌ Erro ao limpar @archbase/${packageName}: ${error.message}`, RED);
    return { success: false, error: error.message };
  }
}

function cleanRoot() {
  log(`🧹 Limpando diretório raiz...`, BLUE);
  
  try {
    const itemsToClean = [
      'node_modules',
      '.turbo',
      '.tsbuildinfo',
      '*.tgz',
      '*.log'
    ];
    
    let cleanedItems = 0;
    
    itemsToClean.forEach(item => {
      const itemPath = path.join(process.cwd(), item);
      
      if (item.includes('*')) {
        // Usar glob para arquivos com wildcard
        try {
          const files = fs.readdirSync(process.cwd()).filter(file => {
            if (item === '*.tgz') return file.endsWith('.tgz');
            if (item === '*.log') return file.endsWith('.log');
            return false;
          });
          
          files.forEach(file => {
            const filePath = path.join(process.cwd(), file);
            fs.unlinkSync(filePath);
            cleanedItems++;
          });
        } catch (error) {
          // Ignorar erro se não houver arquivos correspondentes
        }
      } else {
        // Limpar diretórios e arquivos específicos
        if (fs.existsSync(itemPath)) {
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            execSync(`rm -rf "${itemPath}"`, { stdio: 'pipe' });
          } else {
            fs.unlinkSync(itemPath);
          }
          cleanedItems++;
        }
      }
    });
    
    log(`✅ Diretório raiz - ${cleanedItems} itens removidos`, GREEN);
    return { success: true, cleanedItems };
  } catch (error) {
    log(`❌ Erro ao limpar diretório raiz: ${error.message}`, RED);
    return { success: false, error: error.message };
  }
}

function main() {
  log(`🚀 Iniciando limpeza do projeto...`, BLUE);
  
  // Limpar diretório raiz
  const rootResult = cleanRoot();
  
  // Limpar todos os packages
  const packages = getAllPackages();
  log(`📦 Packages para limpeza: ${packages.join(', ')}`, BLUE);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  let totalCleaned = rootResult.cleanedItems || 0;
  
  for (const packageName of packages) {
    const result = cleanPackage(packageName);
    results.push({ packageName, ...result });
    
    if (result.success) {
      successful++;
      totalCleaned += result.cleanedItems;
    } else {
      failed++;
    }
  }
  
  log(`\n📋 Resumo da limpeza:`, BLUE);
  log(`✅ Diretório raiz - ${rootResult.cleanedItems} itens`, GREEN);
  
  results.forEach(({ packageName, success, cleanedItems, error }) => {
    const status = success ? '✅' : '❌';
    const color = success ? GREEN : RED;
    const info = success ? `${cleanedItems} itens` : error;
    log(`${status} @archbase/${packageName} - ${info}`, color);
  });
  
  log(`\n📊 Estatísticas:`, BLUE);
  log(`✅ Sucessos: ${successful + 1}`, GREEN);
  if (failed > 0) {
    log(`❌ Falhas: ${failed}`, RED);
  }
  log(`🧹 Total de itens removidos: ${totalCleaned}`, BLUE);
  
  if (failed === 0) {
    log(`\n🎉 Limpeza concluída com sucesso!`, GREEN);
    log(`💡 Projeto limpo e pronto para nova build`, BLUE);
  } else {
    log(`\n💥 Limpeza falhou em ${failed} package(s)`, RED);
    process.exit(1);
  }
}

main();