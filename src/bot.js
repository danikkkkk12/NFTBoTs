require('dotenv').config();
const { Telegraf } = require('telegraf');

const commands = require('./commands.js');
const events = require('./events.js');

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("❌ Ошибка: TELEGRAM_BOT_TOKEN не найден!");
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(commands.startCommand);
bot.on('new_chat_members', events.userJoined);

bot.launch()
    .then(() => console.log("✅ Бот запущен и работает!"))
    .catch(err => console.error("❌ Ошибка запуска:", err));