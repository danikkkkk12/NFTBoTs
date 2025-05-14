const { Markup } = require('telegraf');

module.exports.startCommand = (ctx) => {
    const appUrl = "https://danikkkkk12.github.io/nftbot/";

    ctx.reply("Привет! Нажми кнопку, чтобы открыть мини-приложение.", 
        Markup.inlineKeyboard([
            Markup.button.webApp("🚀 Открыть приложение", appUrl)
        ])
    );
};

