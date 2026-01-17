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

    // Usar a CLI do Puppeteer para instalar Chrome
    // Sem definir cache dir - deixa o Puppeteer usar seu padrão
    try {
      execSync('npx puppeteer browsers install chrome', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
    } catch (e) {
      console.warn('[INSTALL] ⚠️ npx puppeteer browsers install falhou, tentando npm');
      execSync('npm exec puppeteer browsers install chrome', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
    }

    console.log('[INSTALL] ✓ Chromium baixado com sucesso!');

    // Tentar encontrar onde foi instalado
    const possibleCaches = [
      path.join(process.env.HOME || '/root', '.cache/puppeteer'),
      '/opt/render/.cache/puppeteer',
      path.join(__dirname, '..', '.cache', 'puppeteer')
    ];

    for (const cacheDir of possibleCaches) {
      if (fs.existsSync(cacheDir)) {
        console.log(`[INSTALL] 📍 Cache encontrado: ${cacheDir}`);
        
        // Listar o que foi instalado
        try {
          const contents = fs.readdirSync(cacheDir, { recursive: true });
          const chromeFiles = contents.filter(f => f.includes('chrome'));
          if (chromeFiles.length > 0) {
            console.log(`[INSTALL] ✓ Chrome encontrado (${chromeFiles.length} arquivos)`);
            process.exit(0);
          }
        } catch (e) {
          // Continue
        }
      }
    }

    console.log('[INSTALL] ⚠️ Não foi possível verificar instalação, mas continuando...');
    process.exit(0);
  } catch (error) {
    console.error('[INSTALL] ❌ Erro ao instalar Chromium:', error.message);
    console.warn('[INSTALL] ⚠️ Build continuará mesmo com erro');
    process.exit(0);
  }
}

installChrome();



