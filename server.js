require('dotenv').config();
const express = require('express');
const bot = require('./bot/bot.js');
const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com/telegram`;

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('❌ Токен бота не указан!');
if (!WEBHOOK_URL.includes('onrender.com')) console.warn('⚠️ Используется Render-URL по умолчанию');

app.use(express.json());

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use(bot.webhookCallback('/telegram'));

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Бот работает!</h1>
    <p>Webhook: <code>${WEBHOOK_URL}</code></p>
    <p>Проверка пинга: <a href="/ping">/ping</a></p>
  `);
});

bot.telegram.setWebhook(WEBHOOK_URL)
  .then(() => console.log(`✅ Webhook установлен: ${WEBHOOK_URL}`))
  .catch(err => {
    console.error('❌ Ошибка вебхука:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log('👉 Не забудь настроить UptimeRobot!');
});