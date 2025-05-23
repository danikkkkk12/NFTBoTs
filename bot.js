// const { Telegraf } = require('telegraf');
// require('dotenv').config();

// const commands = require('./commands.js');
// const events = require('./events.js');

// if (!process.env.TELEGRAM_BOT_TOKEN) {
//     console.error("❌ Ошибка: TELEGRAM_BOT_TOKEN не найден!");
//     process.exit(1);
// }

// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// bot.start(commands.startCommand);
// commands.buttonActions(bot);

// bot.on('new_chat_members', events.userJoined);

// bot.launch()
//     .then(() => console.log("✅ Бот запущен и работает!"))
//     .catch(err => console.error("❌ Ошибка запуска:", err));
// const { Telegraf } = require("telegraf");
// require("dotenv").config();
// const mongoose = require("mongoose");
// const commands = require("./commands.js");
// const events = require("./events.js");
// const User = require("./models/user"); // Добавлен импорт модели

// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// mongoose
//   .connect(process.env.mongoURI)
//   .then(async () => {
//     console.log("✅ Успешное подключение к MongoDB");

//     // Убедимся, что индексы созданы правильно
//     await User.syncIndexes();

//     // Регистрация команд и событий
//     bot.start(commands.startCommand);
//     commands.buttonActions(bot);
//     bot.on("new_chat_members", events.userJoined);

//     bot.launch()
//       .then(() => console.log("✅ Бот запущен и работает!"))
//       .catch((err) => console.error("❌ Ошибка запуска бота:", err));
//   })
//   .catch((err) => {
//     console.error("❌ Ошибка подключения к MongoDB:", err);
//     process.exit(1); // Завершаем процесс при ошибке подключения
//   });

// // Обработка ошибок бота
// bot.catch((err) => {
//   console.error('❌ Ошибка Telegraf:', err);
// });

// // Graceful shutdown
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
