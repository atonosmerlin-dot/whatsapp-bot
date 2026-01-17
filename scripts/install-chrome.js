#!/usr/bin/env node

/**
 * Script para baixar e instalar Chrome/Chromium durante o build no Render
 * Executado via postinstall no package.json
 * Compatível com Puppeteer 23.x
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function installChrome() {
  try {
    console.log('[INSTALL] 📦 Iniciando download do Chromium para Render...');

    // Usar a CLI do Puppeteer para instalar Chrome
    // Esta é a forma correta para Puppeteer 23.x
    execSync('npx puppeteer install chrome', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('[INSTALL] ✓ Chromium baixado com sucesso!');

    // Criar arquivo de cache para marcar sucesso
    const cacheDir = path.join(__dirname, '..', '.install-cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(path.join(cacheDir, 'chrome-installed.txt'), new Date().toISOString());

    console.log('[INSTALL] ✓ Cache de instalação criado');
    process.exit(0);
  } catch (error) {
    console.error('[INSTALL] ❌ Erro ao instalar Chromium:', error.message);
    
    // Não falhar totalmente - permite que o build continue
    console.warn('[INSTALL] ⚠️ Tentando continuar mesmo com erro...');
    process.exit(0);
  }
}

installChrome();

