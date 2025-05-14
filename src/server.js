require('dotenv').config();
const express = require('express');
const bot = require('./bot/bot.js');
const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || `https://your-app.onrender.com/telegram`;

app.use(express.json());

bot.telegram.setWebhook(WEBHOOK_URL);
app.use(bot.webhookCallback('/telegram'));

app.get('/', (req, res) => {
    res.send("✅ Сервер работает и Webhook подключен!");
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🔗 Webhook: ${WEBHOOK_URL}`);
});