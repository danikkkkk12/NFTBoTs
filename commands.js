const { Markup } = require("telegraf");
const fs = require("fs");
const User = require("./models/user");

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const imagePath = "./content/nft.png";

module.exports.startCommand = async (ctx) => {
  try {
    const tgId = ctx.from.id;

    await ctx.replyWithPhoto({ source: fs.createReadStream(imagePath) });

    await ctx.reply(
      "⬇ Выбери действие ниже:",
      Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Открыть приложение 🚀", appUrl)],
        [Markup.button.webApp("📜 User Agreement 📜", agreementUrl)],
        [Markup.button.callback("🌐 Join Community 🌐", "community")],
        [Markup.button.callback("❓ Support", "support ❓")],
      ])
    );

    let user = await User.findOne({ telegramId: tgId });

    if (!user) {
      user = await User.create({
        username: ctx.from.username || "",
        firstName: ctx.from.first_name || "NoName",
        telegramId: tgId,
      });
    }
  } catch (err) {
    console.error("❌ Помилка при /start:", err);
    await ctx.reply("⚠️ Сталася помилка при обробці команди /start.");
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
