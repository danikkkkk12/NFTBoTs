const { Markup } = require('telegraf');

module.exports.startCommand = (ctx) => {
    const appUrl = process.env.APP_URL || "https://nftbot-1jm1.onrender.com";

    ctx.reply("Привет! Нажми кнопку, чтобы открыть приложение.", 
        Markup.inlineKeyboard([
            Markup.button.url("🔗 Открыть приложение", appUrl)
        ])
    );
};