const { Markup } = require("telegraf");
const fs = require("fs");
const User = require("./models/user");

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const imagePath = "./content/nft.png";

module.exports.startCommand = async (ctx) => {
  try {
    const tgId = ctx.from.id;

    // Отправка фото
    await ctx.replyWithPhoto({ source: fs.createReadStream(imagePath) });

    // Отправка клавиатуры
    await ctx.reply(
      "⬇ Выбери действие ниже:",
      Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Открыть приложение 🚀", appUrl)],
        [Markup.button.webApp("📜 User Agreement 📜", agreementUrl)],
        [Markup.button.callback("🌐 Join Community 🌐", "community")],
        [Markup.button.callback("❓ Support", "support")],
      ])
    );

    // Поиск или создание пользователя
    let user = await User.findOne({ telegramId: tgId });
    
    if (!user) {
      user = await User.findOneAndUpdate(
        { telegramId: tgId },
        {
          username: ctx.from.username || undefined, // Используем undefined вместо пустой строки
          firstName: ctx.from.first_name || "NoName",
          telegramId: tgId,
          $setOnInsert: { balance: 0 } // Устанавливаем баланс только при создании
        },
        { 
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
      console.log("🆕 Создан новый пользователь:", user.telegramId);
    }

    await ctx.reply(`💰 Твой баланс: ${user.balance} монет`);
  } catch (err) {
    if (err.code === 11000) {
      // Если дублирование, просто получаем существующего пользователя
      const user = await User.findOne({ telegramId: ctx.from.id });
      await ctx.reply(`💰 Твой баланс: ${user.balance} монет`);
    } else {
      console.error("❌ Ошибка при /start:", err);
      await ctx.reply("⚠️ Произошла ошибка. Попробуйте позже.");
    }
  }
};

module.exports.buttonActions = (bot) => {
  bot.action("community", (ctx) => {
    ctx.reply("Присоединяйтесь к нашему сообществу: @your_community_link");
  });

  bot.action("support", (ctx) => {
    ctx.reply("Свяжитесь с поддержкой: @support_bot");
  });
};
