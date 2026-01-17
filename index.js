const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

// Inicializando Puppeteer para Render
(async () => {
  const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium-browser', // Chromium do Render
  args: ['--no-sandbox', '--disable-setuid-sandbox'] // obrigatório para servidores
});

  console.log('[BOT] Puppeteer iniciado!');

  // Inicializando cliente WhatsApp
  const client = new Client({
    puppeteer: { browser }, // usa o browser que acabamos de criar
    authStrategy: new LocalAuth({ clientId: 'bot-whatsapp' }) // salva sessão para não precisar QR toda vez
  });

  client.on('qr', (qr) => {
    console.log('[BOT] Escaneie este QR Code no WhatsApp Web:');
    console.log(qr);
  });

  client.on('ready', () => {
    console.log('[BOT] WhatsApp conectado!');
  });

  client.on('message', (msg) => {
    console.log(`[BOT] Mensagem recebida de ${msg.from}: ${msg.body}`);

    // Resposta automática exemplo
    if (msg.body.toLowerCase() === 'ping') {
      msg.reply('Pong!');
    }
  });

  await client.initialize();

})();
