const { Markup } = require("telegraf");
const fs = require("fs");
const User = require("./models/user");

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const imagePath = "./content/nft.png";

// Логирование действий пользователя
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
    console.log(`✅ Активность обновлена для ${tgId}: ${actionType}`);
  } catch (err) {
    console.error(`❌ Ошибка при логировании ${actionType}:`, err);
  }
}

// Команда /start
module.exports.startCommand = async (ctx) => {
  const tgId = ctx.from.id;
  const { username, first_name, last_name } = ctx.from;

  try {
    await logUserAction(tgId, 'start');

    // Получение аватара
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

    // Сохранение данных пользователя
    await User.findOneAndUpdate(
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

    // Отправка изображения
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
    console.error("❌ Ошибка при /start:", err);
    await ctx.reply("⚠️ Произошла ошибка. Попробуйте позже.");
  }
};

// Обработка нажатий и WebApp
module.exports.buttonActions = (bot) => {
  bot.on("web_app_data", async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'openApp');
    ctx.reply("✅ Приложение открыто! Активность сохранена.");
  });

  bot.action(/webapp:/i, async (ctx) => {
    const tgId = ctx.from.id;
    await logUserAction(tgId, 'openAppClick');
    console.log(`Пользователь ${tgId} кликнул на кнопку WebApp`);
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
};

