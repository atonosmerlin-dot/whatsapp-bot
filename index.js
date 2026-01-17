const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Usar plugin stealth para melhor compatibilidade
puppeteer.use(StealthPlugin());

// Inicializando bot WhatsApp com Puppeteer para Render
(async () => {
  try {
    // Configuração do Puppeteer para Render.com
    console.log('[BOT] 🚀 Iniciando Puppeteer com configurações para Render...');
    
    const launchArgs = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-resources'
      ]
    };

    // Se estamos em Render, não especificamos executablePath
    // Deixamos o Puppeteer encontrar automaticamente
    if (!process.env.RENDER) {
      console.log('[BOT] ℹ️ Ambiente local detectado');
    } else {
      console.log('[BOT] ℹ️ Render detectado - usando Chromium do cache');
    }

    const browser = await puppeteer.launch(launchArgs);

    console.log('[BOT] ✓ Puppeteer iniciado com sucesso!');

    // Inicializando cliente WhatsApp com LocalAuth persistente
    const client = new Client({
      puppeteer: { browser },
      authStrategy: new LocalAuth({ clientId: 'whatsapp-bot-session' })
    });

    // Evento: QR Code para primeira autenticação
    client.on('qr', (qr) => {
      console.log('[BOT] 📱 Escaneie o QR Code para autenticar:');
      console.log(qr);
    });

    // Evento: Autenticação bem-sucedida
    client.on('authenticated', () => {
      console.log('[BOT] ✓ Autenticado com sucesso!');
    });

    // Evento: Cliente pronto
    client.on('ready', () => {
      console.log('[BOT] ✓ WhatsApp conectado e pronto!');
    });

    // Evento: Mensagem recebida
    client.on('message', async (msg) => {
      try {
        console.log(`[BOT] 📨 Mensagem de ${msg.from}: ${msg.body}`);

        // Resposta para ping
        if (msg.body.toLowerCase() === 'ping') {
          await msg.reply('Pong! 🏓');
          console.log(`[BOT] ✓ Resposta enviada para ${msg.from}`);
        }
      } catch (error) {
        console.error('[BOT] ❌ Erro ao processar mensagem:', error);
      }
    });

    // Evento: Desconexão
    client.on('disconnected', (reason) => {
      console.log(`[BOT] ⚠️ Desconectado: ${reason}`);
    });

    // Evento: Erro
    client.on('error', (error) => {
      console.error('[BOT] ❌ Erro no cliente:', error);
    });

    // Inicializar cliente
    await client.initialize();

  } catch (error) {
    console.error('[BOT] ❌ Erro fatal ao iniciar bot:', error);
    process.exit(1);
  }
})();
