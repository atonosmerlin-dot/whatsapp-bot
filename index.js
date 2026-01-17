const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  console.log('ESCANEIE O QR CODE:');
  require('qrcode-terminal').generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp conectado!');
});

client.initialize();

app.post('/notify', async (req, res) => {
  const { phone, message } = req.body;

  try {
    await client.sendMessage(`${phone}@c.us`, message);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});
