/**
 * Configuração global do Puppeteer para Render.com
 * Define variáveis de cache e diretórios
 */

const path = require('path');
const os = require('os');

module.exports = {
  // Diretório onde o Puppeteer armazena o navegador
  cacheDirectory: path.join(os.homedir(), '.cache', 'puppeteer'),
  
  // Log detalhado para debug
  logLevel: 'info',
  
  // Timeout maior para download em produção
  timeout: 120000,
  
  // Tenta usar executável do sistema se disponível
  skipDownload: false
};
