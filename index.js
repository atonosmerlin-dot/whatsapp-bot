const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

// Inicializando bot WhatsApp com Puppeteer para Render
(async () => {
  try {
    // Configuração do Puppeteer para Render.com
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ]
    });

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
