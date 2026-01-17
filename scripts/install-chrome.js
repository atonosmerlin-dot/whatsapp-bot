#!/usr/bin/env node

/**
 * Script para baixar e instalar Chrome/Chromium durante o build no Render
 * Executado via postinstall no package.json
 * Compatível com Puppeteer 23.x
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function installChrome() {
  try {
    console.log('[INSTALL] 📦 Iniciando download do Chromium para Render...');

    // Definir cache para local persistente
    const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer');
    
    // Garantir que o diretório existe
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
      console.log(`[INSTALL] 📁 Diretório criado: ${cacheDir}`);
    }

    // Usar a CLI do Puppeteer para instalar Chrome
    // Define PUPPETEER_CACHE_DIR antes de executar
    const env = { ...process.env, PUPPETEER_CACHE_DIR: cacheDir };
    
    try {
      execSync('npx puppeteer browsers install chrome', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
        env: env
      });
    } catch (e) {
      console.warn('[INSTALL] ⚠️ npx puppeteer browsers install falhou, tentando npm');
      execSync('npm exec puppeteer browsers install chrome', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
        env: env
      });
    }

    console.log('[INSTALL] ✓ Chromium baixado com sucesso!');
    console.log(`[INSTALL] 📍 Cache: ${cacheDir}`);

    // Verificar se o Chrome foi instalado
    const chromeDir = fs.readdirSync(cacheDir).filter(f => f.includes('chrome'));
    if (chromeDir.length > 0) {
      console.log('[INSTALL] ✓ Chrome encontrado no cache');
    }

    process.exit(0);
  } catch (error) {
    console.error('[INSTALL] ❌ Erro ao instalar Chromium:', error.message);
    console.warn('[INSTALL] ⚠️ Build continuará mesmo com erro');
    process.exit(0);
  }
}

installChrome();


