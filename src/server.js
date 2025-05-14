require('dotenv').config();
const express = require('express');
const bot = require('./bot/bot.js'); 
const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('Токен бота не указан в .env!');
}
if (!WEBHOOK_URL) {
  console.warn('⚠️ WEBHOOK_URL не задан. Используется значение по умолчанию.');
}

app.use(express.json());

bot.telegram.setWebhook(WEBHOOK_URL)
  .then(() => console.log(`✅ Webhook установлен на ${WEBHOOK_URL}`))
  .catch(err => console.error('❌ Ошибка вебхука:', err));

app.use(bot.webhookCallback('/telegram'));

app.get('/', (req, res) => {
  res.send("🚀 Сервер работает. Путь для вебхука: /telegram");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});