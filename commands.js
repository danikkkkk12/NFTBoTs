const { Markup } = require('telegraf');

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "сылка на соглашение"; 

module.exports.startCommand = (ctx) => {
    ctx.reply("Привет! Выбери действие:", 
        Markup.inlineKeyboard([
            [Markup.button.webApp("🚀 Открыть приложение", appUrl)],
            [Markup.button.webApp("📜 User Agreement", agreementUrl)],
            [Markup.button.callback("🌐 Join Community", "community")],
            [Markup.button.callback("❓ Support", "support")]
        ])
    );
};

module.exports.buttonActions = (bot) => {
    bot.action("community", (ctx) => {
        ctx.reply("Присоединяйтесь к нашему сообществу: @your_community_link");
    });

    bot.action("support", (ctx) => {
        ctx.reply("Свяжитесь с поддержкой: @support_bot");
    });
};
