#!/usr/bin/env node

/**
 * Script para baixar e instalar Chrome/Chromium durante o build no Render
 * Executado via postinstall no package.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function installChrome() {
  try {
    console.log('[INSTALL] 📦 Iniciando download do Chromium para Render...');

    // Tentar usar puppeteer para baixar o navegador
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download(puppeteer.PUPPETEER_REVISIONS.chromium);

    console.log('[INSTALL] ✓ Chromium baixado com sucesso!');
    console.log(`[INSTALL] 📍 Local: ${revisionInfo.executablePath}`);

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
    
    // Não falhar totalmente - o Render pode tentar usar sistema libraries
    console.warn('[INSTALL] ⚠️ Tentando continuar mesmo com erro...');
    process.exit(0); // Exit com sucesso mesmo com erro para não quebrar o build
  }
}

installChrome();
