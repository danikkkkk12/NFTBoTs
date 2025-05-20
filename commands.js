const { Markup } = require("telegraf");
const fs = require("fs");
const User = require("./models/user");

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const imagePath = "./content/nft.png";

module.exports.startCommand = async (ctx) => {
  const tgId = ctx.from.id;
  const { username, first_name, last_name } = ctx.from;

  try {
    // Отримання аватара користувача
    let avatarUrl = "default-avatar-url.jpg";
    try {
      const photos = await ctx.telegram.getUserProfilePhotos(tgId);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await ctx.telegram.getFile(fileId);
        avatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      }
    } catch (err) {
      console.warn("⚠️ Не вдалося отримати аватар:", err.message);
    }

    // Створення або оновлення користувача
    const updatedUser = await User.findOneAndUpdate(
      { telegramId: tgId },
      {
        $set: {
          username: username || undefined,
          firstName: first_name || "NoName",
          lastName: last_name || undefined,
          avatar: avatarUrl,
          lastSeen: new Date(),
        },
        $setOnInsert: {
          telegramId: tgId,
          balance: 0,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Відправка фото
    await ctx.replyWithPhoto({ source: fs.createReadStream(imagePath) });

    await ctx.reply(
      "⬇ Выбери действие ниже:",
      Markup.inlineKeyboard([
        [Markup.button.callback("🚀 Открыть приложение 🚀", "open_app")],
        [Markup.button.webApp("📜 User Agreement 📜", agreementUrl)],
        [Markup.button.callback("🌐 Join Community 🌐", "community")],
        [Markup.button.callback("❓ Support", "support")],
      ])
    );
  } catch (err) {
    if (err.code === 11000) {
      console.error("⚠️ Конфлікт унікального поля:", err.keyValue);
      await ctx.reply("❌ Помилка: дані вже існують.");
    } else {
      console.error("❌ Помилка при /start:", err);
      await ctx.reply("⚠️ Виникла помилка. Спробуйте пізніше.");
    }
  }
};

module.exports.buttonActions = (bot) => {
  bot.action("open_app", async (ctx) => {
    const tgId = ctx.from.id;

    try {
      await User.findOneAndUpdate(
        { telegramId: tgId },
        {
          $set: {
            online: true,
            lastSeen: new Date(),
          },
        }
      );

      const urlWithId = `${appUrl}?tgId=${tgId}`;
      await ctx.reply(`✅ Статус оновлено. Перейди до застосунку:\n${urlWithId}`);
    } catch (err) {
      console.error("❌ Помилка при оновленні статусу:", err);
      await ctx.reply("⚠️ Не вдалося оновити статус.");
    }
  });

  bot.action("community", (ctx) => {
    ctx.reply("Присоединяйтесь к нашему сообществу: @your_community_link");
  });

  bot.action("support", (ctx) => {
    ctx.reply("Свяжитесь с поддержкой: @support_bot");
  });
};

