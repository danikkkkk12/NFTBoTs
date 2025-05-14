const { Markup } = require('telegraf');

module.exports.startCommand = (ctx) => {
    const appUrl = process.env.APP_URL || "https://nftbot-zaq3.onrender.com";

    ctx.reply("Привет! Нажми кнопку, чтобы открыть мини-приложение.", 
        Markup.inlineKeyboard([
            Markup.button.webApp("🚀 Открыть приложение", appUrl)
        ])
    );
};
