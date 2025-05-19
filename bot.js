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
const { Telegraf } = require("telegraf");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const commands = require("./commands.js");
const events = require("./events.js");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

mongoose
  .connect(process.env.mongoURI)
  .then(() => {
    console.log("✅ Успешное подключение к MongoDB");

    // 📌 Реєстрація команд і івентів тільки після підключення до БД
    bot.start(commands.startCommand);
    commands.buttonActions(bot);
    bot.on("new_chat_members", events.userJoined);

    bot.command("start", async (ctx) => {
      try {
        const tgId = ctx.from.id;

        let user = await User.findOne({ telegramId: tgId });

        if (!user) {
          user = await User.create({
            username: ctx.from.username || "",
            firstName: ctx.from.first_name || "NoName",
            telegramId: tgId,
          });
          console.log("🆕 Створено нового користувача:", user.username);
        }

        ctx.reply(`💰 Твій баланс: ${user.balance} монет`);
      } catch (err) {
        console.error("❌ Помилка при /balance:", err);
        ctx.reply("⚠️ Сталася помилка при отриманні балансу.");
      }
    });

    bot
      .launch()
      .then(() => console.log("✅ Бот запущен и работает!"))
      .catch((err) => console.error("❌ Ошибка запуска бота:", err));
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения к MongoDB:", err);
  });
