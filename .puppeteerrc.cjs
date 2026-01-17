/**
 * Configuração global do Puppeteer para Render.com
 * Define variáveis de cache e diretórios
 */

const path = require('path');
const os = require('os');

module.exports = {
  // Diretório onde o Puppeteer armazena o navegador
  // Usa sempre o home directory do usuário
  cacheDirectory: path.join(os.homedir(), '.cache', 'puppeteer'),
  
  // Log detalhado para debug
  logLevel: 'info',
  
  // Timeout maior para download em produção
  timeout: 120000,
  
  // Não pula o download
  skipDownload: false
};

