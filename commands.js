const { Markup } = require("telegraf");
const fs = require("fs");
const User = require("./models/user");

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const imagePath = "./content/nft.png";

// Функция для обновления активности пользователя
async function logUserAction(tgId, actionType) {
  try {
    await User.findOneAndUpdate(
      { telegramId: tgId },
      {
        $set: { lastActive: new Date() },
        $inc: { [`actions.${actionType}`]: 1 }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Ошибка при логировании действия ${actionType}:`, err);
  }
}

module.exports.startCommand = async (ctx) => {
  const tgId = ctx.from.id;
  const { username, first_name, last_name } = ctx.from;

  try {
    // Логируем действие start
    await logUserAction(tgId, 'start');

    // Получаем аватар
    let avatarUrl = "default-avatar-url.jpg";
    try {
      const photos = await ctx.telegram.getUserProfilePhotos(tgId);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await ctx.telegram.getFile(fileId);
        avatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      }
    } catch (err) {
      console.warn("⚠️ Не удалось получить аватар:", err.message);
    }

    // Обновляем данные пользователя
    const updatedUser = await User.findOneAndUpdate(
      { telegramId: tgId },
      {
        $set: {
          username: username || undefined,
          firstName: first_name || "NoName",
          lastName: last_name || undefined,
          avatar: avatarUrl,
          lastActive: new Date()
        },
        $setOnInsert: {
          telegramId: tgId,
          balance: 0,
          actions: {}
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Отправляем фото
    try {
      await ctx.replyWithPhoto({ source: fs.createReadStream(imagePath) });
    } catch (err) {
      console.warn("⚠️ Не удалось отправить изображение:", err.message);
    }

    const urlWithId = `${appUrl}?tgId=${tgId}`;
    await ctx.reply(
      "⬇ Выбери действие ниже:",
      Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Открыть приложение 🚀", urlWithId)],
        [Markup.button.webApp("📜 User Agreement 📜", agreementUrl)],
        [Markup.button.callback("🌐 Join Community 🌐", "community")],
        [Markup.button.callback("❓ Support", "support")],
      ])
    );
  } catch (err) {
    if (err.code === 11000) {
      console.error("⚠️ Конфликт уникального поля:", err.keyValue);
      await ctx.reply("❌ Ошибка: данные уже существуют (например, номер телефона).");
    } else {
      console.error("❌ Ошибка при /start:", err);
      await ctx.reply("⚠️ Произошла ошибка. Попробуйте позже.");
    }
  }
};

module.exports.buttonActions = (bot) => {
  // Обработка нажатия на кнопку веб-приложения
  bot.action(/webApp:(.+)/, async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'openApp');
    // Дополнительная логика, если нужна
  });

  bot.action("community", async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'joinCommunity');
    ctx.reply("Присоединяйтесь к нашему сообществу: @your_community_link");
  });

  bot.action("support", async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'support');
    ctx.reply("Свяжитесь с поддержкой: @support_bot");
  });

  // Обработка данных из веб-приложения
  bot.on('web_app_data', async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'webAppInteraction');
    // Обработка данных из веб-приложения
  });
};