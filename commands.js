const { Markup } = require('telegraf');

module.exports.startCommand = (ctx) => {
    const appUrl = process.env.APP_URL || "arhippticyn.github.io/nftbot/";

    ctx.reply("Привет! Нажми кнопку, чтобы открыть приложение.", 
        Markup.inlineKeyboard([
            Markup.button.url("🔗 Открыть приложение", appUrl)
        ])
    );
};